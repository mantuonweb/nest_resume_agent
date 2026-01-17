import { Injectable } from "@nestjs/common";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { AppConfigService } from "../config/app-config.service";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class ResumeService {
  private embeddings: OpenAIEmbeddings;

  constructor(private config: AppConfigService) {
    this.embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
    });
  }

  async ingestResumes(): Promise<string> {
    console.log("📥 Ingesting resumes...");

    try {
      const txtLoader = new DirectoryLoader(this.config.RESUMES_DIR, {
        ".txt": (path) => new TextLoader(path),
      });
      const txtDocs = await txtLoader.load();

      const pdfLoader = new DirectoryLoader(this.config.RESUMES_DIR, {
        ".pdf": (path) => new PDFLoader(path),
      });
      const pdfDocs = await pdfLoader.load();

      const allDocs = [...txtDocs, ...pdfDocs];

      if (allDocs.length === 0) {
        return "No resumes found in ./resumes folder";
      }

      console.log(`📄 Found ${allDocs.length} documents`);

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const chunks = await textSplitter.splitDocuments(allDocs);

      console.log(`✂️ Split into ${chunks.length} chunks`);

      const dbPath = path.join(this.config.DB_DIR, "hnswlib.index");
      const dbExists = fs.existsSync(dbPath);

      let vectorStore: HNSWLib;
      let result: string;

      if (dbExists) {
        console.log("📂 Loading existing database...");
        vectorStore = await HNSWLib.load(this.config.DB_DIR, this.embeddings);
        await vectorStore.addDocuments(chunks);
        result = `Added ${chunks.length} chunks from ${allDocs.length} resumes to existing database`;
      } else {
        console.log("🆕 Creating new database...");
        vectorStore = await HNSWLib.fromDocuments(chunks, this.embeddings);
        result = `Created new database with ${chunks.length} chunks from ${allDocs.length} resumes`;
      }

      console.log("💾 Saving database...");
      await vectorStore.save(this.config.DB_DIR);

      // Verify the save
      const indexPath = path.join(this.config.DB_DIR, "hnswlib.index");
      const docstorePath = path.join(this.config.DB_DIR, "docstore.json");
      const argsPath = path.join(this.config.DB_DIR, "args.json");

      console.log(`✓ Index file exists: ${fs.existsSync(indexPath)}`);
      console.log(`✓ Docstore file exists: ${fs.existsSync(docstorePath)}`);
      console.log(`✓ Args file exists: ${fs.existsSync(argsPath)}`);

      console.log(`✓ ${result}`);
      return result;
    } catch (error) {
      console.error("Error ingesting resumes:", error);
      throw error;
    }
  }

  async listResumes(): Promise<string> {
    console.log("📋 Listing resumes...");

    const indexPath = path.join(this.config.DB_DIR, "hnswlib.index");
    const docstorePath = path.join(this.config.DB_DIR, "docstore.json");

    console.log(`Checking for index at: ${indexPath}`);
    console.log(`Index exists: ${fs.existsSync(indexPath)}`);
    console.log(`Docstore exists: ${fs.existsSync(docstorePath)}`);

    if (!fs.existsSync(indexPath) || !fs.existsSync(docstorePath)) {
      return "No database found. Please ingest resumes first.";
    }

    try {
      console.log("Loading vector store...");
      const vectorStore = await HNSWLib.load(
        this.config.DB_DIR,
        this.embeddings,
      );

      console.log("Performing similarity search...");
      const docs = await vectorStore.similaritySearch("", 100);

      console.log(`Found ${docs.length} documents`);

      const sources = new Set<string>();
      docs.forEach((doc) => {
        if (doc.metadata && doc.metadata.source) {
          const source = path.basename(doc.metadata.source);
          console.log(`Source: ${source}`);
          sources.add(source);
        }
      });

      if (sources.size === 0) {
        return "Database exists but contains no resumes with metadata";
      }

      let result = `Found ${sources.size} resumes in database:\n`;
      Array.from(sources)
        .sort()
        .forEach((source, i) => {
          result += `${i + 1}. ${source}\n`;
        });

      return result;
    } catch (error) {
      console.error("Error listing resumes:", error);
      throw error;
    }
  }

  async searchResumes(skills: string): Promise<string> {
    console.log(`🔍 Searching for candidates with skills: ${skills}`);

    const indexPath = path.join(this.config.DB_DIR, "hnswlib.index");
    const docstorePath = path.join(this.config.DB_DIR, "docstore.json");

    if (!fs.existsSync(indexPath) || !fs.existsSync(docstorePath)) {
      return "No database found. Please ingest resumes first.";
    }

    try {
      const vectorStore = await HNSWLib.load(
        this.config.DB_DIR,
        this.embeddings,
      );
      const docs = await vectorStore.similaritySearch(skills, 5);

      const context = docs
        .map((doc, i) => `Resume ${i + 1}:\n${doc.pageContent}`)
        .join("\n\n");

      const prompt = `You are a recruiter assistant. Based on the following resume excerpts, identify and rank the best candidates for the required skills.

Required Skills: ${skills}

Resume Excerpts:
${context}

Please provide a summary for the top 3 best matching candidates. For each candidate, include:
- **Candidate Name** (if available, otherwise use "Candidate #")
- **Relevant Skills:** (comma-separated list)
- **Why They Are a Good Fit:** (brief explanation)
- **Matching Percentage:** (0-100%)

Format each candidate like this:
1. **Name**
   - **Relevant Skills:** skill1, skill2, skill3
   - **Why They Are a Good Fit:** explanation
   - **Matching Percentage:** XX%

Answer:`;

      const llm = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0 });
      const response = await llm.invoke(prompt);

      console.log("\n" + "=".repeat(60));
      console.log("🎯 SEARCH RESULTS");
      console.log("=".repeat(60));
      console.log(response.content);
      console.log("=".repeat(60));

      return response.content as string;
    } catch (error) {
      console.error("Error searching resumes:", error);
      throw error;
    }
  }

  async clearResumes(): Promise<string> {
    console.log("🗑️ Clearing resume database...");
    if (fs.existsSync(this.config.DB_DIR)) {
      fs.rmSync(this.config.DB_DIR, { recursive: true, force: true });
      fs.mkdirSync(this.config.DB_DIR, { recursive: true });
      return "Database cleared successfully";
    } else {
      return "No database found";
    }
  }

  async countResumes(): Promise<string> {
    if (!fs.existsSync(this.config.RESUMES_DIR)) {
      return "0 resumes found - folder doesn't exist";
    }
    const files = fs
      .readdirSync(this.config.RESUMES_DIR)
      .filter((f) => f.endsWith(".txt") || f.endsWith(".pdf"));
    return `Found ${files.length} resume files: ${files.join(", ")}`;
  }
}
