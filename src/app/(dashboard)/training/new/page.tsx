'use client';

import React, { useState } from 'react';
import { createTrainingCourse } from '@/lib/actions/training-actions';
import FileUpload from '@/components/shared/FileUpload';

export default function NewTrainingCoursePage() {
    const [fileUrl, setFileUrl] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Add New Training Course</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <form action={createTrainingCourse} onSubmit={() => setIsSubmitting(true)} className="space-y-6">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            placeholder="e.g. Advanced Excel for Finance"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                        />
                    </div>

                    {/* Category & Delivery Method */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                name="category"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="Internal">Internal Training</option>
                                <option value="Compliance">Compliance & Safety</option>
                                <option value="Technical">Technical Skills</option>
                                <option value="Soft Skills">Soft Skills & Leadership</option>
                                <option value="Onboarding">Onboarding</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Method</label>
                            <select
                                name="deliveryMethod"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="E-Learning">E-Learning (Self-Paced)</option>
                                <option value="Instructor-Led">Instructor-Led (Virtual/In-Person)</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Workshop">Workshop</option>
                            </select>
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Approx.)</label>
                        <input
                            name="duration"
                            type="text"
                            placeholder="e.g. 2 hours, 3 days"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            placeholder="Describe the course objectives and content..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        ></textarea>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Course Material (PDF/DOCX/Video Link)</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 bg-slate-50">
                            <FileUpload
                                onUploadComplete={(url) => setFileUrl(url)}
                                folder="training-materials"
                                label="Upload Course Material"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4"
                            />
                            {fileUrl && (
                                <div className="mt-2 text-sm text-green-600 font-medium">
                                    ✅ File uploaded successfully
                                </div>
                            )}
                            <input type="hidden" name="contentUrl" value={fileUrl} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-all shadow-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Creating Course...' : 'Create Course'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
