import * as pdfParseModule from 'pdf-parse';

// Handle different ES module wrapping behaviors
const PDFParse = pdfParseModule.PDFParse || pdfParseModule.default || pdfParseModule;

//extracts text from a pdf buffer.

export async function extractTextFromPdf(pdfBuffer){
    try {
        const parser = new PDFParse({ data: pdfBuffer });
        const result = await parser.getText();
        return result.text;
    } catch (error) {
        console.error("Error parsing pdf:", error);
        throw new Error("Failed to extract text from pdf file");
    }
}


//spilt the massic texts into chunks with overlap to prevent context;

export function chunkText(text, chunkSize=1000, overlap=200){
    const chunks = [];
    for(let i=0; i<text.length; i += (chunkSize - overlap)){
        const chunk = text.slice(i, i + chunkSize);
        chunks.push(chunk);
    }

    return chunks;
}