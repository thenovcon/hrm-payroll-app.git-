import EmployeeList from '@/components/employees/EmployeeList';

export default function EmployeesPage() {
    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Employee Management</h1>
                <p className="text-gray-500">Manage your workforce, view profiles, and update details.</p>
            </div>

            <EmployeeList />
        </div>
    );
}
