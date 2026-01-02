import Link from 'next/link';
import styles from './Sidebar.module.css';
import SidebarMenu from './SidebarMenu';
import HelpTrigger from '@/components/support/HelpTrigger';

const menuItems = [
  { label: 'Dashboard', href: '/', icon: '📊' },
  { label: 'Recruitment (ATS)', href: '/ats', icon: '📝', roles: ['ADMIN', 'HR'], subItems: [{ label: 'Analytics', href: '/ats/analytics' }] },
  { label: 'Employees', href: '/employees', icon: '👥', roles: ['ADMIN', 'HR'], subItems: [{ label: 'Analytics', href: '/employees/analytics' }] },
  { label: 'Leave Management', href: '/leave', icon: '🏖️' }, // All can see Leave
  { label: 'Attendance', href: '/attendance', icon: '⏰' },   // All can see Attendance (views differ)
  { label: 'Payroll', href: '/payroll', icon: '💰', roles: ['ADMIN', 'ACCOUNTANT'] },
  { label: 'Performance', href: '/performance', icon: '📈' }, // All? Usually yes for self-review.
  { label: 'Training', href: '/training', icon: '🎓' },       // All for LMS
  { label: 'Reports', href: '/reports', icon: '📑', roles: ['ADMIN', 'HR', 'ACCOUNTANT'] },
  { label: 'Settings', href: '/settings', icon: '⚙️', roles: ['ADMIN'] },
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
        <h1 className={styles.logoText}>Novcon Ghana HRM+</h1>
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

      {/* Help & Support Trigger */}
      <HelpTrigger />

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

