'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../layout/Sidebar.module.css';

import { FULL_VERSION } from '@/lib/version';

// Simple Popover Implementation
export default function HelpTrigger() {
    const [isOpen, setIsOpen] = useState(false);
    // ... (rest of component)
    // ...
    <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-100)', fontSize: '0.7rem', color: 'var(--slate-400)', textAlign: 'center' }}>
        {FULL_VERSION}
    </div>
    const triggerRef = useRef<HTMLButtonElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close on navigation
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <div style={{ position: 'relative', margin: '0 1rem 0.5rem' }}>
            <button
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                className={styles.navLink}
                style={{ width: '100%', justifyContent: 'flex-start', border: '1px solid var(--slate-200)' }}
            >
                <span style={{ marginRight: '0.75rem', fontSize: '1.2rem' }}>❓</span>
                <span className={styles.label}>Help & Support</span>
            </button>

            {isOpen && (
                <div
                    ref={popoverRef}
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '0',
                        width: '280px', // Wider than sidebar usually
                        marginBottom: '10px',
                        background: 'white',
                        border: '1px solid var(--slate-200)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        zIndex: 60,
                        padding: '1rem',
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--slate-800)' }}>Help & Support</h3>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--slate-400)' }}>×</button>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li>
                            <Link href="/support/user-guide" style={menuItemStyle}>
                                <span style={{ fontSize: '1.25rem', marginRight: '0.75rem' }}>📖</span>
                                User Guide
                            </Link>
                        </li>
                        <li>
                            <a href="#" style={{ ...menuItemStyle, opacity: 0.6, cursor: 'not-allowed' }} title="Coming Soon">
                                <span style={{ fontSize: '1.25rem', marginRight: '0.75rem' }}>🎥</span>
                                Video Tutorials
                            </a>
                        </li>
                        <li>
                            <Link href="/admin/tickets" style={menuItemStyle}>
                                <span style={{ fontSize: '1.25rem', marginRight: '0.75rem' }}>🎫</span>
                                My Support Tickets
                            </Link>
                        </li>
                        <hr style={{ margin: '0.5rem 0', borderColor: 'var(--slate-100)' }} />
                        <li>
                            <Link href="/support/contact" style={menuItemStyle}>
                                <span style={{ fontSize: '1.25rem', marginRight: '0.75rem' }}>💬</span>
                                Contact Support
                            </Link>
                        </li>
                        <li>
                            <Link href="/support/bug-report" style={menuItemStyle}>
                                <span style={{ fontSize: '1.25rem', marginRight: '0.75rem' }}>🐛</span>
                                Report a Bug
                            </Link>
                        </li>
                    </ul>

                    <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-100)', fontSize: '0.7rem', color: 'var(--slate-400)', textAlign: 'center' }}>
                        {FULL_VERSION}
                    </div>
                </div>
            )}
        </div>
    );
}

const menuItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    borderRadius: '6px',
    color: 'var(--slate-700)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'background 0.2s'
} as React.CSSProperties;
