import { intro, isCancel, select, text } from "@clack/prompts";
import { spawn } from "node:child_process";
import * as readline from "node:readline/promises";

import type {
  Content,
  InitializeResponse,
  Message,
  PromptResult,
  Resource,
  Tool,
} from "@/types";
import { callAI, dumpContent, send } from "@/utils";
import chalk from "chalk";

const clientInfo = {
  protocolVersion: "2025-06-18",
  capabilities: {},
  clientInfo: { name: "diy-client", version: "0.1.0" },
};

(async function main() {
  const serverProcess = spawn("tsx", ["../server/src/index.ts"], {
    stdio: ["pipe", "pipe", "inherit"],
    cwd: "../server",
  });

  const rl = readline.createInterface({
    input: serverProcess.stdout,
    output: undefined,
  });

  const sendToServer = send(serverProcess, rl);

  let lastId = 0;
  const result = await sendToServer("initialize", lastId, {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo,
  });
  await sendToServer("notifications/initialized", lastId, {}, true);

  const { capabilities, serverInfo } = result as InitializeResponse;
  const params = { _meta: { progressToken: 1 } }; // params for subsequent requests

  // get list of tools
  const getToolsList = () => sendToServer("tools/list", lastId, params);
  const tools: Tool[] = capabilities.tools ? (await getToolsList()).tools : [];

  // get list of resources
  const getResourcesList = () => sendToServer("resources/list", lastId, params);
  const resources: Resource[] = capabilities.resources
    ? (await getResourcesList()).resources
    : [];

  // function to call AI with tools
  function callAIWithTools(
    messages: { role: string; content: string }[],
  ): Promise<PromptResult[]> {
    return callAI(
      messages,
      tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      })),
    );
  }

  intro(`Connected to ${serverInfo.name} v${serverInfo.version}`);

  while (true) {
    const options: Array<{ value: string; label: string }> = [
      { value: "ai", label: "Chat with AI." },
    ];

    if (resources.length > 0) {
      options.unshift({ value: "resource", label: "Get a resource." });
    }
    if (tools.length > 0) {
      options.unshift({ value: "tool", label: "Run a tool." });
    }

    const action = await select({
      message: "What would you like to do?",
      options,
    });

    if (isCancel(action)) process.exit(0);

    // handle tool selection
    if (action === "tool") {
      const options = tools.map((tool) => ({ value: tool, label: tool.name }));
      const tool = await select({ message: "Select a tool.", options });
      if (isCancel(tool)) process.exit(0);

      // ask for input parameters, if needed
      const args: Record<string, any> = {};
      for (const key of Object.keys(tool.inputSchema.properties ?? {}).filter(
        (key) => tool.inputSchema.properties?.[key]?.type === "string",
      )) {
        const answer = await text({ message: `${key}:`, initialValue: "" });
        if (isCancel(answer)) process.exit(0);
        args[key] = answer;
      }

      // calling the tool
      const params = { name: tool.name, arguments: args };
      const result: { content: Content[] } = await sendToServer(
        "tools/call",
        lastId,
        params,
      );
      dumpContent(result.content);
    }

    // handle resource selection
    if (action === "resource") {
      const options = resources.map((resource) => ({
        value: resource,
        label: resource.name,
      }));
      const resource = await select({ message: "Select a resource.", options });
      if (isCancel(resource)) process.exit(0);

      // reading the resource
      const params = { uri: resource.uri };
      const result: { contents: Content[] } = await sendToServer(
        "resources/read",
        lastId,
        params,
      );
      dumpContent(result.contents);
    }

    // handle ai chat
    if (action === "ai") {
      const prompt = await text({
        message: "What would you like to ask?",
        defaultValue: "What kinds of drinks do you have",
      });
      if (isCancel(prompt)) process.exit(0);

      const messages: Message[] = [{ role: "user", content: prompt }];
      const promptResult = await callAIWithTools(messages);
      messages.push({ role: "assistant", content: promptResult });

      for (const tool of promptResult) {
        if (tool.type === "text") console.log(tool.text);
      }

      // Process all tool calls from the AI response
      const toolCalls = promptResult.filter((r) => r.type === "tool_use");
      while (toolCalls.length > 0) {
        const toolResults = []; // Collect all tool results for this batch

        for (const toolCall of toolCalls) {
          const message = `Requesting tool call ${toolCall.name} - ${JSON.stringify(toolCall.input)}`;
          console.log(chalk.cyan(message));

          // Proxy the tool call to the MCP Server
          const params = { name: toolCall.name, arguments: toolCall.input };
          const { content }: { content: Content[] } = await sendToServer(
            "tools/call",
            lastId,
            params,
          );

          toolResults.push({
            type: "tool_result",
            tool_use_id: toolCall.id,
            content: content[0]!.text,
          });
        }

        // Send all tool results in one message
        messages.push({ role: "user", content: toolResults });
        const followupResult = await callAIWithTools(messages);
        messages.push({ role: "assistant", content: followupResult });

        for (const tool of followupResult) {
          if (tool.type === "text") console.log(tool.text);
        }

        // Check if there are more tool calls to process
        toolCalls.length = 0;
        toolCalls.push(...followupResult.filter((r) => r.type === "tool_use"));
      }
    }
  }
})();
