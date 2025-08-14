import { spawn } from "node:child_process";
import * as readline from "node:readline/promises";

(async function main() {
  const serverProcess = spawn("tsx", ["../server/src/index.ts"], {
    stdio: ["pipe", "pipe", "inherit"],
    cwd: "../server",
  });

  const rl = readline.createInterface({
    input: serverProcess.stdout,
    output: undefined,
  });
})();
