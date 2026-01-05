'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, Plus } from 'lucide-react';

export default function VacancyBoard({ vacancies }: { vacancies: any[] }) {
    // Group by status
    const columns = ['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED'];

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Recruitment Pipeline</h2>
                    <p className="text-sm text-slate-500">Manage your active job requisitions and candidate pools.</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> New Requisition
                </button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-6 min-w-[1000px] h-full">
                    {columns.map(status => {
                        const items = vacancies.filter((v: any) => (v.jobPosting?.status || 'DRAFT') === status);

                        return (
                            <div key={status} className="w-80 flex flex-col bg-slate-50/50 rounded-xl border border-slate-200 h-full max-h-[70vh]">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-slate-50/95 backdrop-blur-sm rounded-t-xl z-10">
                                    <h3 className="font-semibold text-slate-700 text-sm">{status}</h3>
                                    <Badge variant="outline" className="bg-white text-slate-500">{items.length}</Badge>
                                </div>
                                <div className="p-3 space-y-3 overflow-y-auto flex-1">
                                    {items.map((req: any) => (
                                        <Card key={req.id} className="cursor-pointer hover:shadow-md transition-all border-slate-200 group">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge variant={req.priority === 'HIGH' ? 'destructive' : 'secondary'} className="text-[10px]">
                                                        {req.priority}
                                                    </Badge>
                                                    <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm mb-1">{req.title}</h4>
                                                <p className="text-xs text-slate-500 mb-3">{req.department} • {req.location}</p>

                                                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                                    <div className="flex -space-x-2">
                                                        {/* Mock Avatars for candidates */}
                                                        {[...Array(Math.min(3, req.jobPosting?.applications?.length || 0))].map((_, i) => (
                                                            <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">
                                                                C{i + 1}
                                                            </div>
                                                        ))}
                                                        {(req.jobPosting?.applications?.length || 0) > 3 && (
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">
                                                                +{req.jobPosting.applications.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-slate-400">
                                                        {req.jobPosting?.applications?.length || 0} applicants
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {items.length === 0 && (
                                        <div className="text-center py-8 opacity-50 border-2 border-dashed border-slate-200 rounded-lg">
                                            <p className="text-xs text-slate-400">No vacancies</p>
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
