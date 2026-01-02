import Sidebar from './Sidebar';
import Header from './Header';
import styles from './MainLayout.module.css';
import { SidebarProvider } from './SidebarContext';
import MobileSidebarOverlay from './MobileOverlay';

export default function MainLayout({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className={styles.container}>
                <MobileSidebarOverlay />
                <Sidebar />
                <div className={styles.mainWrapper}>
                    {header || <Header />}
                    <main className={styles.content}>
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
