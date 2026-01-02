
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const firstNames = [
    'Kwame', 'Kofi', 'Ama', 'Akosua', 'Yaw', 'Yaa', 'Kojo', 'Adwoa', 'Kwabena', 'Abena',
    'Kwaku', 'Akua', 'Kwadwo', 'Afia', 'Esi', 'Kweku', 'Efua', 'Akwasi', 'Akos', 'Nana',
    'Samuel', 'Emmanuel', 'Prince', 'Isaac', 'Daniel', 'Joseph', 'Richmond', 'Frank', 'Micheal', 'Seth',
    'Mary', 'Sarah', 'Elizabeth', 'Gifty', 'Comfort', 'Mercy', 'Gloria', 'Joyce', 'Alice', 'Beatrice'
];

const lastNames = [
    'Mensah', 'Osei', 'Appiah', 'Owusu', 'Asante', 'Boateng', 'Antwi', 'Agyapong', 'Frimpong', 'Opoku',
    'Amoah', 'Gyasi', 'Acheampong', 'Obeng', 'Danso', 'Abankwah', 'Sarpong', 'Kyeremeh', 'Tetteh', 'Lartey',
    'Quaye', 'Lamptey', 'Ocquaye', 'Addo', 'Dadzie', 'Arthur', 'Forson', 'Baffour', 'Boakye', 'Konadu'
];

const departments = [
    { name: 'Human Resources', code: 'HR' },
    { name: 'Finance', code: 'FIN' },
    { name: 'Engineering', code: 'ENG' },
    { name: 'Sales', code: 'SAL' },
    { name: 'Marketing', code: 'MKT' },
    { name: 'Operations', code: 'OPS' }
];

const positions = ['Associate', 'Senior Associate', 'Manager', 'Director', 'Intern'];

async function main() {
    console.log('🌱 Starting seed...');

    const hashedPassword = await hash('password123', 10);

    // 1. Create Departments
    const deptMap = new Map();
    for (const dept of departments) {
        // Upsert by code since it is unique
        const d = await prisma.department.upsert({
            where: { code: dept.code },
            update: { name: dept.name },
            create: {
                name: dept.name,
                code: dept.code
            },
        });
        deptMap.set(dept.name, d.id);
        console.log(`Created Dept: ${dept.name}`);
    }

    // 2. Create Admin (NovCon Admin)
    const adminEmail = 'admin@novcon.com';
    const existingAdmin = await prisma.user.findUnique({ where: { username: 'admin' } });

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                username: 'admin',
                password: hashedPassword,
                role: 'ADMIN',
                employee: {
                    create: {
                        firstName: 'System',
                        lastName: 'Admin',
                        email: adminEmail,
                        position: 'System Administrator',
                        departmentId: deptMap.get('Human Resources'),
                        dateJoined: new Date(),
                        status: 'ACTIVE',
                        // Helper fields
                        dateOfBirth: new Date('1990-01-01'),
                        gender: 'MALE',
                        phone: '0200000000',
                        employeeId: 'ADMIN-001',
                        employmentType: 'Permanent',
                        salaryStructure: {
                            create: {
                                basicSalary: 10000,
                                currency: 'GHS'
                            }
                        }
                    }
                }
            }
        });
        console.log('Created Admin User');
    }

    // 3. Generate 200 Employees (Scaled for Demo)
    const jobTitles = [
        'HR Assistant', 'HR Manager', 'Talent Acquisition',
        'Accountant', 'Financial Analyst', 'Payroll Officer',
        'Software Engineer', 'System Administrator', 'IT Support',
        'Sales Representative', 'Sales Manager', 'Business Development',
        'Marketing Exec', 'Digital Specialist', 'Brand Manager',
        'Operations Manager', 'Facilities Manager', 'Driver', 'Mechanic', 'Security Officer'
    ];

    for (let i = 0; i < 200; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const departmentName = departments[Math.floor(Math.random() * departments.length)].name;
        // Basic logic to pick a somewhat relevant job title or just random
        const position = jobTitles[Math.floor(Math.random() * jobTitles.length)];

        // Ensure unique email and username
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@novcon.com`;
        const username = `${firstName.toLowerCase()}${i}`;
        const employeeId = `EMP-${2025000 + i}`;

        // Check if user exists
        const exists = await prisma.user.findUnique({ where: { username } });
        if (exists) continue;

        const dateOfBirth = new Date(1970 + Math.floor(Math.random() * 30), 0, 1);
        const gender = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
        const basicSalary = 2000 + Math.floor(Math.random() * 25000); // Higher operational ceiling

        // Determine Role based on Position keywords
        let userRole = 'EMPLOYEE';
        if (position.includes('Manager') || position.includes('Director') || position.includes('Head')) userRole = 'DEPT_HEAD';
        if (position.includes('HR') || position.includes('Talent')) userRole = 'HR_MANAGER';
        if (position.includes('Payroll') || position.includes('Accountant')) userRole = 'PAYROLL_OFFICER';

        await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: userRole, // Mapped role
                employee: {
                    create: {
                        firstName,
                        lastName,
                        email,
                        position,
                        departmentId: deptMap.get(departmentName),
                        dateJoined: new Date(Date.now() - Math.floor(Math.random() * 31536000000 * 5)), // Joined within last 5 years
                        status: 'ACTIVE',

                        // New Required Fields
                        dateOfBirth,
                        gender,
                        phone: `0${Math.floor(Math.random() * 9)}0${Math.floor(Math.random() * 10000000)}`,
                        employeeId,
                        employmentType: 'Permanent',

                        // Salary Structure Relation
                        salaryStructure: {
                            create: {
                                basicSalary,
                                currency: 'GHS'
                            }
                        }
                    }
                }
            }
        });

        // Log progress every 20 users
        if (i % 20 === 0) console.log(`Created user ${i}/200: ${firstName} ${lastName}`);
    }

    console.log('✅ Seeding complete: 200 Ghanaian employees created.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
