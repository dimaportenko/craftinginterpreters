import type { Token } from "@/token";

export class Scanner {
  source: string;

  constructor(source: string) {
    this.source = source;
  }

  scanTokens(): Token[] {
    return [];
  }
}
