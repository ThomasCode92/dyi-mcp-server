import { intro, isCancel, select, text } from "@clack/prompts";
import { spawn } from "node:child_process";
import * as readline from "node:readline/promises";

import type { Content, InitializeResponse, Resource, Tool } from "@/types";
import { dumpContent, send } from "@/utils";

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

  intro(`Connected to ${serverInfo.name} v${serverInfo.version}`);

  while (true) {
    const options: Array<{ value: string; label: string }> = [];
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
  }
})();
