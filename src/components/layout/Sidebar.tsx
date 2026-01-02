import Link from 'next/link';
import styles from './Sidebar.module.css';
import SidebarMenu from './SidebarMenu';
import HelpTrigger from '@/components/support/HelpTrigger';

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

import { auth, signOut } from '@/auth';
import { FULL_VERSION } from '@/lib/version';

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
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        {/* <img src="/logo.png" alt="NovCon Logo" style={{ height: '32px', marginRight: '10px' }} /> */}
        <h1 className={styles.logoText}>NovCon Ghana HRM+</h1>
      </div>

      <nav className={styles.nav}>
        <SidebarMenu items={filteredItems} />

        {/* Admin Only Link - Super Admin specific if needed, or redundant now */}
        {(userRole === 'ADMIN') && (
          <ul className={styles.navList} style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-100)' }}>
            <li className={styles.navItem}>
              <Link href="/admin/users" className={styles.navLink}>
                <span className={styles.icon}>👮</span>
                <span className={styles.label}>Admin Users</span>
              </Link>
            </li>
          </ul>
        )}
      </nav>



      <div className={styles.footer}>
        <div className={styles.userProfile} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div className={styles.avatar} style={{ background: 'var(--primary-600)', color: 'white' }}>
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName} style={{ fontSize: '0.9rem' }}>{user.name}</p>
            <p className={styles.userRole} style={{ fontSize: '0.75rem', opacity: 0.8 }}>{(user as any).role}</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--slate-400)', marginBottom: '0.5rem' }}>
          {FULL_VERSION}
        </div>

        <form action={async () => {
          'use server';
          await signOut();
        }}>
          <button type="submit" className="btn" style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}>
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}

