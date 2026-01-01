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
        <div className="max-w-3xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Report a Bug</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
                Found something broken? Help us fix it by providing as much detail as possible.
            </p>

            <form action={formAction} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <input type="hidden" name="type" value="BUG_REPORT" />

                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-slate-900 dark:text-slate-200">Issue Summary</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        placeholder="e.g. Leave balance not updating after approval"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="priority" className="text-sm font-medium text-slate-900 dark:text-slate-200">Severity</label>
                        <select
                            name="priority"
                            id="priority"
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="LOW">Low - Minor Glitch</option>
                            <option value="MEDIUM" selected>Medium - Functional Issue</option>
                            <option value="HIGH">High - Major Feature Broken</option>
                            <option value="CRITICAL">Critical - Data Loss / Crash</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="screenshotUrl" className="text-sm font-medium text-slate-900 dark:text-slate-200">Screenshot URL (Optional)</label>
                        <input
                            type="url"
                            name="screenshotUrl"
                            id="screenshotUrl"
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-slate-900 dark:text-slate-200">Problem Description</label>
                    <textarea
                        name="description"
                        id="description"
                        rows={4}
                        required
                        placeholder="Describe what happened..."
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="stepsToReproduce" className="text-sm font-medium text-slate-900 dark:text-slate-200">Steps to Reproduce</label>
                    <textarea
                        name="stepsToReproduce"
                        id="stepsToReproduce"
                        rows={3}
                        placeholder="1. Go to... 2. Click on... 3. Error appears..."
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="expectedBehavior" className="text-sm font-medium text-slate-900 dark:text-slate-200">Expected Behavior</label>
                    <textarea
                        name="expectedBehavior"
                        id="expectedBehavior"
                        rows={2}
                        placeholder="What should have happened instead?"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {state.message && (
                    <div className={`p-4 rounded-md ${state.success ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {state.message}
                    </div>
                )}

                <SubmitButton text="Submit Bug Report" />
            </form>
        </div>
    );
}
