import { auth } from '@/auth';
import { getUpcomingOneOnOnes } from '@/lib/engagement';
import { getUpcomingBirthdays } from '@/lib/birthdays';
import { getNewsletters } from '@/lib/actions/newsletter-actions';
import { getPosts } from '@/lib/actions/social-actions';
import { seedPerformanceEngagement } from '@/lib/actions/seedPerformanceEngagement';
import NewsletterFeed from '@/components/engagement/NewsletterFeed';
import SocialFeed from '@/components/social/SocialFeed';
import Link from 'next/link';

export default async function EngagementPage({ searchParams }: { searchParams: { seed?: string } }) {
    const session = await auth();
    const user = session?.user;

    if (searchParams?.seed === 'true') {
        await seedPerformanceEngagement();
    }

    // Parallel Data Fetching with Safety
    let upcomingSessions: any[] = [];
    let birthdays: any[] = [];
    let newsletters: any[] = [];
    let posts: any[] = [];

    try {
        [upcomingSessions, birthdays, newsletters, posts] = await Promise.all([
            user ? getUpcomingOneOnOnes(user.id as string, (user as any).role) : [],
            getUpcomingBirthdays(),
            getNewsletters(),
            getPosts(1, 20)
        ]);
    } catch (error) {
        console.error("Failed to fetch engagement data:", error);
        // Fallback to empty arrays so page renders
    }

    const isManager = (user as any)?.role === 'ADMIN' || (user as any)?.role === 'HR_MANAGER' || (user as any)?.role === 'DEPT_HEAD';

    // Mock Data Injection
    const mockPosts = [
        { id: 'p1', content: 'Just finished a great team lunch! 🍕', author: { firstName: 'Sarah', lastName: 'Jenkins', image: null }, likes: 12, comments: 4, createdAt: new Date(Date.now() - 3600000) },
        { id: 'p2', content: 'Welcome to the team, @Kofi! Excited to have you on board. 🚀', author: { firstName: 'David', lastName: 'Boateng', image: null }, likes: 25, comments: 8, createdAt: new Date(Date.now() - 86400000) },
    ];
    const finalPosts = posts.length > 0 ? posts : mockPosts;

    const mockNewsletters = [
        { id: 'n1', title: 'Q1 All-Hands Meeting Summary', publishedAt: new Date(), author: 'CEO Office' },
        { id: 'n2', title: 'New Health Insurance Benefits', publishedAt: new Date(Date.now() - 604800000), author: 'HR Dept' },
    ];
    const finalNewsletters = newsletters.length > 0 ? newsletters : mockNewsletters;

    const mockBirthdays = [
        { firstName: 'Emmanuel', lastName: 'Ofori', day: 15, department: { name: 'IT' } },
        { firstName: 'Jessica', lastName: 'Mensah', day: 22, department: { name: 'Marketing' } },
    ];
    const finalBirthdays = birthdays.length > 0 ? birthdays : mockBirthdays;

    const mockSessions = [
        { id: 's1', managerId: 'mgr1', employee: { firstName: 'Manager' }, manager: { firstName: 'Manager' }, scheduledAt: new Date(Date.now() + 86400000) },
    ];
    const finalSessions = upcomingSessions.length > 0 ? upcomingSessions : mockSessions;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">
                Engagement & Community
                <a href="/engagement?seed=true" className="text-xs font-normal text-slate-300 ml-3 hover:text-slate-500">(Seed Demo Data)</a>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Social Feed (Living stream of updates) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Social Feed Component */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-700 mb-3 px-2">Community Feed</h2>
                        <SocialFeed initialPosts={finalPosts as any} userId={user?.id as string} />
                    </div>

                    {/* Newsletters Block */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-slate-800">Official Company News</h2>
                            {isManager && (
                                <Link href="/engagement/newsletter/new" className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded hover:bg-primary-200">
                                    + Post News
                                </Link>
                            )}
                        </div>
                        <NewsletterFeed newsletters={finalNewsletters} />
                    </div>
                </div>

                {/* Right: Widgets (Birthdays, 1:1s, Quick Links) */}
                <div className="space-y-6">
                    {/* Birthdays */}
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🎂</div>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Celebrations</h2>
                        <div className="space-y-3">
                            {finalBirthdays.length === 0 ? (
                                <p className="text-sm text-slate-500">No birthdays this month.</p>
                            ) : (
                                finalBirthdays.map((b, i) => (
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
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Your 1:1 Sessions</h2>
                        <div className="space-y-3">
                            {finalSessions.length === 0 ? (
                                <p className="text-slate-500 text-sm">No upcoming sessions.</p>
                            ) : (
                                finalSessions.map((session: any) => (
                                    <div key={session.id} className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-slate-700 text-sm">
                                                {session.managerId === (user as any).employeeId ? session.employee.firstName : session.manager.firstName}
                                            </p>
                                            <p className="text-xs text-slate-500">{new Date(session.scheduledAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Upcoming</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
