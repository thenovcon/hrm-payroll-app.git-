'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Briefcase } from 'lucide-react';

interface DeptHiringViewProps {
    vacancies: any[]; // Expecting Prisma result from getDeptVacancies
}

export default function DeptHiringView({ vacancies }: DeptHiringViewProps) {
    if (vacancies.length === 0) {
        return (
            <Card className="border-dashed bg-slate-50 dark:bg-slate-900/50">
                <CardContent className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                    <Briefcase className="w-10 h-10 mb-2 opacity-20" />
                    <p>No active vacancies in your department.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <CardDescription>
                                <Badge variant={job.status === 'PUBLISHED' ? 'default' : 'secondary'} className="mt-1">
                                    {job.status}
                                </Badge>
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                            <Users className="w-4 h-4" />
                            <span>{job._count?.applications || 0} Applicants</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end mt-4">
                            <div className="flex -space-x-2">
                                {/* Mock Applicant Avatars just for visual fill */}
                                {job._count?.applications > 0 && Array.from({ length: Math.min(3, job._count.applications) }).map((_, i) => (
                                    <Avatar key={i} className="w-8 h-8 border-2 border-background">
                                        <AvatarFallback className="text-[10px] bg-primary/20">A{i + 1}</AvatarFallback>
                                    </Avatar>
                                ))}
                                {job._count?.applications > 3 && (
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-background flex items-center justify-center text-[10px] font-medium">
                                        +{job._count.applications - 3}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
