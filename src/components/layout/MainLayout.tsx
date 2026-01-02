import Sidebar from './Sidebar';
import Header from './Header';
import styles from './MainLayout.module.css';

export default function MainLayout({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) {
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.mainWrapper}>
                {header || <Header />}
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}
