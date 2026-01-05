import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export interface ImportLogData {
    fileName: string;
    totalRecords: number;
    status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
    createdAt: Date;
    createdBy: string;
}

export default function ImportStatusCard({ lastImport }: { lastImport: ImportLogData | null }) {
    if (!lastImport) return null;

    return (
        <Card className="w-full mb-6 border-l-4 border-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Import Activity</CardTitle>
                {lastImport.status === 'COMPLETED' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                {lastImport.status === 'FAILED' && <AlertCircle className="h-4 w-4 text-red-500" />}
                {lastImport.status === 'PROCESSING' && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold">{lastImport.fileName}</p>
                        <p className="text-2xl font-bold">{lastImport.totalRecords} Records</p>
                    </div>
                    <Badge variant={lastImport.status === 'COMPLETED' ? 'default' : 'destructive'}>
                        {lastImport.status}
                    </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Processed on {new Date(lastImport.createdAt).toLocaleString()} by {lastImport.createdBy}
                </p>
            </CardContent>
        </Card>
    );
}
