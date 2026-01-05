'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AuditLogEntry {
    id: string;
    timestamp: Date;
    user: string;
    role: string;
    action: string;
    resource: string;
    details: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

const MOCK_LOGS: AuditLogEntry[] = [
    {
        id: '1',
        timestamp: new Date(),
        user: 'Payroll Officer',
        role: 'PAYROLL_OFFICER',
        action: 'UPDATE',
        resource: 'Payroll Settings',
        details: 'Changed SSNIT Tier 1 Rate from 13.0% to 13.5%',
        severity: 'HIGH'
    },
    {
        id: '2',
        timestamp: new Date(Date.now() - 3600000),
        user: 'HR Manager',
        role: 'HR_MANAGER',
        action: 'CREATE',
        resource: 'Employee',
        details: 'Added new employee: Kwame Mensah (Sales)',
        severity: 'MEDIUM'
    },
    {
        id: '3',
        timestamp: new Date(Date.now() - 7200000),
        user: 'System Admin',
        role: 'ADMIN',
        action: 'LOGIN',
        resource: 'Auth',
        details: 'Successful login from IP 192.168.1.1',
        severity: 'LOW'
    }
];

export default function SystemAuditLog() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>System Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Resource</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Severity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_LOGS.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>{log.timestamp.toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{log.user}</span>
                                        <span className="text-xs text-muted-foreground">{log.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{log.action}</Badge>
                                </TableCell>
                                <TableCell>{log.resource}</TableCell>
                                <TableCell className="text-sm">{log.details}</TableCell>
                                <TableCell>
                                    <Badge variant={log.severity === 'HIGH' ? 'destructive' : log.severity === 'MEDIUM' ? 'secondary' : 'outline'}>
                                        {log.severity}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
