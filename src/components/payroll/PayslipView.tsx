export default function PayslipView({ payslip }: { payslip: any }) {
    if (!payslip) return <div>No data</div>;

    const currency = (amount: number) => `GHS ${amount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;

    return (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Courier New, monospace' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px dashed #ccc', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>COMPANY NAME LTD</h1>
                <p>PAYSLIP - {payslip.payrollRun?.month} / {payslip.payrollRun?.year}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                    <strong>Name:</strong> {payslip.employee.firstName} {payslip.employee.lastName}<br />
                    <strong>ID:</strong> {payslip.employee.employeeId}<br />
                    <strong>SSNIT No:</strong> {payslip.employee.ssnitNumber || 'N/A'}
                </div>
                <div style={{ textAlign: 'right' }}>
                    <strong>Run ID:</strong> {payslip.payrollRunId.substring(0, 8)}<br />
                    <strong>Date:</strong> {new Date(payslip.generatedAt).toLocaleDateString()}
                </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Description</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem' }}>Earnings</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem' }}>Deductions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '0.5rem' }}>Basic Salary</td>
                            <td style={{ textAlign: 'right', padding: '0.5rem' }}>{currency(payslip.basicSalary)}</td>
                            <td></td>
                        </tr>
                        {payslip.totalAllowances > 0 && (
                            <tr>
                                <td style={{ padding: '0.5rem' }}>Total Allowances</td>
                                <td style={{ textAlign: 'right', padding: '0.5rem' }}>{currency(payslip.totalAllowances)}</td>
                                <td></td>
                            </tr>
                        )}
                        <tr>
                            <td style={{ padding: '0.5rem' }}>SSNIT (5.5%)</td>
                            <td></td>
                            <td style={{ textAlign: 'right', padding: '0.5rem' }}>{currency(payslip.ssnitEmployee)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.5rem' }}>Income Tax (PAYE)</td>
                            <td></td>
                            <td style={{ textAlign: 'right', padding: '0.5rem' }}>{currency(payslip.incomeTax)}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr style={{ borderTop: '2px solid #000', fontWeight: 'bold' }}>
                            <td style={{ padding: '0.5rem' }}>Totals</td>
                            <td style={{ textAlign: 'right', padding: '0.5rem' }}>{currency(payslip.grossSalary)}</td>
                            <td style={{ textAlign: 'right', padding: '0.5rem' }}>{currency(payslip.totalDeductions)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div style={{ borderTop: '2px dashed #ccc', paddingTop: '1rem', textAlign: 'right' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', marginRight: '1rem' }}>NET PAY:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', border: '2px solid #000', padding: '0.5rem' }}>
                    {currency(payslip.netPay)}
                </span>
            </div>
        </div>
    );
}
