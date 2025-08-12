import { drinks } from "@/data";

export const tools = [
  {
    name: "getDrinkNames",
    description: "Get the names of the drinks in the shop",
    inputSchema: { type: "object", properties: {} },
    execute: async (args: any) => {
      const names = drinks.map((drink) => drink.name);
      return { content: [{ type: "text", text: JSON.stringify({ names }) }] };
    },
  },
  {
    name: "getDrinkInfo",
    description: "Get more info about the drink",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    },
    execute: async (args: any) => {
      const drink = drinks.find((drink) => drink.name === args.name) || {
        error: "Drink not found",
      };
      return { content: [{ type: "text", text: JSON.stringify(drink) }] };
    },
  },
];

export const resources = [
  {
    uri: "menu://app",
    name: "menu",
    get: async () => {
      return {
        contents: [{ uri: "menu://app", text: JSON.stringify(drinks) }],
      };
    },
  },
];

export function sendResponse(id: number, result: object) {
  const response = { id, jsonrpc: "2.0", result };
  console.log(JSON.stringify(response));
}
