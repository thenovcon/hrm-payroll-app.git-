import { auth } from '@/auth';
import { getUpcomingOneOnOnes } from '@/lib/engagement';
import { getUpcomingBirthdays } from '@/lib/birthdays';
import { getNewsletters } from '@/lib/actions/newsletter-actions';
import NewsletterFeed from '@/components/engagement/NewsletterFeed'; // We'll create this client component

export default async function EngagementPage() {
    const session = await auth();
    const user = session?.user;

    // Data Fetching
    const [upcomingSessions, birthdays, newsletters] = await Promise.all([
        user ? getUpcomingOneOnOnes(user.id as string, (user as any).role) : [],
        getUpcomingBirthdays(),
        getNewsletters()
    ]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Engagement Center</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Col: 1:1 and Birthdays */}
                <div className="space-y-6 md:col-span-1">
                    {/* Birthdays */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🎂</div>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Birthdays This Month</h2>
                        <div className="space-y-3">
                            {birthdays.length === 0 ? (
                                <p className="text-sm text-slate-500">No upcoming birthdays.</p>
                            ) : (
                                birthdays.map((b, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">
                                            {b.day}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{b.firstName} {b.lastName}</p>
                                            <p className="text-xs text-slate-500">{b.department?.name}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 1:1s */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-slate-800">Your 1:1s</h2>
                            {/* Link to full booking page if needed */}
                        </div>
                        <div className="space-y-3">
                            {upcomingSessions.length === 0 ? (
                                <p className="text-slate-500 text-sm">No sessions scheduled.</p>
                            ) : (
                                upcomingSessions.map(session => (
                                    <div key={session.id} className="p-3 bg-slate-50 rounded-lg">
                                        <p className="font-medium text-slate-700 text-sm">
                                            {session.managerId === (user as any).employeeId ? session.employee.firstName : session.manager.firstName}
                                        </p>
                                        <p className="text-xs text-slate-500">{new Date(session.scheduledAt).toLocaleDateString()}</p>
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded mt-1 inline-block">Scheduled</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Middle/Right Col: Newsletters & Updates */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-slate-800">Company News & Updates</h2>
                            {/* Only Admin/HR should see this - check role in component or suppress button */}
                            {['ADMIN', 'HR_MANAGER', 'HR'].includes((user as any)?.role) && (
                                <a href="/engagement/newsletter/new" className="text-sm bg-primary-600 text-white px-3 py-1.5 rounded-lg">Post Update</a>
                            )}
                        </div>
                        <NewsletterFeed newsletters={newsletters} />
                    </div>
                </div>
            </div>
        </div>
    );
}
