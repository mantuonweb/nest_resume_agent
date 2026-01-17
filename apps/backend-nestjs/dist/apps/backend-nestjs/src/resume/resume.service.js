"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const openai_1 = require("@langchain/openai");
const hnswlib_1 = require("@langchain/community/vectorstores/hnswlib");
const textsplitters_1 = require("@langchain/textsplitters");
const text_1 = require("langchain/document_loaders/fs/text");
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const directory_1 = require("langchain/document_loaders/fs/directory");
const app_config_service_1 = require("../config/app-config.service");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
let ResumeService = class ResumeService {
    config;
    embeddings;
    constructor(config) {
        this.config = config;
        this.embeddings = new openai_1.OpenAIEmbeddings({
            modelName: 'text-embedding-3-small',
        });
    }
    async ingestResumes() {
        console.log('📥 Ingesting resumes...');
        try {
            const txtLoader = new directory_1.DirectoryLoader(this.config.RESUMES_DIR, {
                '.txt': (path) => new text_1.TextLoader(path),
            });
            const txtDocs = await txtLoader.load();
            const pdfLoader = new directory_1.DirectoryLoader(this.config.RESUMES_DIR, {
                '.pdf': (path) => new pdf_1.PDFLoader(path),
            });
            const pdfDocs = await pdfLoader.load();
            const allDocs = [...txtDocs, ...pdfDocs];
            if (allDocs.length === 0) {
                return 'No resumes found in ./resumes folder';
            }
            console.log(`📄 Found ${allDocs.length} documents`);
            const textSplitter = new textsplitters_1.RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });
            const chunks = await textSplitter.splitDocuments(allDocs);
            console.log(`✂️ Split into ${chunks.length} chunks`);
            const dbPath = path.join(this.config.DB_DIR, 'hnswlib.index');
            const dbExists = fs.existsSync(dbPath);
            let vectorStore;
            let result;
            if (dbExists) {
                console.log('📂 Loading existing database...');
                vectorStore = await hnswlib_1.HNSWLib.load(this.config.DB_DIR, this.embeddings);
                await vectorStore.addDocuments(chunks);
                result = `Added ${chunks.length} chunks from ${allDocs.length} resumes to existing database`;
            }
            else {
                console.log('🆕 Creating new database...');
                vectorStore = await hnswlib_1.HNSWLib.fromDocuments(chunks, this.embeddings);
                result = `Created new database with ${chunks.length} chunks from ${allDocs.length} resumes`;
            }
            console.log('💾 Saving database...');
            await vectorStore.save(this.config.DB_DIR);
            const indexPath = path.join(this.config.DB_DIR, 'hnswlib.index');
            const docstorePath = path.join(this.config.DB_DIR, 'docstore.json');
            const argsPath = path.join(this.config.DB_DIR, 'args.json');
            console.log(`✓ Index file exists: ${fs.existsSync(indexPath)}`);
            console.log(`✓ Docstore file exists: ${fs.existsSync(docstorePath)}`);
            console.log(`✓ Args file exists: ${fs.existsSync(argsPath)}`);
            console.log(`✓ ${result}`);
            return result;
        }
        catch (error) {
            console.error('Error ingesting resumes:', error);
            throw error;
        }
    }
    async listResumes() {
        console.log('📋 Listing resumes...');
        const indexPath = path.join(this.config.DB_DIR, 'hnswlib.index');
        const docstorePath = path.join(this.config.DB_DIR, 'docstore.json');
        console.log(`Checking for index at: ${indexPath}`);
        console.log(`Index exists: ${fs.existsSync(indexPath)}`);
        console.log(`Docstore exists: ${fs.existsSync(docstorePath)}`);
        if (!fs.existsSync(indexPath) || !fs.existsSync(docstorePath)) {
            return 'No database found. Please ingest resumes first.';
        }
        try {
            console.log('Loading vector store...');
            const vectorStore = await hnswlib_1.HNSWLib.load(this.config.DB_DIR, this.embeddings);
            console.log('Performing similarity search...');
            const docs = await vectorStore.similaritySearch('', 100);
            console.log(`Found ${docs.length} documents`);
            const sources = new Set();
            docs.forEach((doc) => {
                if (doc.metadata && doc.metadata.source) {
                    const source = path.basename(doc.metadata.source);
                    console.log(`Source: ${source}`);
                    sources.add(source);
                }
            });
            if (sources.size === 0) {
                return 'Database exists but contains no resumes with metadata';
            }
            let result = `Found ${sources.size} resumes in database:\n`;
            Array.from(sources)
                .sort()
                .forEach((source, i) => {
                result += `${i + 1}. ${source}\n`;
            });
            return result;
        }
        catch (error) {
            console.error('Error listing resumes:', error);
            throw error;
        }
    }
    async searchResumes(skills) {
        console.log(`🔍 Searching for candidates with skills: ${skills}`);
        const indexPath = path.join(this.config.DB_DIR, 'hnswlib.index');
        const docstorePath = path.join(this.config.DB_DIR, 'docstore.json');
        if (!fs.existsSync(indexPath) || !fs.existsSync(docstorePath)) {
            return 'No database found. Please ingest resumes first.';
        }
        try {
            const vectorStore = await hnswlib_1.HNSWLib.load(this.config.DB_DIR, this.embeddings);
            const docs = await vectorStore.similaritySearch(skills, 5);
            const context = docs
                .map((doc, i) => `Resume ${i + 1}:\n${doc.pageContent}`)
                .join('\n\n');
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
            const llm = new openai_1.ChatOpenAI({ modelName: 'gpt-4o-mini', temperature: 0 });
            const response = await llm.invoke(prompt);
            console.log('\n' + '='.repeat(60));
            console.log('🎯 SEARCH RESULTS');
            console.log('='.repeat(60));
            console.log(response.content);
            console.log('='.repeat(60));
            return response.content;
        }
        catch (error) {
            console.error('Error searching resumes:', error);
            throw error;
        }
    }
    async clearResumes() {
        console.log('🗑️ Clearing resume database...');
        if (fs.existsSync(this.config.DB_DIR)) {
            fs.rmSync(this.config.DB_DIR, { recursive: true, force: true });
            fs.mkdirSync(this.config.DB_DIR, { recursive: true });
            return 'Database cleared successfully';
        }
        else {
            return 'No database found';
        }
    }
    async countResumes() {
        if (!fs.existsSync(this.config.RESUMES_DIR)) {
            return "0 resumes found - folder doesn't exist";
        }
        const files = fs
            .readdirSync(this.config.RESUMES_DIR)
            .filter((f) => f.endsWith('.txt') || f.endsWith('.pdf'));
        return `Found ${files.length} resume files: ${files.join(', ')}`;
    }
};
exports.ResumeService = ResumeService;
exports.ResumeService = ResumeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [app_config_service_1.AppConfigService])
], ResumeService);
//# sourceMappingURL=resume.service.js.map