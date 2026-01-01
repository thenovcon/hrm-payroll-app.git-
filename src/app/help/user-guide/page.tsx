import Link from "next/link";

export default function UserGuidePage() {
    return (
        <div className="container mx-auto max-w-5xl py-10 px-6 space-y-10">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">User Guide</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Welcome to the comprehensive documentation for the Novcon Ghana HRM & Payroll System.
                    Use this guide to verify functionalities, understand modules, and manage your workforce effectively.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SectionCard
                    title="Executive Dashboard"
                    description="Your central command center for real-time insights."
                    icon="📊"
                >
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li><strong>Workforce Metrics:</strong> View total active employees.</li>
                        <li><strong>Recruitment:</strong> Track active job postings.</li>
                        <li><strong>Attendance:</strong> Monitor daily presence in real-time.</li>
                        <li><strong>Financials:</strong> Check current payroll run status.</li>
                    </ul>
                </SectionCard>

                <SectionCard
                    title="Employee Management"
                    description="Centralized database for all personnel records."
                    icon="👥"
                >
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li><strong>Digital Profiles:</strong> Access personal info & docs.</li>
                        <li><strong>Onboarding:</strong> Manage new hire workflows.</li>
                        <li><strong>Hierarchy:</strong> Org structure and departments.</li>
                    </ul>
                </SectionCard>

                <SectionCard
                    title="Payroll Management"
                    description="Automated salary processing and compliance."
                    icon="💰"
                >
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li><strong>Salary Structure:</strong> Configure allowances & deductions.</li>
                        <li><strong>Payslips:</strong> Generate and distribute digital payslips.</li>
                        <li><strong>Tax & SSNIT:</strong> Automated statutory calculations.</li>
                    </ul>
                </SectionCard>

                <SectionCard
                    title="Leave & Attendance"
                    description="Track time, requests, and balances."
                    icon="📅"
                >
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li><strong>Leave Requests:</strong> Self-service portal for employees.</li>
                        <li><strong>Approvals:</strong> Manager & HR workflow.</li>
                        <li><strong>Daily Register:</strong> Clock-in/Clock-out logging.</li>
                    </ul>
                </SectionCard>

                <SectionCard
                    title="Recruitment (ATS)"
                    description="End-to-end hiring pipeline."
                    icon="🚀"
                >
                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li><strong>Job Postings:</strong> Pubish vacancies instantly.</li>
                        <li><strong>Pipeline:</strong> Move candidates from Applied to Offer.</li>
                        <li><strong>Interviews:</strong> Schedule and rate candidates.</li>
                    </ul>
                </SectionCard>

                <SectionCard
                    title="Support & Help"
                    description="Need assistance? We are here to help."
                    icon="🆘"
                >
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        If you encounter issues or need specific guidance, use the support tools.
                    </p>
                    <div className="flex gap-2">
                        <Link href="/help/support" className="text-sm font-medium text-blue-600 hover:underline">Contact Support</Link>
                        <span className="text-slate-300">|</span>
                        <Link href="/help/bug-report" className="text-sm font-medium text-blue-600 hover:underline">Report a Bug</Link>
                    </div>
                </SectionCard>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 text-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Still need help?</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Our support team is ready to assist you with technical issues or feature requests.</p>
                <Link
                    href="/help/support"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                    Open a Support Ticket
                </Link>
            </div>
        </div>
    );
}

function SectionCard({ title, description, icon, children }: { title: string, description: string, icon: string, children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="p-6 pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-2xl">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold leading-none tracking-tight text-slate-900 dark:text-white">{title}</h3>
                    </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{description}</p>
            </div>
            <div className="p-6 pt-0">
                {children}
            </div>
        </div>
    );
}
