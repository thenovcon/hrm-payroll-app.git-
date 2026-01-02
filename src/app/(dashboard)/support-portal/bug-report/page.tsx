"use client";

import { createTicket } from "@/lib/actions/support";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";

const initialState = {
    message: "",
};

function SubmitButton({ text }: { text: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? 'Submitting...' : text}
        </button>
    );
}

export default function BugReportPage() {
    const [state, formAction] = useFormState(createTicket, initialState);

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
                <span className="inline-flex items-center justify-center p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mb-4">
                    <span className="text-2xl">🐛</span>
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                    Report a Bug
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Found something broken? Help us fix it by providing as much detail as possible.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="p-8 sm:p-10">
                    <form action={formAction} className="space-y-6">
                        <input type="hidden" name="type" value="BUG_REPORT" />

                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Issue Summary</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                placeholder="e.g. Leave balance not updating after approval"
                                className="block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="priority" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Severity Impact</label>
                                <div className="relative">
                                    <select
                                        name="priority"
                                        id="priority"
                                        className="block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none"
                                    >
                                        <option value="LOW">Low - Minor Glitch</option>
                                        <option value="MEDIUM">Medium - Functional Issue</option>
                                        <option value="HIGH">High - Major Feature Broken</option>
                                        <option value="CRITICAL">Critical - Data Loss / Crash</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="screenshotUrl" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Screenshot URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                                <input
                                    type="url"
                                    name="screenshotUrl"
                                    id="screenshotUrl"
                                    placeholder="https://..."
                                    className="block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Problem Description</label>
                            <textarea
                                name="description"
                                id="description"
                                rows={4}
                                required
                                placeholder="Describe what happened in detail..."
                                className="block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-y"
                            />
                        </div>

                        <div>
                            <label htmlFor="stepsToReproduce" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Steps to Reproduce</label>
                            <textarea
                                name="stepsToReproduce"
                                id="stepsToReproduce"
                                rows={3}
                                placeholder="1. Go to...&#10;2. Click on...&#10;3. Error appears..."
                                className="block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-y font-mono text-sm leading-relaxed"
                            />
                        </div>

                        <div>
                            <label htmlFor="expectedBehavior" className="block text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Expected Behavior</label>
                            <textarea
                                name="expectedBehavior"
                                id="expectedBehavior"
                                rows={2}
                                placeholder="What should have happened instead?"
                                className="block w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-y"
                            />
                        </div>

                        {state.message && (
                            <div className={`p-4 rounded-lg flex items-start gap-3 ${state.success ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                                <div className="text-lg">{state.success ? '✅' : '⚠️'}</div>
                                <div className="text-sm font-medium pt-0.5">{state.message}</div>
                            </div>
                        )}

                        <div className="pt-4">
                            <SubmitButton text="Submit Bug Report" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
