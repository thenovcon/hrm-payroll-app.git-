'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CSVImporterProps {
    onImport: (data: any[]) => void;
    templateUrl?: string;
    label?: string;
}

export default function CSVImporter({ onImport, templateUrl, label = 'Upload CSV' }: CSVImporterProps) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            if (selected.type !== 'text/csv' && !selected.name.endsWith('.csv')) {
                setError('Please upload a valid CSV file.');
                return;
            }
            setFile(selected);
            setError(null);
            parseCSV(selected);
        }
    };

    const parseCSV = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter(l => l.trim() !== '');
            if (lines.length < 2) {
                setError('CSV must have a header and at least one data row.');
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const data: any[] = [];

            for (let i = 1; i < lines.length; i++) {
                // Determine if split by comma, handling potential quotes (simple version)
                // For a robust app, a library is better, but this suffices for standard CSVs
                const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));

                if (values.length === headers.length) {
                    const obj: any = {};
                    headers.forEach((h, index) => {
                        obj[h] = values[index];
                    });
                    data.push(obj);
                }
            }

            setPreview(data.slice(0, 3)); // Preview 3 rows
            onImport(data);
        };
        reader.readAsText(file);
    };

    const clearFile = () => {
        setFile(null);
        setPreview([]);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">{label}</h4>

            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-slate-600 font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400">CSV files only (max 5MB)</p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-700 text-sm">{file.name}</p>
                                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB • {preview.length > 0 ? 'Parsed Successfully' : 'Parsing...'}</p>
                            </div>
                        </div>
                        <button onClick={clearFile} className="text-slate-400 hover:text-rose-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-xs flex items-center gap-2 mb-3">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    {preview.length > 0 && (
                        <div className="overflow-hidden rounded-lg border border-slate-200 text-xs">
                            <div className="bg-slate-100 p-2 font-semibold text-slate-500 flex gap-4">
                                <span>Preview (First 3 Rows)</span>
                            </div>
                            <div className="bg-white p-3 space-y-1">
                                {preview.map((row, idx) => (
                                    <div key={idx} className="grid grid-cols-3 gap-2 text-slate-600 opacity-80">
                                        {Object.values(row).slice(0, 3).map((val: any, vIdx) => (
                                            <span key={vIdx} className="truncate">{val}</span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {templateUrl && (
                <div className="mt-2 text-right">
                    <a href={templateUrl} className="text-xs text-blue-600 hover:underline flex items-center justify-end gap-1">
                        Download Template <Upload className="w-3 h-3 rotate-180" />
                    </a>
                </div>
            )}
        </div>
    );
}
