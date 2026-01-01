import React from 'react';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import AgentPortal from '@/components/portal/AgentPortal';

export default async function Home() {
  const session = await auth();
  const userRole = (session?.user as any)?.role || 'EMPLOYEE';

  // If user is an employee, show Agent Portal
  if (userRole === 'EMPLOYEE' && session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        employee: {
          include: {
            department: true,
            leaveRequests: { where: { status: 'PENDING' } },
            enrollments: { where: { status: { in: ['ENROLLED', 'IN_PROGRESS'] } } }
          }
        }
      }
    });

    if (user?.employee) {
      const stats = {
        leaveBalance: 15, // TODO: Calculate from LeaveBalance
        pendingRequests: user.employee.leaveRequests.length,
        trainingProgress: 65, // TODO: Calculate from Enrollments
        attendanceRate: 95 // TODO: Calculate from AttendanceRecords
      };

      return <AgentPortal employee={user.employee} stats={stats} />;
    }
  }

  // Admin/HR Dashboard
  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Dashboard</h1>
        <p className="text-gray-500">Welcome to Novcon Ghana HRM & Payroll System</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Quick Stats Cards */}
        <div className="card">
          <h3 className="font-medium text-gray-500">Total Employees</h3>
          <p className="text-2xl font-bold" style={{ marginTop: '0.5rem' }}>142</p>
          <span style={{ fontSize: '0.875rem', color: 'var(--accent-teal)' }}>+4 new this month</span>
        </div>

        <div className="card">
          <h3 className="font-medium text-gray-500">Pending Leave</h3>
          <p className="text-2xl font-bold" style={{ marginTop: '0.5rem' }}>8</p>
          <span style={{ fontSize: '0.875rem', color: 'var(--accent-amber)' }}>Requires approval</span>
        </div>

        <div className="card">
          <h3 className="font-medium text-gray-500">Next Payroll</h3>
          <p className="text-2xl font-bold" style={{ marginTop: '0.5rem' }}>Jan 25</p>
          <span style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>24 days remaining</span>
        </div>
      </div>
    </div>
  );
}
