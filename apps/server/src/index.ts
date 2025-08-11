import { sendResponse } from "@/utils";

(async function main() {
  for await (const line of console) {
    try {
      const json = JSON.parse(line);
      if (json.jsonrpc === "2.0") {
        if (json.method === "initialize") {
          sendResponse(json.id, {});
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
})();
