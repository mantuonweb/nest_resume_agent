"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const openai_1 = require("@langchain/openai");
const tools_1 = require("@langchain/core/tools");
const langgraph_1 = require("@langchain/langgraph");
const langgraph_2 = require("@langchain/langgraph");
const messages_1 = require("@langchain/core/messages");
const resume_service_1 = require("../resume/resume.service");
const zod_1 = require("zod");
const AgentStateAnnotation = langgraph_1.Annotation.Root({
    messages: (0, langgraph_1.Annotation)({
        reducer: (left, right) => left.concat(right),
        default: () => [],
    }),
    iteration: (0, langgraph_1.Annotation)({
        reducer: (left, right) => right ?? left ?? 0,
        default: () => 0,
    }),
    maxIterations: (0, langgraph_1.Annotation)({
        reducer: (left, right) => right ?? left ?? 5,
        default: () => 5,
    }),
});
let AgentService = class AgentService {
    resumeService;
    llm;
    tools;
    graph;
    memory;
    systemMessage;
    constructor(resumeService) {
        this.resumeService = resumeService;
        this.llm = new openai_1.ChatOpenAI({
            modelName: 'gpt-4o-mini',
            temperature: 0,
        });
        this.systemMessage = `You are an AI assistant helping with resume management. You have access to tools to manage and search resumes.

When a user asks a question:
1. Think about which tool(s) you need to use
2. Use the appropriate tool(s) to get the information
3. Provide a clear, helpful response based on the tool results

Available tools:
- ingest_resumes_tool: Process new resumes from the folder
- list_resumes_tool: Show all resumes in the database
- search_resumes_tool: Find candidates matching specific skills
- clear_resumes_tool: Delete all resumes from database
- count_resumes_tool: Count resumes waiting to be processed

Be helpful, concise, and accurate.`;
        this.memory = new langgraph_2.MemorySaver();
    }
    onModuleInit() {
        this.initializeTools();
        this.createGraph();
        console.log('✓ Agent initialized with LangGraph');
        console.log(`✓ Tools: ${this.tools.length}`);
    }
    initializeTools() {
        this.tools = [
            new tools_1.DynamicStructuredTool({
                name: 'ingest_resumes_tool',
                description: "Ingest new resumes from the './resumes' folder into the vector database. Use this tool when new resumes need to be processed or the database needs to be updated.",
                schema: zod_1.z.object({}),
                func: async () => {
                    return await this.resumeService.ingestResumes();
                },
            }),
            new tools_1.DynamicStructuredTool({
                name: 'list_resumes_tool',
                description: 'List all the unique resume file names currently stored in the vector database. Use this tool to see what resumes have been ingested.',
                schema: zod_1.z.object({}),
                func: async () => {
                    return await this.resumeService.listResumes();
                },
            }),
            new tools_1.DynamicStructuredTool({
                name: 'search_resumes_tool',
                description: "Search for candidates whose resumes match the given skills. Input should be a comma-separated string of required skills (e.g., 'Python, Machine Learning, Docker'). Use this tool to find candidates for a job opening.",
                schema: zod_1.z.object({
                    skills: zod_1.z.string().describe('Comma-separated list of skills'),
                }),
                func: async ({ skills }) => {
                    return await this.resumeService.searchResumes(skills);
                },
            }),
            new tools_1.DynamicStructuredTool({
                name: 'clear_resumes_tool',
                description: 'Clear all resumes from the vector database. This will delete the entire resume database. Use this tool to start fresh or remove all stored resume data.',
                schema: zod_1.z.object({}),
                func: async () => {
                    return await this.resumeService.clearResumes();
                },
            }),
            new tools_1.DynamicStructuredTool({
                name: 'count_resumes_tool',
                description: "Count how many resume files are waiting in the './resumes' folder to be ingested. Use this to check if there are new resumes to process.",
                schema: zod_1.z.object({}),
                func: async () => {
                    return await this.resumeService.countResumes();
                },
            }),
        ];
    }
    createGraph() {
        const llmWithTools = this.llm.bindTools(this.tools);
        const agentNode = async (state) => {
            const { messages, iteration } = state;
            console.log(`\n🤖 Agent Node - Iteration ${iteration + 1}`);
            let messagesToSend = messages;
            if (iteration === 0) {
                messagesToSend = [
                    new messages_1.SystemMessage(this.systemMessage),
                    ...messages,
                ];
            }
            const response = await llmWithTools.invoke(messagesToSend);
            return {
                messages: [response],
                iteration: iteration + 1,
            };
        };
        const toolNode = async (state) => {
            const { messages } = state;
            const lastMessage = messages[messages.length - 1];
            console.log(`\n🔧 Tool Node - Processing ${lastMessage.tool_calls?.length || 0} tool calls`);
            const toolMessages = [];
            if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
                for (const toolCall of lastMessage.tool_calls) {
                    const tool = this.tools.find((t) => t.name === toolCall.name);
                    if (tool) {
                        try {
                            console.log(`  ⚙️ Executing: ${toolCall.name}`);
                            const result = await tool.invoke(toolCall.args || {});
                            toolMessages.push(new messages_1.ToolMessage({
                                content: typeof result === 'string' ? result : JSON.stringify(result),
                                tool_call_id: toolCall.id || '',
                                name: toolCall.name,
                            }));
                        }
                        catch (error) {
                            console.error(`  ❌ Tool error: ${error.message}`);
                            toolMessages.push(new messages_1.ToolMessage({
                                content: `Error: ${error.message}`,
                                tool_call_id: toolCall.id || '',
                                name: toolCall.name,
                            }));
                        }
                    }
                    else {
                        console.error(`  ❌ Tool not found: ${toolCall.name}`);
                        toolMessages.push(new messages_1.ToolMessage({
                            content: `Error: Tool ${toolCall.name} not found`,
                            tool_call_id: toolCall.id || '',
                            name: toolCall.name,
                        }));
                    }
                }
            }
            return {
                messages: toolMessages,
            };
        };
        const shouldContinue = (state) => {
            const { messages, iteration, maxIterations } = state;
            const lastMessage = messages[messages.length - 1];
            if (iteration >= maxIterations) {
                console.log(`⚠️ Max iterations (${maxIterations}) reached`);
                return langgraph_1.END;
            }
            if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
                console.log(`🔧 Tool calls detected: ${lastMessage.tool_calls.length}`);
                return 'tools';
            }
            console.log('✓ No more tool calls - ending');
            return langgraph_1.END;
        };
        const workflow = new langgraph_1.StateGraph(AgentStateAnnotation)
            .addNode('agent', agentNode)
            .addNode('tools', toolNode)
            .addEdge(langgraph_1.START, 'agent')
            .addConditionalEdges('agent', shouldContinue)
            .addEdge('tools', 'agent');
        this.graph = workflow.compile({ checkpointer: this.memory });
    }
    async run(query, threadId = 'default', maxIterations = 5) {
        try {
            console.log('\n' + '='.repeat(60));
            console.log('🚀 Starting Nested Agent');
            console.log(`Query: ${query}`);
            console.log(`Thread ID: ${threadId}`);
            console.log('='.repeat(60));
            const initialState = {
                messages: [new messages_1.HumanMessage(query)],
                iteration: 0,
                maxIterations,
            };
            const config = {
                configurable: { thread_id: threadId },
            };
            const steps = [];
            let finalState = null;
            for await (const event of await this.graph.stream(initialState, config)) {
                console.log(`\n📊 Event: ${Object.keys(event).join(', ')}`);
                for (const [nodeName, nodeState] of Object.entries(event)) {
                    if (nodeName === 'tools' && nodeState) {
                        const state = nodeState;
                        if (state.messages) {
                            for (const msg of state.messages) {
                                steps.push({
                                    node: 'tools',
                                    tool: msg.name || 'unknown',
                                    output: String(msg.content).substring(0, 200),
                                });
                            }
                        }
                    }
                    else if (nodeName === 'agent' && nodeState) {
                        const state = nodeState;
                        if (state.messages) {
                            const lastMsg = state.messages[state.messages.length - 1];
                            if (lastMsg.tool_calls && lastMsg.tool_calls.length > 0) {
                                for (const tc of lastMsg.tool_calls) {
                                    steps.push({
                                        node: 'agent',
                                        action: 'tool_call',
                                        tool: tc.name,
                                        args: JSON.stringify(tc.args),
                                    });
                                }
                            }
                        }
                    }
                    finalState = nodeState;
                }
            }
            if (finalState && finalState.messages) {
                const messages = finalState.messages;
                for (let i = messages.length - 1; i >= 0; i--) {
                    const msg = messages[i];
                    if (msg instanceof messages_1.AIMessage && msg.content) {
                        return {
                            output: String(msg.content),
                            steps,
                            iterations: finalState.iteration || 0,
                        };
                    }
                }
            }
            return {
                output: 'No response generated',
                steps,
                iterations: 0,
            };
        }
        catch (error) {
            console.error('❌ Agent execution error:', error);
            throw error;
        }
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [resume_service_1.ResumeService])
], AgentService);
//# sourceMappingURL=agent.service.js.map