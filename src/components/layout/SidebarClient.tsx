'use client';

import Link from 'next/link';
import styles from './Sidebar.module.css';
import SidebarMenu from './SidebarMenu';
import { logout } from '@/lib/actions/auth-actions';
import { FULL_VERSION } from '@/lib/version';
import { useSidebar } from './SidebarContext';

interface SidebarClientProps {
    user: any;
    menuItems: any[];
}

export default function SidebarClient({ user, menuItems }: SidebarClientProps) {
    const { isOpen } = useSidebar();

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.logoContainer}>
                {/* <img src="/logo.png" alt="NovCon Logo" style={{ height: '32px', marginRight: '10px' }} /> */}
                <h1 className={styles.logoText}>NovCon Ghana HRM+</h1>
            </div>

            <nav className={styles.nav}>
                <SidebarMenu items={menuItems} />

                {(user.role === 'ADMIN') && (
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
                        <p className={styles.userRole} style={{ fontSize: '0.75rem', opacity: 0.8 }}>{user.role}</p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--slate-400)', marginBottom: '0.5rem' }}>
                    {FULL_VERSION}
                </div>

                <div style={{ margin: 0 }}>
                    <button
                        onClick={() => logout()}
                        className="btn"
                        style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}
