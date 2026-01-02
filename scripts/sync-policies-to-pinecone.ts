
import { PrismaClient } from '@prisma/client';
import { generateEmbedding } from '../src/lib/ai/gemini';
import { Pinecone } from '@pinecone-database/pinecone';

const prisma = new PrismaClient();

async function main() {
    console.log("🔄 Starting Policy Sync to Pinecone...");

    // Check Env
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX) {
        console.error("❌ Missing PINECONE_API_KEY or PINECONE_INDEX");
        process.exit(1);
    }

    // Init Pinecone
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pc.index(process.env.PINECONE_INDEX);

    // Fetch All Policies
    const policies = await prisma.hRPolicy.findMany();
    console.log(`Found ${policies.length} policies in SQLite.`);

    const records = [];

    for (const policy of policies) {
        console.log(`Processing: ${policy.title}`);

        try {
            // Generate Embedding
            // Note: We combine title + content for better semantic search
            const textToEmbed = `${policy.title}:\n${policy.content}`;
            const embedding = await generateEmbedding(textToEmbed);

            if (embedding.length === 0) {
                console.warn(`⚠️ Failed to generate embedding for ${policy.title}`);
                continue;
            }

            records.push({
                id: policy.id,
                values: embedding,
                metadata: {
                    title: policy.title,
                    category: policy.category || 'General',
                    content: policy.content // Store content for retrieval if desired, though usually we fetch from DB.
                    // For RAG, storing chunks in metadata is common to avoid DB roundtrip.
                }
            });

            // Batch if large, but for <100 policies, one batch is fine (Pinecone limit is usually 100-200 vectors/req)
        } catch (e) {
            console.error(`Error processing ${policy.title}:`, e);
        }
    }

    if (records.length > 0) {
        console.log(`📤 Upserting ${records.length} vectors to Pinecone...`);
        await index.upsert(records);
        console.log("✅ Sync Complete!");
    } else {
        console.log("No records to sync.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
