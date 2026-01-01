"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TicketSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    type: z.enum(["BUG_REPORT", "SUPPORT_REQUEST"]),
    stepsToReproduce: z.string().optional(),
    expectedBehavior: z.string().optional(),
    screenshotUrl: z.string().optional(),
});

export type TicketState = {
    errors?: {
        title?: string[];
        description?: string[];
        priority?: string[];
        type?: string[];
    };
    message?: string;
    success?: boolean;
};

export async function createTicket(prevState: TicketState, formData: FormData): Promise<TicketState> {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: "Unauthorized: Please login first." };
    }

    const validatedFields = TicketSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        type: formData.get("type"),
        stepsToReproduce: formData.get("stepsToReproduce"),
        expectedBehavior: formData.get("expectedBehavior"),
        screenshotUrl: formData.get("screenshotUrl"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to create ticket.",
        };
    }

    const { title, description, priority, type, stepsToReproduce, expectedBehavior, screenshotUrl } = validatedFields.data;

    try {
        await prisma.ticket.create({
            data: {
                title,
                description,
                priority,
                type,
                stepsToReproduce: type === "BUG_REPORT" ? stepsToReproduce : undefined,
                expectedBehavior: type === "BUG_REPORT" ? expectedBehavior : undefined,
                screenshotUrl,
                createdById: session.user.id,
                status: "OPEN",
            },
        });

        revalidatePath("/help/tickets");
        return { success: true, message: "Ticket created successfully!" };
    } catch (error) {
        console.error("Failed to create ticket:", error);
        return { message: "Database Error: Failed to create ticket." };
    }
}

export async function getUserTickets() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.ticket.findMany({
        where: { createdById: session.user.id },
        orderBy: { createdAt: "desc" },
    });
}
