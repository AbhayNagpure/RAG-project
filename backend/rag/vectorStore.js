import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// The name of  the index you create in your Pinecone dashboard
const indexName = 'rag-tutorial';

//converts a string of text into a mathematical vector using googles embedding model
export async function generateEmbedding(text){
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
    });

    return response.embeddings[0].values;
}

//Takes our first chunks, generates vectors for them and saves them to pinecone
export async function storeChunksInPinecone(chunks){
    const index = pc.index(indexName);
    const vectorsToUpsert = [];
    
    console.log(`Generate embeddings for ${chunks.length} chunks..`);

    //loop through each chunk and turn it into a vector

    for(let i=0; i< chunks.length; i++){
        const chunk = chunks[i];
        const vector = await generateEmbedding( chunk );

        //we prepare the data exactly how pinecone wants it
        vectorsToUpsert.push({
            id: `chunk-${i}`, //A unique ID for this chunk
            values: vector, //The mathematical array
            metadata: {
                text: chunk
            }

        });
    }

    console.log(`saving ${vectorsToUpsert.length} vectors to pinecone...`);

    // In Pinecone SDK v8+, we must pass the array inside an object with the "records" property
    await index.upsert({ records: vectorsToUpsert });
    console.log("Successfuly saved to pinecone");
}