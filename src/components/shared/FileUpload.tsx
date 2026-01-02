
'use client';

import React, { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    folder?: string;
    accept?: string;
    label?: string;
}

export default function FileUpload({
    onUploadComplete,
    folder = 'uploads',
    accept = '.pdf,.doc,.docx,.jpg,.png',
    label = 'Upload Document'
}: FileUploadProps) {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setProgress(0);
        setError(null);

        // Create unique filename: timestamp_originalName
        const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `${folder}/${filename}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(p);
            },
            (err) => {
                console.error('Upload failed:', err);
                setError('Upload failed. Please try again.');
                setIsUploading(false);
            },
            async () => {
                try {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setDownloadUrl(url);
                    onUploadComplete(url);
                    setIsUploading(false);
                } catch (err) {
                    console.error('Failed to get download URL:', err);
                    setError('Failed to retrieve file URL.');
                    setIsUploading(false);
                }
            }
        );
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>

            {!downloadUrl ? (
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept={accept}
                        disabled={isUploading}
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary-50 file:text-primary-700
                        hover:file:bg-primary-100
                        disabled:opacity-50"
                    />
                </div>
            ) : (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg border border-green-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <span className="text-sm font-medium">Upload Complete!</span>
                    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="text-xs underline ml-auto text-green-700">View</a>
                    <button type="button" onClick={() => setDownloadUrl(null)} className="text-xs text-slate-500 hover:text-red-500 ml-2">Change</button>
                </div>
            )}

            {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            )}

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            {/* Hidden Input to store URL for server actions if needed, though usually passed via state */}
            <input type="hidden" name={`${label.replace(/\s/g, '')}Url`} value={downloadUrl || ''} />
        </div>
    );
}
