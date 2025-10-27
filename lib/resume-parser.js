// lib/resume-parser.js
import mammoth from 'mammoth';
import { extractText } from 'unpdf';

export class ResumeParser {
  static async parseFile(file) {
    const fileType = file.type;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      if (fileType === 'application/pdf') {
        console.log("Parsing PDF file with unpdf...");
        return await this.parsePDF(arrayBuffer);
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileType === 'application/msword'
      ) {
        console.log("Parsing DOCX file...");
        return await this.parseDOCX(buffer);
      } else {
        throw new Error('Unsupported file type. Please upload PDF or DOCX.');
      }
    } catch (error) {
      console.error('Resume parsing error:', error);
      throw new Error(`Failed to parse resume: ${error.message}`);
    }
  }

  static async parsePDF(arrayBuffer) {
    try {
      // Use unpdf to extract text
      const { text } = await extractText(arrayBuffer, {
        mergePages: true,
      });
      
      if (!text || text.trim().length < 50) {
        throw new Error('Could not extract sufficient text from PDF. The PDF might be image-based or encrypted.');
      }
      
      console.log("PDF parsed successfully, text length:", text.length);
      return text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error(`Could not read PDF: ${error.message}`);
    }
  }

  static async parseDOCX(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      
      if (!result.value || result.value.length < 50) {
        throw new Error('Could not extract sufficient text from document.');
      }
      
      console.log("DOCX parsed successfully, text length:", result.value.length);
      return result.value;
    } catch (error) {
      console.error('DOCX parsing error:', error);
      throw new Error('Could not read DOCX file. Please ensure it\'s a valid Word document.');
    }
  }

  static cleanText(text) {
    if (!text) return '';
    
    return text
      .replace(/\s+/g, ' ')           // Multiple spaces to single space
      .replace(/\n+/g, '\n')          // Multiple newlines to single
      .replace(/\t+/g, ' ')           // Tabs to spaces
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
      .trim();
  }
}