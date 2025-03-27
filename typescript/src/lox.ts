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

async function runPrompt() {
  const prompt = "Enter lox code line by line: \n";
  process.stdout.write(prompt);

  process.stdout.write(">");
  for await (const line of console) {
    if (line === "exit") {
      exit(0);
    }

    run(line);
    process.stdout.write(">");
  }
}

function lox() {
  const args = Bun.argv.slice(2);
  if (args.length > 1) {
    console.log("Usage: tslox [script]");
    exit(64);
  } else if (args.length === 1) {
    runFile(args[0]);
  } else {
    runPrompt();
  }
}

export { lox };
