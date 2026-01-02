import { Pinecone } from '@pinecone-database/pinecone';

// Simple Cosine Similarity Vector Store for RAG
// Since we have < 10k documents, an in-memory/brute-force scan is perfectly fine and fast.
// UPGRADE: Now supports Pinecone if PINECONE_API_KEY is present.

type Document = {
    id: string;
    content: string;
    description?: string;
    embedding: number[];
};

const pineconeApiKey = process.env.PINECONE_API_KEY;
const pineconeIndexName = process.env.PINECONE_INDEX || 'hrm-policies';

let pineconeClient: Pinecone | null = null;

if (pineconeApiKey) {
    try {
        pineconeClient = new Pinecone({ apiKey: pineconeApiKey });
    } catch (e) {
        console.error("Failed to init Pinecone client", e);
    }
}

export function cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function upsertDocument(id: string, text: string, embedding: number[], metadata: any = {}) {
    if (pineconeClient) {
        try {
            const index = pineconeClient.index(pineconeIndexName);
            await index.upsert([{
                id,
                values: embedding,
                metadata: { text, ...metadata }
            }]);
            return true;
        } catch (e) {
            console.error("Pinecone Upsert Error:", e);
            return false;
        }
    }
    return false;
}

export async function findMostSimilarDocuments(queryEmbedding: number[], documents: Document[], topK: number = 3) {
    // 1. Try Pinecone First
    if (pineconeClient) {
        try {
            const index = pineconeClient.index(pineconeIndexName);
            const queryResponse = await index.query({
                vector: queryEmbedding,
                topK,
                includeMetadata: true
            });

            if (queryResponse.matches && queryResponse.matches.length > 0) {
                return queryResponse.matches.map(match => ({
                    doc: {
                        id: match.id,
                        content: (match.metadata as any)?.text || "",
                        embedding: [] // We don't need vectors back
                    },
                    score: match.score || 0
                }));
            }
        } catch (e) {
            console.error("Pinecone Query Error (falling back to memory):", e);
        }
    }

    // 2. Fallback to In-Memory
    const scoredDocs = documents.map(doc => ({
        doc,
        score: cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    // Sort descending
    scoredDocs.sort((a, b) => b.score - a.score);

    return scoredDocs.slice(0, topK);
}
