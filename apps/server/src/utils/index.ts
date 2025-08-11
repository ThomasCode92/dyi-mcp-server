export function sendResponse(id: number, result: object) {
  const response = { id, jsonrpc: "2.0", result };
  console.log(JSON.stringify(response));
}
