const prompt = "Type something: ";
process.stdout.write(prompt);

(async function main() {
  for await (const line of console) {
    console.log(`You typed: ${line}`);
    process.stdout.write(prompt);
  }
})();
