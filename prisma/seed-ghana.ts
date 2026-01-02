
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
                email: adminEmail,
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

    // 3. Generate 50 Employees
    for (let i = 0; i < 50; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const departmentName = departments[Math.floor(Math.random() * departments.length)].name;
        const position = positions[Math.floor(Math.random() * positions.length)];

        // Ensure unique email and username
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@novcon.com`;
        const username = `${firstName.toLowerCase()}${i}`;
        const employeeId = `EMP-${2024000 + i}`;

        // Check if user exists
        const exists = await prisma.user.findUnique({ where: { username } });
        if (exists) continue;

        const dateOfBirth = new Date(1970 + Math.floor(Math.random() * 30), 0, 1);
        const gender = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
        const basicSalary = 2000 + Math.floor(Math.random() * 15000);

        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: position === 'Director' || position === 'Manager' ? 'DEPT_HEAD' : 'EMPLOYEE',
                employee: {
                    create: {
                        firstName,
                        lastName,
                        email,
                        position,
                        departmentId: deptMap.get(departmentName),
                        dateJoined: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Random past date
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
    }

    console.log('✅ Seeding complete: 50 Ghanaian employees created.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
