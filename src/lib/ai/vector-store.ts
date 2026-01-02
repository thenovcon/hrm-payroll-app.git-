
// Simple Cosine Similarity Vector Store for RAG
// Since we have < 10k documents, an in-memory/brute-force scan is perfectly fine and fast.

type Document = {
    id: string;
    content: string;
    description?: string;
    embedding: number[];
};

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

export function findMostSimilarDocuments(queryEmbedding: number[], documents: Document[], topK: number = 3) {
    const scoredDocs = documents.map(doc => ({
        doc,
        score: cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    // Sort descending
    scoredDocs.sort((a, b) => b.score - a.score);

    return scoredDocs.slice(0, topK);
}
