'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { generateContent, generateEmbedding } from '@/lib/ai/gemini';
import { findMostSimilarDocuments } from '@/lib/ai/vector-store';

// --- Conversation Management ---

export async function createConversation(participantIds: string[], type: 'DIRECT' | 'GROUP' | 'AI_ASSISTANT' = 'DIRECT', name?: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    // Ensure creator is in participants
    const allParticipants = Array.from(new Set([...participantIds, session.user.id]));

    const conversation = await prisma.conversation.create({
        data: {
            type,
            name,
            participants: {
                create: allParticipants.map(userId => ({ userId }))
            }
        },
        include: { participants: true }
    });

    return conversation;
}

export async function getConversations() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.conversation.findMany({
        where: {
            participants: {
                some: { userId: session.user.id }
            }
        },
        include: {
            participants: {
                include: {
                    user: { select: { id: true, username: true, employee: { select: { firstName: true, lastName: true } } } }
                }
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { updatedAt: 'desc' }
    });
}

export async function getConversationMessages(conversationId: string) {
    const session = await auth();
    if (!session?.user?.id) return [];

    // Verify membership
    const membership = await prisma.conversationParticipant.findUnique({
        where: {
            conversationId_userId: {
                conversationId,
                userId: session.user.id
            }
        }
    });

    if (!membership) throw new Error('Not a member');

    return await prisma.chatMessage.findMany({
        where: { conversationId },
        include: {
            sender: { select: { id: true, username: true, employee: { select: { firstName: true, lastName: true } } } }
        },
        orderBy: { createdAt: 'asc' }
    });
}

// --- Message Sending & AI Integration ---

export async function sendChatMessage(conversationId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error('Unauthorized');

    // 1. Save User Message
    const message = await prisma.chatMessage.create({
        data: {
            conversationId,
            senderId: session.user.id,
            content
        }
    });

    // 2. Update Conversation Timestamp
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
    });

    // 3. AI Trigger Logic
    const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });

    if (conversation?.type === 'AI_ASSISTANT') {
        // Trigger background AI response
        await generateAIResponse(conversationId, content);
    }

    revalidatePath(`/chat`);
    return message;
}

// --- AI Real Implementation ---

async function generateAIResponse(conversationId: string, userPrompt: string) {
    // 1. Fetch all policies (In-memory Vector Store for Demo)
    // In production, use PGVector or Pinecone
    const allPolicies = await prisma.hRPolicy.findMany();

    let contextText = "";

    if (allPolicies.length > 0) {
        try {
            const queryEmbedding = await generateEmbedding(userPrompt);

            // Convert DB strings to arrays
            const docs = allPolicies.map(p => ({
                id: p.id,
                content: `${p.title}: ${p.content}`,
                embedding: JSON.parse(p.embedding || "[]")
            })).filter(d => d.embedding.length > 0);

            const relevantDocs = findMostSimilarDocuments(queryEmbedding, docs, 2);
            contextText = relevantDocs.map(d => d.doc.content).join("\n\n");

        } catch (e) {
            console.error("RAG Error:", e);
        }
    }

    const systemPrompt = `You are a helpful HR Assistant for Novcon Ghana.
    Use the following HR Policies to answer the user's question if relevant.
    If the answer is not in the policies, say "I don't have information on that in the company policies."
    
    CONTEXT:
    ${contextText}
    
    USER QUESTION:
    ${userPrompt}
    `;

    let aiContent = "I encountered an error connecting to my brain.";

    try {
        aiContent = await generateContent(systemPrompt);
    } catch (e) {
        console.error("Gemini Gen Error:", e);
    }

    // Save AI Message - Find or Create Bot User
    let botUser = await prisma.user.findUnique({ where: { username: 'AI_BOT' } });
    if (!botUser) {
        botUser = await prisma.user.create({
            data: { username: 'AI_BOT', password: 'HASHED_MOCK_PASSWORD', role: 'BOT' }
        });
    }

    await prisma.chatMessage.create({
        data: {
            conversationId,
            senderId: botUser.id,
            content: aiContent,
            isAiGenerated: true
        }
    });
}
