import { exit } from "process";
import { Scanner } from "./scanner";

export class Lox {
  static hadError = false;

  run(text: string) {
    console.log("-- LOX run: \n", text);

    const scanner = new Scanner(text);
    const tokens = scanner.scanTokens();

    console.log("-- LOX tokens: ", tokens);
    tokens.forEach((token) => {
      console.log(token);
    });
  }

  async runFile(filePath: string) {
    console.log("-- runFile ", filePath);
    const file = Bun.file(filePath);

    const fileText = await file.text();

    console.log("-- File Text:\n", fileText);

    this.run(fileText);

    if (Lox.hadError) {
      exit(65);
    }
  }

  async runPrompt() {
    const prompt = "Enter lox code line by line: \n";
    process.stdout.write(prompt);

    process.stdout.write(">");
    for await (const line of console) {
      if (line === "exit") {
        exit(0);
      }

      this.run(line);
      Lox.hadError = false;

      process.stdout.write(">");
    }
  }

  main() {
    const args = Bun.argv.slice(2);
    if (args.length > 1) {
      console.log("Usage: tslox [script]");
      exit(64);
    } else if (args.length === 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

  static error(line: number, message: string) {
    Lox.report(line, "", message);
  }

  private static report(line: number, where: string, message: string) {
    process.stderr.write(`[${line}] Error ${where}: ${message}`);
  }
}
