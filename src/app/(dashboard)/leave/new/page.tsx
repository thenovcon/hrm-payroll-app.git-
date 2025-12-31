import LeaveRequestForm from '@/components/leave/LeaveRequestForm';
import { getEmployees } from '@/lib/actions/employee';
import { getLeaveTypes } from '@/lib/actions/leave';

export default async function NewLeaveRequestPage() {
    const [employeesResult, typesResult] = await Promise.all([
        getEmployees(),
        getLeaveTypes()
    ]);

    const employees = (employeesResult.success && employeesResult.data) ? employeesResult.data : [];
    const leaveTypes = (typesResult.success && typesResult.data) ? typesResult.data : [];

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Submit Leave Application</h1>
                <p className="text-gray-500">Request time off.</p>
            </div>

            <LeaveRequestForm leaveTypes={leaveTypes} employees={employees} />
        </div>
    );
}
