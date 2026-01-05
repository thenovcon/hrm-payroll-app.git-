import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Check Enum (implied by usage)

    // 2. Find any Dept Head
    let deptHead = await prisma.user.findFirst({
        where: { role: 'DEPT_HEAD' },
        include: { employee: { include: { department: true } } }
    });

    if (!deptHead) {
        console.log('⚠️ No DEPT_HEAD found. Promoting a user...');
        // Find a user to promote
        const candidate = await prisma.user.findFirst({
            where: { role: 'EMPLOYEE', username: { not: 'admin' } },
            include: { employee: true }
        });

        if (candidate) {
            deptHead = await prisma.user.update({
                where: { id: candidate.id },
                data: { role: 'DEPT_HEAD' },
                include: { employee: { include: { department: true } } }
            });
            console.log(`✅ Promoted ${candidate.username} to DEPT_HEAD`);
        }
    } else {
        console.log(`✅ Found existing DEPT_HEAD: ${deptHead.username}`);
    }

    if (deptHead) {
        console.log(`| **DEPT_HEAD** | \`${deptHead.username}\` | \`password123\` | ${deptHead.employee?.department?.name || 'N/A'} |`);
    }

    // 3. Find HR Manager
    let hr = await prisma.user.findFirst({ where: { role: 'HR_MANAGER' } });
    if (!hr) {
        // Create or Promote
        console.log('⚠️ No HR_MANAGER found. Looking for "cobbina"...');
        const cobbina = await prisma.user.findUnique({ where: { username: 'cobbina' } });
        if (cobbina) {
            hr = await prisma.user.update({ where: { id: cobbina.id }, data: { role: 'HR_MANAGER' } });
            console.log('✅ Promoted cobbina to HR_MANAGER');
        }
    }
    if (hr) console.log(`| **HR_MANAGER** | \`${hr.username}\` | \`password123\` |`);

    // 4. Find Payroll Officer
    let payroll = await prisma.user.findFirst({ where: { role: 'PAYROLL_OFFICER' } });
    if (!payroll) {
        // promote someone
        const pCand = await prisma.user.findFirst({ where: { role: 'EMPLOYEE' } });
        if (pCand) {
            payroll = await prisma.user.update({ where: { id: pCand.id }, data: { role: 'PAYROLL_OFFICER' } });
            console.log(`✅ Promoted ${pCand.username} to PAYROLL_OFFICER`);
        }
    }
    if (payroll) console.log(`| **PAYROLL_OFFICER** | \`${payroll.username}\` | \`password123\` |`);

}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
