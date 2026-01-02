import Link from 'next/link';
import React from 'react';

export default function UserGuidePage() {
    return (
        <div className="max-w-5xl mx-auto p-6 md:p-10">
            {/* Header with Navigation */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="bg-primary-50 p-3 rounded-xl">
                        <span className="text-3xl">📖</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">User Guide</h1>
                        <p className="text-slate-500">Documentation & Resources</p>
                    </div>
                </div>
                <div className="mt-4 md:mt-0">
                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="md:col-span-2 space-y-8">
                    <section className="prose prose-slate max-w-none">
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Welcome to the Novcon Ghana HRM+ User Guide. This comprehensive resource is designed to assist you in navigating the platform, managing your workforce, and understanding our compliance standards.
                        </p>
                    </section>

                    {/* Modules Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { title: 'Employee Management', icon: '👥', href: '/employees', desc: 'Manage profiles & records' },
                            { title: 'Payroll Processing', icon: '💰', href: '/payroll', desc: 'Run payroll & view slips' },
                            { title: 'Leave Requests', icon: '🏖️', href: '/leave', desc: 'Apply & approve leave' },
                            { title: 'Attendance', icon: '⏰', href: '/attendance', desc: 'Track daily logs' },
                        ].map((item, i) => (
                            <Link key={i} href={item.href} className="flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-primary-200 transition-all group">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{item.icon}</span>
                                    <h3 className="font-bold text-slate-800 group-hover:text-primary-600">{item.title}</h3>
                                </div>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </Link>
                        ))}
                    </div>

                    {/* FAQ Section */}
                    <section className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-1">How do I reset my password?</h4>
                                <p className="text-slate-600 text-sm">Navigate to the login page and click "Forgot Password". Follow the email instructions to reset your credentials.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 mb-1">Who do I contact for payroll discrepancies?</h4>
                                <p className="text-slate-600 text-sm">Use the "Dispute Resolution" link in the sidebar or submit a ticket via the Help menu.</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar / Legal Links */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                            <span className="mr-2">⚖️</span> Legal & Compliance
                        </h3>
                        <nav className="flex flex-col gap-2">
                            {[
                                { label: 'Terms of Service', href: '/legal/terms-of-service' },
                                { label: 'Privacy Policy', href: '/legal/privacy-policy' },
                                { label: 'Acceptable Use Policy', href: '/legal/acceptable-use-policy' },
                                { label: 'Data Processing', href: '/legal/data-processing-agreement' },
                                { label: 'Service Level Agreement', href: '/legal/service-level-agreement' },
                            ].map((link, i) => (
                                <Link key={i} href={link.href} className="text-sm text-slate-600 hover:text-primary-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                        <h3 className="font-bold text-indigo-900 mb-2">Need more help?</h3>
                        <p className="text-sm text-indigo-700 mb-4">Our support team is available 24/7 to assist you.</p>
                        <Link href="/support/contact" className="block w-full text-center py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
