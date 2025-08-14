import { spawn } from "node:child_process";
import * as readline from "node:readline/promises";

import type { InitializeResponse, Tool } from "@/types";
import { send } from "@/utils";

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
  const result: InitializeResponse = await sendToServer("initialize", lastId, {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo,
  });
  await sendToServer("notifications/initialized", lastId, {}, true);

  // get list of tools
  const params = { _meta: { progressToken: 1 } };
  const getToolsList = () => sendToServer("tools/list", lastId, params);
  const tools: Tool[] = result.capabilities.tools
    ? (await getToolsList()).tools
    : [];
})();
