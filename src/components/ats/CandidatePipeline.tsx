'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, FileText, MoreHorizontal } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default function CandidatePipeline({ jobPosting }: { jobPosting: any }) {
    const stages = ['APPLIED', 'SCREENED', 'INTERVIEWING', 'OFFER_MADE', 'HIRED', 'REJECTED'];

    // Calculate stats
    const totalApps = jobPosting.applications.length;
    const avgScore = totalApps > 0
        ? Math.round(jobPosting.applications.reduce((acc: any, app: any) => acc + (app.aiMatchScore || 0), 0) / totalApps)
        : 0;

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">{jobPosting.title}</h2>
                    <p className="text-xs text-slate-500">Pipeline View • 30 Days Open</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Total Candidates</p>
                        <p className="font-bold text-slate-800">{totalApps}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400">Avg AI Match</p>
                        <p className="font-bold text-blue-600 flex items-center justify-end gap-1">
                            <Sparkles className="w-3 h-3" /> {avgScore}%
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-[1200px]">
                    {stages.map(stage => {
                        const candidates = jobPosting.applications.filter((a: any) => a.status === stage);

                        return (
                            <div key={stage} className="w-72 flex-shrink-0">
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stage.replace('_', ' ')}</h4>
                                    <Badge variant="secondary" className="text-[10px] h-5">{candidates.length}</Badge>
                                </div>

                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                                    {candidates.map((app: any) => (
                                        <Card key={app.id} className="relative group hover:shadow-md transition-all border-l-4 border-l-transparent hover:border-l-blue-500">
                                            <CardContent className="p-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                                                                {app.candidate.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h5 className="font-bold text-sm text-slate-800">{app.candidate.name}</h5>
                                                            <p className="text-[10px] text-slate-500 truncate max-w-[100px]">{app.candidate.email}</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-slate-300 hover:text-slate-600">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* AI Match Visual */}
                                                {(app.aiMatchScore !== null) && (
                                                    <div className="mt-3 bg-slate-50 rounded-lg p-2 border border-slate-100">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[10px] font-semibold text-blue-600 flex items-center gap-1">
                                                                <Sparkles className="w-3 h-3" /> AI Match
                                                            </span>
                                                            <span className={`text-[10px] font-bold ${app.aiMatchScore >= 80 ? 'text-green-600' :
                                                                    app.aiMatchScore >= 50 ? 'text-amber-600' : 'text-red-500'
                                                                }`}>
                                                                {app.aiMatchScore}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${app.aiMatchScore >= 80 ? 'bg-green-500' :
                                                                        app.aiMatchScore >= 50 ? 'bg-amber-400' : 'bg-red-400'
                                                                    }`}
                                                                style={{ width: `${app.aiMatchScore}%` }}
                                                            ></div>
                                                        </div>
                                                        {app.aiSummary && (
                                                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                                                                {app.aiSummary}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="mt-3 flex gap-2">
                                                    {app.resumeUrl && (
                                                        <a href={app.resumeUrl} target="_blank" className="text-[10px] flex items-center gap-1 text-slate-500 hover:text-blue-600 bg-white border border-slate-200 px-2 py-1 rounded">
                                                            <FileText className="w-3 h-3" /> CV
                                                        </a>
                                                    )}
                                                </div>

                                            </CardContent>
                                        </Card>
                                    ))}
                                    {candidates.length === 0 && (
                                        <div className="h-24 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center">
                                            <span className="text-slate-300 text-xs">Drop here</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
