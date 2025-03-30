import type { TokenType } from "./token-types";

export type Literal = number | string | boolean | null;

export class Token {
  type: TokenType;
  lexeme: string;
  literal: Literal;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: Literal, line: number) {
    this.literal = literal;
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
  }

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}
