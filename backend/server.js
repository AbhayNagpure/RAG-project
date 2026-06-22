import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import { GoogleGenAI } from '@google/genai';
import { text } from 'stream/consumers';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
const app = express();
app.use(cors());
app.use(express.json());
let vectorStore = [];

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('pdf'), async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({error: "NO pdf file uploaded"});
        }

        //1. get the file buffer from multer.
        const pdfBuffer = req.file.buffer;

        //extract texts from pdf;
        const pdfData = await pdfParse(pdfBuffer);
        const rawText = pdfData.text;
        
        const textChunks = chunkText(rawText);
        console.log(`Split PDF into ${textChunks.length} chunks.`)
        console.log("Extracted text length:", rawText.length);
        console.log("First 200 character:", rawText.substring(0, 200));

        // Clear the array in case you upload a new pdf.
        vectorStore = [];
        console.log("Generating embeddings... this might take few seconds");

        for(let i=0; i<textChunks.length; i++){
            const chunk = textChunks[i];

            const response = await ai.models.embedContent({
                model: 'gemini-embedding-001',
                contents: chunk, 
            });

            //storeit in our database.
            vectorStore.push({
                id: i,
                text: chunk,
                embedding: response.embeddings[0].values,
            })
            
        }

        console.log(`Success! sotes ${vectorStore.length} vectors in memory`);
        

        res.json({ 
            message: 'PDF successfully parsed!', 
            textLength: rawText.length 
        });

    } catch (error) {
        console.error("Error parsing PDF:", error);
        res.status(500).json({ error: 'Failed to process the PDF.' });
    }
})

app.post('/api/chat', async(req, res) => {
    try {
        const {message} = req.body;
        if(vectorStore.length === 0){
            return res.status(400).json({error: "Please upload a pdf first"});
        }
        //covert users question into embedding 
        const questionEmbeddingResponse = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: message,
        })
        const questionVector = questionEmbeddingResponse.embeddings[0].values;

        //2. Score every chunk in our database.
        const similarities = vectorStore.map(chunk => {
            const score = cosineSimilarity(questionVector, chunk.embedding);
            return {text: chunk.text, score}
        })

        //3. sort by highest score and grab top 2 most relevant chunks;
        similarities.sort((a, b) => b.score - a.score);
        const topChunks = similarities.slice(0, 2);

        //combine the text of the top chunks to use as context
        const contextText = topChunks.map(c => c.text).join('\n\n');
        console.log(`Top match score: ${topChunks[0].score}`);

        //4. build the strictly bounder prompt.
        const prompt = `You are an AI assistant. Answer the users question strictly using the provided context from a pdf.
            If the answer is not contained in the context, say "I cannot answer this based on the provided document."
            CONTEXT FROM PDF:
        ${contextText}
        
        USER QUESTION: 
        ${message}
        `;
        //5. generate the response as a stream.
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
        })

        //6. send it backc to the frontend chunk by chunk
        res.setHeader('Content-type', 'text/plain; charset-utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await(const chunk of responseStream){
            res.write(chunk.text);
        }
        res.end();
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Failed to generate answer" });
    }
})

function cosineSimilarity(vecA, vecB){
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for(let i=0; i<vecA.length; i++){
        dotProduct += vecA[i]*vecB[i];
        normA += vecA[i]*vecA[i];
        normB += vecB[i]*vecB[i];
    }
    return dotProduct/(Math.sqrt(normA) * Math.sqrt(normB));
}

function chunkText(text, chunkSize = 1000, overlap = 200){
    const chunks = [];

    for(let i=0; i < text.length; i += (chunkSize - overlap)){
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});