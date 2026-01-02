import { prisma } from '@/lib/db/prisma';

export async function getUpcomingBirthdays() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDay = today.getDate();

    // Basic query - optimization: filtering by month in DB is tricky with dates, 
    // usually fetch all active and filter in code for small datasets, or raw SQL.
    // We'll fetch active employees with simplistic filtering

    const employees = await prisma.employee.findMany({
        where: { status: 'ACTIVE' },
        select: {
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            department: { select: { name: true } }
        }
    });

    // Filter for this month
    const birthdays = employees.filter(emp => {
        const dob = new Date(emp.dateOfBirth);
        return dob.getMonth() + 1 === currentMonth && dob.getDate() >= currentDay;
    }).map(emp => ({
        ...emp,
        day: new Date(emp.dateOfBirth).getDate()
    })).sort((a, b) => a.day - b.day);

    return birthdays.slice(0, 5); // Return next 5
}
