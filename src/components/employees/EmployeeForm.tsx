'use client';

import { createEmployee } from '@/lib/actions/createEmployee';
import { useState } from 'react';

export default function EmployeeForm() {
    const [loading, setLoading] = useState(false);

    // Client-side validation for Ghana Card can be added here

    const handleSubmit = async (formData: FormData) => {
        await createEmployee(formData);
    };

    return (
        <form action={handleSubmit} className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem' }}>Personal Information</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>First Name</label>
                    <input type="text" name="firstName" required className="searchInput" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Last Name</label>
                    <input type="text" name="lastName" required className="searchInput" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
                    <input type="email" name="email" required className="searchInput" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Phone</label>
                    <input type="tel" name="phone" required className="searchInput" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date of Birth</label>
                    <input type="date" name="dateOfBirth" required className="searchInput" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Gender</label>
                    <select name="gender" required className="searchInput">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
            </div>

            <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem', marginTop: '2rem' }}>Employment Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Employee ID</label>
                    <input type="text" name="employeeId" required placeholder="EMP001" className="searchInput" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Position</label>
                    <input type="text" name="position" required className="searchInput" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Department</label>
                    <select name="department" required className="searchInput">
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Employment Type</label>
                    <select name="employmentType" required className="searchInput">
                        <option value="Permanent">Permanent</option>
                        <option value="Contract">Contract</option>
                        <option value="Casual">Casual</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date Joined</label>
                    <input type="date" name="dateJoined" required className="searchInput" />
                </div>
            </div>

            <h2 className="text-xl font-bold" style={{ marginBottom: '1.5rem', marginTop: '2rem' }}>Statutory IDs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ghana Card Number</label>
                    <input type="text" name="ghanaCardNumber" placeholder="GHA-000000000-0" className="searchInput" />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>SSNIT Number</label>
                    <input type="text" name="ssnitNumber" className="searchInput" />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ border: '1px solid var(--slate-300)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Employee'}
                </button>
            </div>
        </form>
    );
}
