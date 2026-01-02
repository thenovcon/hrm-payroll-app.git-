'use client';

import { useState } from 'react';
import { updateGoalProgress } from '@/lib/actions/goal-actions';

export default function GoalCard({ goal }: { goal: any }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [progress, setProgress] = useState(goal.progress);

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${goal.level === 'COMPANY' ? 'bg-purple-100 text-purple-700' :
                            goal.level === 'DEPARTMENT' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                        }`}>
                        {goal.level}
                    </span>
                    <h3 className="font-semibold text-slate-800 mt-1">{goal.title}</h3>
                </div>
                <span className="text-xs text-slate-500">{goal.dueDate ? new Date(goal.dueDate).toLocaleDateString() : 'No Deadline'}</span>
            </div>

            <p className="text-sm text-slate-600 mb-2">{goal.description}</p>

            {/* Why & How (Collapsible or just small text) */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-2 rounded mb-3">
                <div>
                    <strong className="text-slate-700 block mb-1">Why (Relevance)</strong>
                    <p className="text-slate-500">{goal.relevance || 'Not specified'}</p>
                </div>
                <div>
                    <strong className="text-slate-700 block mb-1">How (Strategy)</strong>
                    <p className="text-slate-500">{goal.strategy || 'Not specified'}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Update Action */}
            <button
                onClick={() => {
                    const newProg = prompt('Enter new progress (0-100):', progress.toString());
                    if (newProg && !isNaN(Number(newProg))) {
                        updateGoalProgress(goal.id, Number(newProg));
                        setProgress(Number(newProg));
                    }
                }}
                className="text-xs text-primary-600 font-medium hover:underline"
            >
                Update Progress
            </button>
        </div>
    );
}
