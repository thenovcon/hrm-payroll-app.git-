import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AuditOverview from '@/components/audit/AuditOverview';
import SystemAuditLog from '@/components/audit/SystemAuditLog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AuditPage() {
    const session = await auth();
    const role = session?.user?.role;

    // Strict Role Check - Only Admin or Accountant
    if (role !== 'ADMIN' && role !== 'ACCOUNTANT') {
        redirect('/portal');
    }

    // Mock Data for Overview
    const mockVarianceData = [
        { name: 'Jan', totalCost: 145000, netPay: 110000 },
        { name: 'Feb', totalCost: 148000, netPay: 112000 },
        { name: 'Mar', totalCost: 147000, netPay: 111500 },
        { name: 'Apr', totalCost: 152000, netPay: 115000 },
        { name: 'May', totalCost: 155000, netPay: 117000 },
        { name: 'Jun', totalCost: 159000, netPay: 120000 }, // Spikes
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Audit & Compliance</h1>
                    <p className="text-muted-foreground">Monitor payroll integrity, statutory compliance, and system activities.</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" asChild>
                        <Link href="/reports">
                            📂 Reports Center
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Top Cards & Variance Logic */}
            <AuditOverview data={mockVarianceData} />

            {/* Audit Logs */}
            <SystemAuditLog />
        </div>
    );
}
