import { exit } from "process";

function run(text: string) {
  console.log("-- LOX run");
}

async function runFile(filePath: string) {
  console.log("-- runFile ", filePath);
  const file = Bun.file(filePath);

  const fileText = await file.text();

  console.log("-- File Text:\n", fileText);

  run(fileText);
}

function runPrompt() {
  console.log("-- run prompt");
}

function lox() {
  const args = Bun.argv.slice(2);
  if (args.length > 1) {
    console.log("Usage: tslox [script]");
    exit(64);
  } else if (args.length === 1) {
    runFile(args[0]);
  } else {
    // run prompt
    console.log("run prompt");
  }
}

export { lox };
