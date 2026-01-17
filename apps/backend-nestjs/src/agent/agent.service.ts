import { Injectable, OnModuleInit } from "@nestjs/common";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
import { MemorySaver } from "@langchain/langgraph";
import {
  BaseMessage,
  HumanMessage,
  AIMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { ResumeService } from "../resume/resume.service";
import { z } from "zod";

// Define state annotation for the new API
const AgentStateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (left, right) => left.concat(right),
    default: () => [],
  }),
  iteration: Annotation<number>({
    reducer: (left, right) => right ?? left ?? 0,
    default: () => 0,
  }),
  maxIterations: Annotation<number>({
    reducer: (left, right) => right ?? left ?? 5,
    default: () => 5,
  }),
});

type AgentState = typeof AgentStateAnnotation.State;

@Injectable()
export class AgentService implements OnModuleInit {
  private llm: ChatOpenAI;
  private tools: DynamicStructuredTool[];
  private graph: any;
  private memory: MemorySaver;
  private systemMessage: string;

  constructor(private resumeService: ResumeService) {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
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

    this.memory = new MemorySaver();
  }

  onModuleInit() {
    this.initializeTools();
    this.createGraph();
    console.log("✓ Agent initialized with LangGraph");
    console.log(`✓ Tools: ${this.tools.length}`);
  }

  private initializeTools() {
    this.tools = [
      new DynamicStructuredTool({
        name: "ingest_resumes_tool",
        description:
          "Ingest new resumes from the './resumes' folder into the vector database. Use this tool when new resumes need to be processed or the database needs to be updated.",
        schema: z.object({}),
        func: async () => {
          return await this.resumeService.ingestResumes();
        },
      }),
      new DynamicStructuredTool({
        name: "list_resumes_tool",
        description:
          "List all the unique resume file names currently stored in the vector database. Use this tool to see what resumes have been ingested.",
        schema: z.object({}),
        func: async () => {
          return await this.resumeService.listResumes();
        },
      }),
      new DynamicStructuredTool({
        name: "search_resumes_tool",
        description:
          "Search for candidates whose resumes match the given skills. Input should be a comma-separated string of required skills (e.g., 'Python, Machine Learning, Docker'). Use this tool to find candidates for a job opening.",
        schema: z.object({
          skills: z.string().describe("Comma-separated list of skills"),
        }),
        func: async ({ skills }) => {
          return await this.resumeService.searchResumes(skills);
        },
      }),
      new DynamicStructuredTool({
        name: "clear_resumes_tool",
        description:
          "Clear all resumes from the vector database. This will delete the entire resume database. Use this tool to start fresh or remove all stored resume data.",
        schema: z.object({}),
        func: async () => {
          return await this.resumeService.clearResumes();
        },
      }),
      new DynamicStructuredTool({
        name: "count_resumes_tool",
        description:
          "Count how many resume files are waiting in the './resumes' folder to be ingested. Use this to check if there are new resumes to process.",
        schema: z.object({}),
        func: async () => {
          return await this.resumeService.countResumes();
        },
      }),
    ];
  }

  private createGraph() {
    const llmWithTools = this.llm.bindTools(this.tools);

    const agentNode = async (state: AgentState) => {
      const { messages, iteration } = state;

      console.log(`\n🤖 Agent Node - Iteration ${iteration + 1}`);

      let messagesToSend = messages;
      if (iteration === 0) {
        messagesToSend = [new SystemMessage(this.systemMessage), ...messages];
      }

      const response = await llmWithTools.invoke(messagesToSend);

      return {
        messages: [response],
        iteration: iteration + 1,
      };
    };

    // Custom tool node that matches our state structure
    const toolNode = async (state: AgentState) => {
      const { messages } = state;
      const lastMessage = messages[messages.length - 1] as AIMessage;

      console.log(
        `\n🔧 Tool Node - Processing ${lastMessage.tool_calls?.length || 0} tool calls`,
      );

      const toolMessages: ToolMessage[] = [];

      if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        for (const toolCall of lastMessage.tool_calls) {
          const tool = this.tools.find((t) => t.name === toolCall.name);

          if (tool) {
            try {
              console.log(`  ⚙️ Executing: ${toolCall.name}`);
              const result = await tool.invoke(toolCall.args || {});

              toolMessages.push(
                new ToolMessage({
                  content:
                    typeof result === "string"
                      ? result
                      : JSON.stringify(result),
                  tool_call_id: toolCall.id || "",
                  name: toolCall.name,
                }),
              );
            } catch (error) {
              console.error(`  ❌ Tool error: ${error.message}`);
              toolMessages.push(
                new ToolMessage({
                  content: `Error: ${error.message}`,
                  tool_call_id: toolCall.id || "",
                  name: toolCall.name,
                }),
              );
            }
          } else {
            console.error(`  ❌ Tool not found: ${toolCall.name}`);
            toolMessages.push(
              new ToolMessage({
                content: `Error: Tool ${toolCall.name} not found`,
                tool_call_id: toolCall.id || "",
                name: toolCall.name,
              }),
            );
          }
        }
      }

      return {
        messages: toolMessages,
      };
    };

    const shouldContinue = (state: AgentState): string => {
      const { messages, iteration, maxIterations } = state;
      const lastMessage = messages[messages.length - 1] as AIMessage;

      if (iteration >= maxIterations) {
        console.log(`⚠️ Max iterations (${maxIterations}) reached`);
        return END;
      }

      if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
        console.log(`🔧 Tool calls detected: ${lastMessage.tool_calls.length}`);
        return "tools";
      }

      console.log("✓ No more tool calls - ending");
      return END;
    };

    const workflow = new StateGraph(AgentStateAnnotation)
      .addNode("agent", agentNode)
      .addNode("tools", toolNode)
      .addEdge(START, "agent")
      .addConditionalEdges("agent", shouldContinue)
      .addEdge("tools", "agent");

    this.graph = workflow.compile({ checkpointer: this.memory });
  }

  async run(
    query: string,
    threadId: string = "default",
    maxIterations: number = 5,
  ): Promise<{ output: string; steps: any[]; iterations: number }> {
    try {
      console.log("\n" + "=".repeat(60));
      console.log("🚀 Starting Nested Agent");
      console.log(`Query: ${query}`);
      console.log(`Thread ID: ${threadId}`);
      console.log("=".repeat(60));

      const initialState = {
        messages: [new HumanMessage(query)],
        iteration: 0,
        maxIterations,
      };

      const config = {
        configurable: { thread_id: threadId },
      };

      const steps: any[] = [];
      let finalState: any = null;

      for await (const event of await this.graph.stream(initialState, config)) {
        console.log(`\n📊 Event: ${Object.keys(event).join(", ")}`);

        for (const [nodeName, nodeState] of Object.entries(event)) {
          if (nodeName === "tools" && nodeState) {
            const state = nodeState as any;
            if (state.messages) {
              for (const msg of state.messages) {
                steps.push({
                  node: "tools",
                  tool: msg.name || "unknown",
                  output: String(msg.content).substring(0, 200),
                });
              }
            }
          } else if (nodeName === "agent" && nodeState) {
            const state = nodeState as any;
            if (state.messages) {
              const lastMsg = state.messages[state.messages.length - 1];
              if (lastMsg.tool_calls && lastMsg.tool_calls.length > 0) {
                for (const tc of lastMsg.tool_calls) {
                  steps.push({
                    node: "agent",
                    action: "tool_call",
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
        const messages = finalState.messages as BaseMessage[];
        for (let i = messages.length - 1; i >= 0; i--) {
          const msg = messages[i];
          if (msg instanceof AIMessage && msg.content) {
            return {
              output: String(msg.content),
              steps,
              iterations: finalState.iteration || 0,
            };
          }
        }
      }

      return {
        output: "No response generated",
        steps,
        iterations: 0,
      };
    } catch (error) {
      console.error("❌ Agent execution error:", error);
      throw error;
    }
  }
}
