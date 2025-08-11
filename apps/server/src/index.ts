import { sendResponse, tools } from "@/utils";

const serverInfo = {
  name: "Coffee Shop Server",
  version: "1.0.0",
};

(async function main() {
  for await (const line of console) {
    try {
      const json = JSON.parse(line);
      if (json.jsonrpc === "2.0") {
        if (json.method === "initialize") {
          const result = {
            protocolVersion: "2025-06-18",
            capabilities: { tools: { changeList: true } },
            serverInfo,
          };
          sendResponse(json.id, result);
        }
      }
      if (json.method === "tools/list") {
        const toolsList = tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        }));
        sendResponse(json.id, { tools: toolsList });
      }
    } catch (error) {
      console.error(error);
    }
  }
})();
