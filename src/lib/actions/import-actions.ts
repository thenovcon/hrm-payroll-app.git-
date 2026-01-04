'use server';

import { prisma } from '@/lib/db/prisma';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';

/**
 * Bulk Import Employees
 * Expected CSV Columns: firstName, lastName, email, department, position, basicSalary
 */
export async function bulkImportEmployees(data: any[]) {
    try {
        let successCount = 0;
        let errors = [];
        const defaultPassword = await hash('novcon123', 10);

        // Fetch Department Map for quick lookup
        const departments = await prisma.department.findMany();
        const deptMap = new Map(departments.map(d => [d.name.toLowerCase(), d.id]));
        const deptCodeMap = new Map(departments.map(d => [d.code.toLowerCase(), d.id]));

        for (const row of data) {
            // Basic Validation
            if (!row.email || !row.firstName || !row.lastName) {
                errors.push(`Skipped: Missing fields for ${row.email || 'Unknown'}`);
                continue;
            }

            try {
                // Resolve Department
                let departmentId = null;
                if (row.department) {
                    const dName = row.department.toLowerCase();
                    departmentId = deptMap.get(dName) || deptCodeMap.get(dName);

                    // Auto-create dept if missing (optional feature)
                    if (!departmentId) {
                        // For now, default to null or skip. Let's skip to be safe.
                        // errors.push(`Skipped: Department '${row.department}' not found.`);
                        // continue;
                    }
                }

                const basicSalary = parseFloat(row.basicSalary) || 0;

                // Create Employee & User
                await prisma.$transaction(async (tx) => {
                    const emp = await tx.employee.create({
                        data: {
                            firstName: row.firstName,
                            lastName: row.lastName,
                            email: row.email,
                            employeeId: row.employeeId || `IMP-${Math.floor(Math.random() * 10000)}`,
                            dateOfBirth: new Date('1990-01-01'), // Default
                            dateJoined: row.dateJoined ? new Date(row.dateJoined) : new Date(),
                            gender: row.gender || 'Unknown',
                            phone: row.phone || '0000000000',
                            position: row.position || 'Staff',
                            employmentType: 'Permanent',
                            status: 'ACTIVE',
                            departmentId: departmentId,
                            salaryStructure: {
                                create: {
                                    basicSalary: basicSalary
                                }
                            }
                        }
                    });

                    // Create User Account
                    // Username = part before @ of email
                    const username = row.email.split('@')[0];
                    await tx.user.create({
                        data: {
                            username: username,
                            password: defaultPassword,
                            role: 'EMPLOYEE',
                            status: 'ACTIVE',
                            employeeId: emp.id
                        }
                    });
                });

                successCount++;

            } catch (err: any) {
                if (err.code === 'P2002') {
                    errors.push(`Duplicate: ${row.email} already exists.`);
                } else {
                    errors.push(`Error import ${row.email}: ${err.message}`);
                }
            }
        }


        return {
            success: true,
            message: `Successfully imported ${successCount} employees.`,
            errorCount: errors.length,
            errors: errors.slice(0, 10) // Return first 10 errors
        };

    } catch (error: any) {
        console.error('Import Error:', error);
        return { success: false, error: 'Fatal import error' };
    }
}

/**
 * Bulk Import Leave Balances
 * Columns: email, leaveType (name), year, daysAllocated, daysUsed
 */
export async function importLeaveBalances(data: any[]) {
    try {
        let successCount = 0;
        let errors = [];

        // Pre-fetch all leave types for mapping
        const leaveTypes = await prisma.leaveType.findMany();
        const typeMap = new Map(leaveTypes.map(lt => [lt.name.toLowerCase(), lt.id]));
        const slugMap = new Map(leaveTypes.map(lt => [lt.slug.toLowerCase(), lt.id]));

        for (const row of data) {
            if (!row.email || !row.leaveType) {
                errors.push(`Skipped: Missing email or leave type.`);
                continue;
            }

            try {
                // Find User/Employee
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { username: row.email.split('@')[0] },
                            { employee: { email: row.email } }
                        ]
                    },
                    include: { employee: true }
                });

                if (!user || !user.employee) {
                    errors.push(`Employee not found for email: ${row.email}`);
                    continue;
                }

                // Resolve Leave Type
                const ltName = row.leaveType.toLowerCase();
                const typeId = typeMap.get(ltName) || slugMap.get(ltName);

                if (!typeId) {
                    errors.push(`Leave Type '${row.leaveType}' not found.`);
                    continue;
                }

                const year = parseInt(row.year) || new Date().getFullYear();
                const daysAllocated = parseInt(row.daysAllocated) || 0;
                const daysUsed = parseInt(row.daysUsed) || 0;

                await prisma.leaveBalance.upsert({
                    where: {
                        employeeId_leaveTypeId_year: {
                            employeeId: user.employee.id,
                            leaveTypeId: typeId,
                            year: year
                        }
                    },
                    update: {
                        daysAllocated,
                        daysUsed
                    },
                    create: {
                        employeeId: user.employee.id,
                        leaveTypeId: typeId,
                        year,
                        daysAllocated,
                        daysUsed
                    }
                });

                successCount++;

            } catch (err: any) {
                errors.push(`Error for ${row.email}: ${err.message}`);
            }
        }

        return {
            success: true,
            message: `Successfully imported ${successCount} leave balances.`,
            errorCount: errors.length,
            errors: errors.slice(0, 10)
        };

    } catch (error: any) {
        console.error('Leave Import Error:', error);
        return { success: false, error: 'Fatal leave import error' };
    }
}

/**
 * Bulk Import Historical Payroll (YTD)
 * Target: PayrollInput (Bonus, Arrears) OR just historical Payslip records?
 * Decision: Create a "Historical" PayrollRun and adding Payslips to it.
 * Columns: email, month, year, grossSalary, incomeTax, ssnitEmployee, netPay
 */
export async function importPayrollHistory(data: any[]) {
    try {
        let successCount = 0;
        let errors = [];

        // 1. Group data by Month/Year to create Runs first?
        // Actually, let's just create a "MIGRATED_HISTORY" run per month if it doesn't exist.

        for (const row of data) {
            if (!row.email || !row.month || !row.year) {
                errors.push(`Skipped: Missing keys for ${row.email || 'Unknown'}`);
                continue;
            }

            try {
                // Find User
                const user = await prisma.user.findFirst({
                    where: { OR: [{ username: row.email.split('@')[0] }, { employee: { email: row.email } }] },
                    include: { employee: true }
                });

                if (!user?.employee) {
                    errors.push(`Employee not found: ${row.email}`);
                    continue;
                }

                const month = parseInt(row.month);
                const year = parseInt(row.year);

                // Find or Create Run
                let run = await prisma.payrollRun.findUnique({
                    where: { month_year: { month, year } }
                });

                if (!run) {
                    run = await prisma.payrollRun.create({
                        data: {
                            month, year, status: 'PAID', // Historical is always PAID
                            totalCost: 0, totalNetPay: 0
                        }
                    });
                }

                // Create Payslip
                const basicSalary = parseFloat(row.basicSalary) || parseFloat(row.grossSalary) || 0;
                const grossSalary = parseFloat(row.grossSalary) || 0;
                const incomeTax = parseFloat(row.incomeTax) || 0;
                const ssnitEmployee = parseFloat(row.ssnitEmployee) || 0;
                const netPay = parseFloat(row.netPay) || 0;

                await prisma.payslip.create({
                    data: {
                        payrollRunId: run.id,
                        employeeId: user.employee.id,
                        basicSalary,
                        totalAllowances: grossSalary - basicSalary,
                        grossSalary,
                        taxableIncome: grossSalary - ssnitEmployee, // Approximation
                        incomeTax,
                        ssnitEmployee,
                        ssnitEmployer: 0, // Optional for history
                        tier2Employee: 0, tier2Employer: 0, // Optional
                        tier3Employee: 0, tier3Employer: 0,
                        totalDeductions: (grossSalary - netPay),
                        netPay
                    }
                });

                successCount++;

            } catch (err: any) {
                errors.push(`Error ${row.email}: ${err.message}`);
            }
        }

        return {
            success: true,
            message: `Successfully imported ${successCount} payroll records.`,
            errorCount: errors.length,
            errors: errors.slice(0, 10)
        };

    } catch (error: any) {
        console.error('Payroll Import Error:', error);
        return { success: false, error: 'Fatal payroll import error' };
    }
}

/**
 * Bulk Import Job Requisitions (ATS)
 * Columns: reqNumber, title, department, location, headcount, status
 */
export async function importJobRequisitions(data: any[]) {
    try {
        let successCount = 0;
        let errors = [];

        // Fetch Department Map
        const departments = await prisma.department.findMany();
        const deptMap = new Map(departments.map(d => [d.name.toLowerCase(), d.name])); // Map Name->Name (String field in Requisition)

        // Find Admin to attribute creation to (fallback)
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (!admin) throw new Error('No Admin found to owner requisitions');

        for (const row of data) {
            if (!row.title || !row.department) {
                errors.push(`Skipped: Missing title or department`);
                continue;
            }

            try {
                const headCount = parseInt(row.headcount) || 1;

                await prisma.requisition.create({
                    data: {
                        reqNumber: row.reqNumber || `REQ-IMP-${Math.floor(Math.random() * 10000)}`,
                        title: row.title,
                        department: deptMap.get(row.department.toLowerCase()) || row.department,
                        location: row.location || 'Head Office',
                        type: row.type || 'Full-time',
                        priority: (row.priority || 'MEDIUM').toUpperCase(),
                        status: (row.status || 'DRAFT').toUpperCase(),
                        headcount: headCount,
                        createdById: admin.id
                    }
                });

                successCount++;
            } catch (err: any) {
                if (err.code === 'P2002') errors.push(`Duplicate Req Number: ${row.reqNumber}`);
                else errors.push(`Error ${row.title}: ${err.message}`);
            }
        }

        return {
            success: true,
            message: `Successfully imported ${successCount} requisitions.`,
            errorCount: errors.length,
            errors: errors.slice(0, 10)
        };

    } catch (error: any) {
        console.error('ATS Import Error:', error);
        return { success: false, error: 'Fatal ATS import error' };
    }
}

/**
 * Bulk Import Performance Goals
 * Columns: email, title, description, status, progress,dueDate
 */
export async function importPerformanceGoals(data: any[]) {
    try {
        let successCount = 0;
        let errors = [];

        // Ensure "2024 Cycle" exists
        const cycle = await prisma.performanceCycle.upsert({
            where: { id: 'MIGRATED-2024' },
            create: { id: 'MIGRATED-2024', name: '2024 Annual Review', startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), status: 'ACTIVE' },
            update: {}
        });

        for (const row of data) {
            if (!row.email || !row.title) {
                errors.push(`Skipped: Missing email or title`);
                continue;
            }

            const user = await prisma.user.findFirst({ where: { employee: { email: row.email } }, include: { employee: true } });
            if (!user?.employee) {
                errors.push(`Employee not found: ${row.email}`);
                continue;
            }

            try {
                await prisma.performanceGoal.create({
                    data: {
                        employeeId: user.employee.id,
                        title: row.title,
                        description: row.description || '',
                        status: (row.status || 'IN_PROGRESS').toUpperCase(),
                        progress: parseInt(row.progress) || 0,
                        cycleId: cycle.id
                    }
                });
                successCount++;
            } catch (err: any) { errors.push(`Error ${row.email}: ${err.message}`); }
        }
        return { success: true, message: `Imported ${successCount} goals.`, errorCount: errors.length, errors: errors.slice(0, 5) };
    } catch (e: any) { return { success: false, error: e.message }; }
}

/**
 * Bulk Import Training (Certifications) - Mapping to Enrollment or Certification?
 * Schema: Certification model exists.
 * Columns: email, name, issuer, issueDate
 */
export async function importTrainingRecords(data: any[]) {
    try {
        let successCount = 0;
        let errors = [];

        for (const row of data) {
            if (!row.email || !row.name) {
                errors.push(`Skipped: Missing email or course name`);
                continue;
            }

            const user = await prisma.user.findFirst({ where: { employee: { email: row.email } }, include: { employee: true } });
            if (!user?.employee) {
                errors.push(`Employee not found: ${row.email}`);
                continue;
            }

            try {
                await prisma.certification.create({
                    data: {
                        employeeId: user.employee.id,
                        name: row.name,
                        issuer: row.issuer || 'External',
                        issueDate: row.issueDate ? new Date(row.issueDate) : new Date(),
                        credentialUrl: row.url || null,
                        certificateNumber: `CERT-${Math.floor(Math.random() * 100000)}`
                    }
                });
                successCount++;
            } catch (err: any) { errors.push(`Error ${row.email}: ${err.message}`); }
        }
        return { success: true, message: `Imported ${successCount} certifications.`, errorCount: errors.length, errors: errors.slice(0, 5) };
    } catch (e: any) { return { success: false, error: e.message }; }
}

/**
 * Manually revalidate all import-related paths
 * Call this ONCE after all batches are processed.
 */
export async function revalidateHRMPaths() {
    revalidatePath('/employees');
    revalidatePath('/leave');
    revalidatePath('/payroll');
    revalidatePath('/ats');
    revalidatePath('/performance');
    revalidatePath('/training');
    return { success: true };
}
