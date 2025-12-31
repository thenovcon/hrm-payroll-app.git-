'use server';

import { prisma } from '@/lib/db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { startOfDay, endOfDay, differenceInMinutes, parse, format, isAfter } from 'date-fns';

// --- SHIFT ACTIONS ---

export async function getShifts() {
    try {
        const shifts = await prisma.shift.findMany({
            orderBy: { startTime: 'asc' }
        });
        return { success: true, data: shifts };
    } catch (error) {
        return { success: false, error: 'Failed to fetch shifts' };
    }
}

export async function createShift(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const name = formData.get('name') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const gracePeriod = parseInt(formData.get('gracePeriod') as string) || 15;
    const breakDuration = parseInt(formData.get('breakDuration') as string) || 60;
    const color = formData.get('color') as string || '#3b82f6';

    try {
        const shift = await prisma.shift.create({
            data: { name, startTime, endTime, gracePeriod, breakDuration, color }
        });
        revalidatePath('/attendance');
        return { success: true, data: shift };
    } catch (error) {
        return { success: false, error: 'Failed to create shift' };
    }
}

export async function assignShift(formData: FormData) {
    const employeeId = formData.get('employeeId') as string;
    const shiftId = formData.get('shiftId') as string;
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = formData.get('endDate') ? new Date(formData.get('endDate') as string) : null;

    try {
        await prisma.shiftAssignment.create({
            data: { employeeId, shiftId, startDate, endDate }
        });
        revalidatePath('/attendance');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to assign shift' };
    }
}

export async function getShiftAssignments() {
    try {
        const assignments = await prisma.shiftAssignment.findMany({
            include: {
                employee: true,
                shift: true
            },
            orderBy: { startDate: 'desc' }
        });
        return { success: true, data: assignments };
    } catch (error) {
        return { success: false, error: 'Failed to fetch assignments' };
    }
}

// --- ATTENDANCE ACTIONS ---

export async function getDailyAttendance(dateString?: string) {
    const date = dateString ? new Date(dateString) : new Date();
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    try {
        const records = await prisma.attendanceRecord.findMany({
            where: {
                date: {
                    gte: dayStart,
                    lte: dayEnd
                }
            },
            include: {
                employee: true,
                shift: true
            }
        });
        return { success: true, data: records };
    } catch (error) {
        return { success: false, error: 'Failed to fetch daily attendance' };
    }
}

export async function getEmployeeAttendance(employeeId: string, month: number, year: number) {
    // Basic implementation for monthly view
    try {
        const records = await prisma.attendanceRecord.findMany({
            where: {
                employeeId,
                date: {
                    gte: new Date(year, month - 1, 1),
                    lte: new Date(year, month, 0)
                }
            },
            orderBy: { date: 'asc' }
        });
        return { success: true, data: records };
    } catch (error) {
        return { success: false, error: 'Failed to fetch employee attendance' };
    }
}

export async function clockIn(data: {
    employeeId: string,
    method: string,
    lat?: number,
    lng?: number,
    locationName?: string
}) {
    const today = startOfDay(new Date());

    try {
        // Find current shift assignment for the employee
        const assignment = await prisma.shiftAssignment.findFirst({
            where: {
                employeeId: data.employeeId,
                startDate: { lte: today },
                OR: [
                    { endDate: null },
                    { endDate: { gte: today } }
                ]
            },
            include: { shift: true }
        });

        const shift = assignment?.shift;
        const now = new Date();

        // Calculate lateness
        let lateMinutes = 0;
        let status = 'PRESENT';

        if (shift) {
            const shiftStartStr = `${format(now, 'yyyy-MM-dd')} ${shift.startTime}`;
            const shiftStartTime = parse(shiftStartStr, 'yyyy-MM-dd HH:mm', new Date());
            const graceTime = shift.gracePeriod;

            if (isAfter(now, new Date(shiftStartTime.getTime() + graceTime * 60000))) {
                lateMinutes = differenceInMinutes(now, shiftStartTime);
                status = 'LATE';
            }
        }

        const record = await prisma.attendanceRecord.upsert({
            where: {
                employeeId_date: {
                    employeeId: data.employeeId,
                    date: today
                }
            },
            update: {
                clockIn: now,
                methodIn: data.method,
                latIn: data.lat,
                lngIn: data.lng,
                locationIn: data.locationName,
                status,
                lateMinutes,
                shiftId: shift?.id
            },
            create: {
                employeeId: data.employeeId,
                date: today,
                clockIn: now,
                methodIn: data.method,
                latIn: data.lat,
                lngIn: data.lng,
                locationIn: data.locationName,
                status,
                lateMinutes,
                shiftId: shift?.id
            }
        });

        revalidatePath('/attendance');
        return { success: true, data: record };
    } catch (error) {
        console.error('Clock-In Error:', error);
        return { success: false, error: 'Failed to clock in' };
    }
}

export async function clockOut(data: {
    employeeId: string,
    method: string,
    lat?: number,
    lng?: number,
    locationName?: string
}) {
    const today = startOfDay(new Date());

    try {
        const record = await prisma.attendanceRecord.findUnique({
            where: {
                employeeId_date: {
                    employeeId: data.employeeId,
                    date: today
                }
            },
            include: { shift: true }
        });

        if (!record || !record.clockIn) {
            return { success: false, error: 'No clock-in record found for today' };
        }

        const now = new Date();
        const hoursWorked = differenceInMinutes(now, record.clockIn) / 60;

        // Basic OT calculation: anything over 9 hours (including 1 hr break) or shift duration
        let overtimeMinutes = 0;
        if (record.shift) {
            const shiftStart = record.clockIn; // Simplified
            const shiftEndStr = `${format(now, 'yyyy-MM-dd')} ${record.shift.endTime}`;
            const plannedShiftEnd = parse(shiftEndStr, 'yyyy-MM-dd HH:mm', new Date());

            if (isAfter(now, plannedShiftEnd)) {
                overtimeMinutes = differenceInMinutes(now, plannedShiftEnd);
            }
        }

        await prisma.attendanceRecord.update({
            where: { id: record.id },
            data: {
                clockOut: now,
                methodOut: data.method,
                latOut: data.lat,
                lngOut: data.lng,
                locationOut: data.locationName,
                hoursWorked,
                overtimeMinutes
            }
        });

        revalidatePath('/attendance');
        return { success: true };
    } catch (error) {
        console.error('Clock-Out Error:', error);
        return { success: false, error: 'Failed to clock out' };
    }
}

// --- EXCEPTION ACTIONS ---

export async function getExceptions() {
    try {
        const exceptions = await prisma.attendanceException.findMany({
            include: {
                record: {
                    include: {
                        employee: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: exceptions };
    } catch (error) {
        return { success: false, error: 'Failed to fetch exceptions' };
    }
}

export async function submitException(formData: FormData) {
    const recordId = formData.get('recordId') as string;
    const type = formData.get('type') as string;
    const explanation = formData.get('explanation') as string;

    try {
        await prisma.attendanceException.create({
            data: { recordId, type, explanation }
        });
        revalidatePath('/attendance');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to submit exception' };
    }
}

export async function resolveException(id: string, status: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        await prisma.attendanceException.update({
            where: { id },
            data: {
                status,
                resolvedById: session.user.id,
                resolvedAt: new Date()
            }
        });
        revalidatePath('/attendance');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to resolve exception' };
    }
}
