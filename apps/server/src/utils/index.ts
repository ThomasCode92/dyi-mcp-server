export const tools = [
  {
    name: "getDrinkNames",
    description: "Get the names of the drinks in the shop",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "getDrinkInfo",
    description: "Get more info about the drink",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    },
  },
];

export function sendResponse(id: number, result: object) {
  const response = { id, jsonrpc: "2.0", result };
  console.log(JSON.stringify(response));
}
