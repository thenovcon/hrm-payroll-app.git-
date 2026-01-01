"use client";

import { createTicket } from "@/lib/actions/support";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";

const initialState = {
    message: "",
};

export default function SupportPage() {
    const [state, formAction] = useFormState(createTicket, initialState);

    return (
        <div className="max-w-2xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Contact Support</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
                Have a question or need assistance? Fill out the form below and our team will get back to you.
            </p>

            <form action={formAction} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <input type="hidden" name="type" value="SUPPORT_REQUEST" />

                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-slate-900 dark:text-slate-200">Subject</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        placeholder="Briefly describe your issue..."
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium text-slate-900 dark:text-slate-200">Priority</label>
                    <select
                        name="priority"
                        id="priority"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="LOW">Low - General Inquiry</option>
                        <option value="MEDIUM" selected>Medium - Need Assistance</option>
                        <option value="HIGH">High - Urgent Issue</option>
                        <option value="CRITICAL">Critical - System Down</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-slate-900 dark:text-slate-200">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        rows={5}
                        required
                        placeholder="Provide detailed information about your request..."
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {state.message && (
                    <div className={`p-4 rounded-md ${state.success ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {state.message}
                    </div>
                )}

                <Button type="submit" className="w-full">
                    Submit Ticket
                </Button>
            </form>
        </div>
    );
}
