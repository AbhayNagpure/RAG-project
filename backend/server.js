import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { extractTextFromPdf, chunkText } from './rag/documentProcessor.js';
import { storeChunksInPinecone } from './rag/vectorStore.js';
import { askQuestion } from './rag/chat.js';

const upload = multer({storage: multer.memoryStorage() });
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/upload', upload.single('pdf'), async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({error: "No pdf File uploaded"});
        }

        const pdfBuffer = req.file.buffer;
        const rawText =  await extractTextFromPdf(pdfBuffer);

        const textChunks = await chunkText(rawText);

        console.log(`Successfuly extracted ${rawText.length} characters`);

        await storeChunksInPinecone(textChunks);
        
        res.json({
            message: "PDF successfuly parsed and chunked",
            totalChunks: textChunks.length
        })
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Failed to process the PDF."});
    }
})

app.post('/api/chat', async(req, res) => {
    try {
        
        const { question } = req.body;

        if(!question){
            return res.status(400).json({error: "Please provide a question"});
        }

        const answer = await askQuestion(question);

        res.json({ answer: answer});

    } catch (error) {
        console.error("Chat error: ", error);
        res.status(500).json({ error: "Failed to answer the question" });
    }
})

// A simple test route
app.get('/api/health', (req, res) => {
    res.json({ message: "RAG Backend is running!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});