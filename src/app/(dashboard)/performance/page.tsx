import { auth } from '@/auth';
import { getMyGoals } from '@/lib/actions/goal-actions';
import { getReceivedFeedback, getFeedbackRequests } from '@/lib/actions/feedback-actions';
import GoalCard from '@/components/performance/GoalCard';

export default async function PerformancePage() {
    const session = await auth();
    const [goals, feedback, requests] = await Promise.all([
        getMyGoals(),
        getReceivedFeedback(),
        getFeedbackRequests()
    ]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Performance & Development</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Goals (My Objectives) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-slate-700">My Goals</h2>
                        <button className="text-sm bg-primary-600 text-white px-3 py-1.5 rounded-lg">+ New Goal</button>
                    </div>

                    <div className="space-y-4">
                        {goals.length === 0 ? (
                            <div className="text-center p-8 bg-slate-50 rounded-lg text-slate-500">
                                You haven't set any goals yet.
                            </div>
                        ) : (
                            goals.map(goal => <GoalCard key={goal.id} goal={goal} />)
                        )}
                    </div>
                </div>

                {/* Right: Feedback 360 */}
                <div className="space-y-6">
                    {/* Pending Requests */}
                    {requests.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                            <h3 className="font-semibold text-amber-800 mb-2">Feedback Requests</h3>
                            <div className="space-y-2">
                                {requests.map(req => (
                                    <div key={req.id} className="bg-white p-3 rounded border border-amber-100 text-sm">
                                        <p className="font-medium">{req.employee.firstName} asked for feedback.</p>
                                        <button className="mt-2 text-xs bg-amber-600 text-white px-2 py-1 rounded">Give Feedback</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Received Feedback */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Feedback Received</h2>
                        <div className="space-y-4">
                            {feedback.length === 0 ? (
                                <p className="text-sm text-slate-500">No feedback received yet.</p>
                            ) : (
                                feedback.map(item => (
                                    <div key={item.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-slate-700 text-sm">
                                                {item.anonymous ? 'Anonymous Peer' : `${item.provider.firstName} ${item.provider.lastName}`}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 italic">"{item.content}"</p>
                                        {item.rating && (
                                            <div className="text-yellow-500 text-xs mt-1">{'★'.repeat(item.rating)}</div>
                                        )}
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
