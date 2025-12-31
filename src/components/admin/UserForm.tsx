'use client';

import { createUser } from '@/lib/actions/users';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={pending}>
            {pending ? 'Creating...' : 'Create User'}
        </button>
    );
}

export default function UserForm({ employees }: { employees: any[] }) {
    // Wrapper to match state signature if needed, or update action signature
    // For now simplistic wrapper
    const [state, dispatch] = useActionState(createUser, undefined);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
            alert('User created successfully');
        } else if (state?.error) {
            alert(state.error);
        }
    }, [state]);

    return (
        <form action={dispatch} ref={formRef}>
            <div className="form-group">
                <label>Username</label>
                <input className="searchInput" name="username" required style={{ width: '100%' }} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input className="searchInput" name="password" type="password" required style={{ width: '100%' }} />
            </div>
            <div className="form-group">
                <label>Role</label>
                <select className="searchInput" name="role" style={{ width: '100%' }}>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="HR">HR Manager</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="ADMIN">System Admin</option>
                </select>
            </div>
            <div className="form-group">
                <label>Link Employee (Optional)</label>
                <select className="searchInput" name="employeeId" style={{ width: '100%' }}>
                    <option value="">-- None --</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                    ))}
                </select>
            </div>
            <SubmitButton />
        </form>
    );
}
