import type { ChildProcessByStdio } from "node:child_process";
import * as readline from "node:readline/promises";

export function send(
  serverProcess: ChildProcessByStdio<any, any, any>,
  rl: readline.Interface,
) {
  return async function (
    method: string,
    lastId: number,
    params: object = {},
    isNotification?: boolean,
  ) {
    const id = isNotification ? undefined : lastId++;
    const value = { jsonrpc: "2.0", method, params, id };
    serverProcess.stdin.write(JSON.stringify(value) + "\n");

    if (isNotification) return;

    const json = await rl.question("");
    return JSON.parse(json).result;
  };
}
