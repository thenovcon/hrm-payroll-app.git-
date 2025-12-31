'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SubMenuItem {
    label: string;
    href: string;
    tab?: string;
}

interface MenuItem {
    label: string;
    href: string;
    icon: string;
    subItems?: SubMenuItem[];
}

interface SidebarMenuProps {
    items: MenuItem[];
}

export default function SidebarMenu({ items }: SidebarMenuProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab');

    // Manage which dropdowns are open
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        'Recruitment (ATS)': true // Open by default if that's the preferred UX, or based on path
    });

    const toggleMenu = (label: string) => {
        setOpenMenus(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    return (
        <ul className={styles.navList}>
            {items.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isActive = pathname === item.href;
                const isOpen = openMenus[item.label];

                if (hasSubItems) {
                    return (
                        <li key={item.label} className={styles.navItem}>
                            <button
                                className={`${styles.dropdownToggle} ${isActive ? styles.activeLink : ''}`}
                                onClick={() => toggleMenu(item.label)}
                            >
                                <span className={styles.icon}>{item.icon}</span>
                                <span className={styles.label}>{item.label}</span>
                                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>▼</span>
                            </button>

                            {isOpen && (
                                <ul className={styles.subMenu}>
                                    {item.subItems!.map((sub) => {
                                        const subHref = sub.tab ? `${sub.href}?tab=${sub.tab}` : sub.href;
                                        const isSubActive = pathname === sub.href && (!sub.tab || activeTab === sub.tab);

                                        return (
                                            <li key={sub.label}>
                                                <Link
                                                    href={subHref}
                                                    className={`${styles.subNavLink} ${isSubActive ? styles.activeSubLink : ''}`}
                                                >
                                                    {sub.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    );
                }

                return (
                    <li key={item.href} className={styles.navItem}>
                        <Link
                            href={item.href}
                            className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
