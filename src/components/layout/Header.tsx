'use client';
import { FULL_VERSION } from '@/lib/version';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { logout } from '@/lib/actions/auth-actions';

import { useTheme } from "next-themes";

import NotificationBell from '@/components/common/NotificationBell';

import { useSidebar } from './SidebarContext';

interface HeaderProps {
    notifications?: any[];
}

export default function Header({ notifications = [] }: HeaderProps) {
    const router = useRouter();
    const { setTheme, theme } = useTheme();
    const { toggleSidebar } = useSidebar();

    useEffect(() => {
        console.log(`App Version: ${FULL_VERSION}`);
    }, []);

    const [showSettings, setShowSettings] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    // Removed manual dark mode state

    const settingsRef = useRef<HTMLDivElement>(null);
    const helpRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
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

    return (
        <header className={styles.header}>
            <button
                className={styles.hamburger}
                onClick={toggleSidebar}
                aria-label="Toggle Menu"
            >
                ☰
            </button>

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search employees, jobs, policies..."
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.actions}>
                {/* Notifications */}
                <NotificationBell notifications={notifications} />

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
                                {/* TODO: Replace 'me' with actual user ID from session context if available, or fetch it */}
                                <button
                                    onClick={() => handleSettingClick('/employees/me')}
                                    className={styles.settingItem}
                                >
                                    <span>👤</span> My Profile
                                </button>
                                <button
                                    onClick={() => handleSettingClick('/forgot-password')}
                                    className={styles.settingItem}
                                >
                                    <span>🔐</span> Change Password
                                </button>

                                <div className="px-4 py-3 border-t border-slate-100">
                                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Interface Theme</p>
                                    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setTheme("light")}
                                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${theme === 'light' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            title="Light Mode"
                                        >
                                            ☀️ Light
                                        </button>
                                        <button
                                            onClick={() => setTheme("dark")}
                                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${theme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            title="Dark Mode"
                                        >
                                            🌙 Dark
                                        </button>
                                        <button
                                            onClick={() => setTheme("system")}
                                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${theme === 'system' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            title="System Preference"
                                        >
                                            💻 Auto
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSettingClick('/settings')}
                                    className={styles.settingItem}
                                    style={{ borderTop: '1px solid var(--slate-100)' }}
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
                                    onClick={() => handleSettingClick('/support-portal/user-guide')}
                                    className={styles.settingItem}
                                >
                                    <span>📖</span> User Guide
                                </button>
                                <button
                                    onClick={() => handleSettingClick('/support-portal/user-guide')} // Creating placeholder for video tutorials or link to same guide
                                    className={styles.settingItem}
                                >
                                    <span>🎥</span> Video Tutorials
                                </button>
                                <button
                                    onClick={() => handleSettingClick('/support-portal/support')}
                                    className={styles.settingItem}
                                >
                                    <span>💬</span> Contact Support
                                </button>
                                <button
                                    onClick={() => handleSettingClick('/support-portal/bug-report')}
                                    className={styles.settingItem}
                                >
                                    <span>🐛</span> Report a Bug
                                </button>
                            </div>
                            <div className={styles.dropdownFooter} style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                                {FULL_VERSION}
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
