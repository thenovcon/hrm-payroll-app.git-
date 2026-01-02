import { auth } from '@/auth';
import AttendanceClient from '@/components/attendance/AttendanceClient';

export default async function AttendancePage() {
    const session = await auth();
    const userRole = (session?.user as any)?.role || 'EMPLOYEE';

    return <AttendanceClient userRole={userRole} />;
}
