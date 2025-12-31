'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { logout } from '@/lib/actions/auth-actions';

export default function Header() {
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const notifRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);
    const helpRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
            if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
                setShowHelp(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSettingClick = (path: string) => {
        setShowSettings(false);
        router.push(path);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search employees, jobs, policies..."
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.actions}>
                {/* Notifications */}
                <div ref={notifRef} style={{ position: 'relative' }}>
                    <button
                        className={styles.actionBtn}
                        aria-label="Notifications"
                        title="Notifications"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <span className={styles.icon}>🔔</span>
                        <span className={styles.badge}>3</span>
                    </button>

                    {showNotifications && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHeader}>
                                <h3>Notifications</h3>
                                <button onClick={() => setShowNotifications(false)}>✕</button>
                            </div>
                            <div className={styles.dropdownContent}>
                                <div className={styles.notificationItem}>
                                    <span className={styles.notifIcon}>📋</span>
                                    <div>
                                        <p className={styles.notifTitle}>Leave Request Approved</p>
                                        <p className={styles.notifTime}>2 hours ago</p>
                                    </div>
                                </div>
                                <div className={styles.notificationItem}>
                                    <span className={styles.notifIcon}>💰</span>
                                    <div>
                                        <p className={styles.notifTitle}>Payslip Available</p>
                                        <p className={styles.notifTime}>1 day ago</p>
                                    </div>
                                </div>
                                <div className={styles.notificationItem}>
                                    <span className={styles.notifIcon}>📚</span>
                                    <div>
                                        <p className={styles.notifTitle}>New Training Assigned</p>
                                        <p className={styles.notifTime}>3 days ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.dropdownFooter}>
                                <button className={styles.viewAllBtn}>View All Notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings */}
                <div ref={settingsRef} style={{ position: 'relative' }}>
                    <button
                        className={styles.actionBtn}
                        aria-label="Settings"
                        title="Settings"
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <span className={styles.icon}>⚙️</span>
                    </button>

                    {showSettings && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHeader}>
                                <h3>Quick Settings</h3>
                                <button onClick={() => setShowSettings(false)}>✕</button>
                            </div>
                            <div className={styles.dropdownContent}>
                                <button
                                    onClick={() => handleSettingClick('/settings')}
                                    className={styles.settingItem}
                                >
                                    <span>👤</span> My Profile
                                </button>
                                <button
                                    onClick={() => handleSettingClick('/settings')}
                                    className={styles.settingItem}
                                >
                                    <span>🔐</span> Change Password
                                </button>
                                <button
                                    onClick={toggleDarkMode}
                                    className={styles.settingItem}
                                >
                                    <span>{darkMode ? '☀️' : '🌙'}</span> {darkMode ? 'Light Mode' : 'Dark Mode'}
                                </button>
                                <button
                                    onClick={() => handleSettingClick('/settings')}
                                    className={styles.settingItem}
                                >
                                    <span>🔔</span> Notification Preferences
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help */}
                <div ref={helpRef} style={{ position: 'relative' }}>
                    <button
                        className={styles.actionBtn}
                        aria-label="Help"
                        title="Help"
                        onClick={() => setShowHelp(!showHelp)}
                    >
                        <span className={styles.icon}>❓</span>
                    </button>

                    {showHelp && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHeader}>
                                <h3>Help & Support</h3>
                                <button onClick={() => setShowHelp(false)}>✕</button>
                            </div>
                            <div className={styles.dropdownContent}>
                                <button
                                    onClick={() => { setShowHelp(false); alert('User Guide coming soon!'); }}
                                    className={styles.settingItem}
                                >
                                    <span>📖</span> User Guide
                                </button>
                                <button
                                    onClick={() => { setShowHelp(false); alert('Video Tutorials coming soon!'); }}
                                    className={styles.settingItem}
                                >
                                    <span>🎥</span> Video Tutorials
                                </button>
                                <button
                                    onClick={() => { setShowHelp(false); alert('Contact Support: support@novcon.com'); }}
                                    className={styles.settingItem}
                                >
                                    <span>💬</span> Contact Support
                                </button>
                                <button
                                    onClick={() => { setShowHelp(false); alert('Please email bugs to: bugs@novcon.com'); }}
                                    className={styles.settingItem}
                                >
                                    <span>🐛</span> Report a Bug
                                </button>
                            </div>
                            <div className={styles.dropdownFooter} style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                                Version 1.0.0
                            </div>
                        </div>
                    )}
                </div>

                {/* Logout */}
                <form action={logout} style={{ margin: 0 }}>
                    <button
                        type="submit"
                        className={styles.logoutBtn}
                        aria-label="Logout"
                        title="Logout"
                    >
                        <span className={styles.logoutIcon}>🚪</span>
                        <span className={styles.logoutText}>Logout</span>
                    </button>
                </form>
            </div>
        </header>
    );
}
