'use client';

import React from 'react';
import { Target, ArrowDown, Users, User } from 'lucide-react';

export default function GoalHierarchyView({ companyGoals, departmentGoals, myGoals }: { companyGoals: any[], departmentGoals: any[], myGoals: any[] }) {

    // Mock hierarchy if empty
    // In a real app, we would link them by IDs. For V2 demo, we show them in tiers.

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Goal Alignment (OKRs)
            </h3>

            <div className="relative">
                {/* Vertical Connector Line */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-100 -z-10"></div>

                {/* Level 1: Company */}
                <div className="mb-8 relative animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold mb-3 shadow-sm border border-blue-200">
                        <Users className="w-3 h-3" /> Company Strategy
                    </div>
                    {companyGoals.length > 0 ? companyGoals.map(g => (
                        <div key={g.id} className="ml-0 bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm mb-2 max-w-2xl">
                            <h4 className="font-bold text-slate-800 text-lg">{g.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{g.description}</p>
                            <div className="mt-3 w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${g.progress}%` }}></div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-4 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm italic bg-slate-50">
                            No Company Goals defined yet.
                        </div>
                    )}
                </div>

                {/* Connector Arrow */}
                <div className="ml-5 text-slate-300 mb-2">
                    <ArrowDown className="w-4 h-4" />
                </div>

                {/* Level 2: Department */}
                <div className="mb-8 relative animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                    <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mb-3 shadow-sm border border-purple-200">
                        <Users className="w-3 h-3" /> Department OKRs
                    </div>
                    {departmentGoals.length > 0 ? departmentGoals.map(g => (
                        <div key={g.id} className="ml-4 bg-purple-50 border border-purple-100 p-4 rounded-xl shadow-sm mb-2 max-w-2xl">
                            <h4 className="font-bold text-slate-800">{g.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{g.description}</p>
                            <div className="mt-3 w-full bg-purple-200 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-purple-600 h-full rounded-full" style={{ width: `${g.progress}%` }}></div>
                            </div>
                        </div>
                    )) : (
                        <div className="ml-4 p-4 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm italic bg-slate-50">
                            No Department Goals aligned.
                        </div>
                    )}
                </div>

                {/* Connector Arrow */}
                <div className="ml-9 text-slate-300 mb-2">
                    <ArrowDown className="w-4 h-4" />
                </div>

                {/* Level 3: Personal */}
                <div className="ml-8 relative animate-in fade-in slide-in-from-left-4 duration-500 delay-500">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold mb-3 shadow-sm border border-emerald-200">
                        <User className="w-3 h-3" /> My Contributions
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myGoals.map(g => (
                            <div key={g.id} className="bg-white border border-slate-200 hover:border-emerald-400 p-4 rounded-xl shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-800">{g.title}</h4>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                                        ${g.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            g.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {g.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{g.description}</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${g.progress}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600">{g.progress}%</span>
                                </div>
                            </div>
                        ))}
                        {/* Empty State / Add New */}
                        <button className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all min-h-[120px]">
                            <Target className="w-6 h-6 mb-2 opacity-50" />
                            <span className="text-sm font-semibold">+ Align New Goal</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
