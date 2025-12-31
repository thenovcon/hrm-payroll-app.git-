import PayslipView from '@/components/payroll/PayslipView';
import { getPayslips } from '@/lib/actions/payroll';

export default async function PayrollRunPage({ params }: { params: { id: string } }) {
    const result = await getPayslips(params.id);
    const payslips = (result.success && result.data) ? result.data : [];

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Payroll Run Details</h1>
                <p className="text-gray-500">Generated Payslips.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {payslips.length === 0 ? (
                    <p>No payslips generated for this run.</p>
                ) : (
                    payslips.map((slip: any) => (
                        <PayslipView key={slip.id} payslip={slip} />
                    ))
                )}
            </div>
        </div>
    );
}
