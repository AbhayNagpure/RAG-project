import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";
import { generateEmbedding } from "./vectorStore.js";
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
const pc = new Pinecone({apiKey: process.env.PINECONE_API_KEY});
const indexName = 'rag-tutorial';

export async function askQuestion(question) {
    console.log(`Generating embedding for question: ${question}`);

    const queryVector = await generateEmbedding(question);

    //2. search pinecone for the top 3 most relevant chunks
    console.log("Searching Pinecone for relevant context...");
    const index = pc.index(indexName);
    const searchResult = await index.query({
        vector: queryVector,
        topK: 3,
        includeMetadata: true
    })

    //extract the text from all 3 and glue them;
    const contextChunks = searchResult.matches.map(match => match.metadata.text);
    const contextString = contextChunks.join('\n\n---\n\n');

    // construct our massive prompt for the LLM
    const prompt = `
    You are a helpful AI assistant. Use the following piece of context to answer the users question. If the context does not contain the answer, say I dont know based on the provided document. 
    CONTEXT: ${contextString}
    QUESTION: ${question}

    `;

    //ask gemini to generate answers
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
    
}