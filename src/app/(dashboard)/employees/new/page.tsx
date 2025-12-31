import EmployeeForm from '@/components/employees/EmployeeForm';

export default function NewEmployeePage() {
    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Add New Employee</h1>
                <p className="text-gray-500">Enter the details of the new hire.</p>
            </div>

            <EmployeeForm />
        </div>
    );
}
