import type { LoxObject } from "@/types";
import type { TokenType } from "./token-types";

export class Token {
  type: TokenType;
  lexeme: string;
  literal: LoxObject;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: LoxObject, line: number) {
    this.literal = literal;
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
  }

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}
