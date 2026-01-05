'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { approveGoal, rejectGoal } from '@/lib/actions/goal-actions';
import { Check, X } from 'lucide-react';

interface GoalReviewProps {
    goals: any[]; // Expecting goals with employee included
}

export default function GoalReview({ goals }: GoalReviewProps) {
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [comment, setComment] = useState('');
    const [activeGoalId, setActiveGoalId] = useState<string | null>(null);

    const pendingGoals = goals.filter(g => g.approvalStatus === 'PENDING');

    async function handleApprove(id: string) {
        setSubmitting(id);
        try {
            await approveGoal(id, comment);
            setComment('');
            setActiveGoalId(null);
        } finally {
            setSubmitting(null);
        }
    }

    async function handleReject(id: string) {
        if (!comment) return alert('Please provide a reason for rejection.');
        setSubmitting(id);
        try {
            await rejectGoal(id, comment);
            setComment('');
            setActiveGoalId(null);
        } finally {
            setSubmitting(null);
        }
    }

    if (pendingGoals.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="pt-6 text-center text-muted-foreground">
                    <p>No goals pending approval.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {pendingGoals.map((goal) => (
                <Card key={goal.id}>
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-base">{goal.title}</CardTitle>
                                <CardDescription>
                                    Submitted by <span className="font-semibold text-foreground">{goal.employee.firstName} {goal.employee.lastName}</span>
                                </CardDescription>
                            </div>
                            <Badge variant="outline">Pending Review</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>

                        {activeGoalId === goal.id ? (
                            <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                                <Textarea
                                    placeholder="Add a comment (Optional for approval, Required for rejection)"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="text-sm"
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleReject(goal.id)}
                                        disabled={!!submitting}
                                    >
                                        <X className="w-4 h-4 mr-1" /> Reject
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleApprove(goal.id)}
                                        disabled={!!submitting}
                                    >
                                        <Check className="w-4 h-4 mr-1" /> Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setActiveGoalId(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button size="sm" variant="outline" onClick={() => setActiveGoalId(goal.id)}>
                                Review Goal
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
