'use client';

import React from 'react';
import EmployeeDashboardV2 from '@/components/dashboard/EmployeeDashboardV2';

export default function AgentPortal({ employee, stats, attendance, skills }: any) {
    return (
        <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            <EmployeeDashboardV2
                employee={employee}
                stats={stats}
                attendance={attendance}
                skills={skills}
            />
        </div>
    );
}
