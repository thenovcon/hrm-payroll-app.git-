import { auth } from '@/auth';
import SidebarClient from './SidebarClient';

const menuItems = [
  { label: 'Dashboard', href: '/', icon: '📊' },
  { label: 'Recruitment (ATS)', href: '/ats', icon: '📝', roles: ['ADMIN', 'HR_MANAGER', 'HR', 'DEPT_HEAD'] },
  { label: 'Employees', href: '/employees', icon: '👥', roles: ['ADMIN', 'HR_MANAGER', 'HR', 'DEPT_HEAD'] },
  { label: 'Leave Management', href: '/leave', icon: '🏖️' },
  { label: 'Attendance', href: '/attendance', icon: '⏰' },
  { label: 'Payroll', href: '/payroll', icon: '💰', roles: ['ADMIN', 'PAYROLL_OFFICER', 'ACCOUNTANT'] },
  { label: 'Performance', href: '/performance', icon: '📈' },
  { label: 'Engagement', href: '/engagement', icon: '🤝' },

  { label: 'Policies', href: '/policies', icon: '📚', roles: ['ADMIN', 'HR_MANAGER', 'DEPT_HEAD'] },
  { label: 'Training', href: '/training', icon: '🎓' },
  { label: 'Reports', href: '/reports', icon: '📑', roles: ['ADMIN', 'HR_MANAGER', 'HR', 'PAYROLL_OFFICER', 'ACCOUNTANT'] },
  { label: 'System Config', href: '/settings', icon: '⚙️', roles: ['ADMIN', 'HR_MANAGER'] },
];

export default async function Sidebar() {
  const session = await auth();
  const user = session?.user;

  if (!user) return null;

  const userRole = (user as any).role || 'EMPLOYEE';

  const filteredItems = menuItems.filter(item => {
    if (!item.roles) return true; // Accessible to all if no roles defined
    return item.roles.includes(userRole);
  });

  return (
    <SidebarClient
      user={{
        name: user.name,
        role: userRole,
        // Add other needed user props if any
      }}
      menuItems={filteredItems}
    />
  );
}

