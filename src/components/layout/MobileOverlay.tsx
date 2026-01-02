'use client';

import { useSidebar } from './SidebarContext';
import styles from './Sidebar.module.css';

export default function MobileSidebarOverlay() {
    const { isOpen, closeSidebar } = useSidebar();

    if (!isOpen) return null;

    return (
        <div
            className={styles.mobileOverlay}
            onClick={closeSidebar}
        />
    );
}
