import { Token, TokenType, type Literal } from "@/token";
import { Lox } from "@/lox";

export class Scanner {
  start: number = 0;
  current: number = 0;
  line: number = 1;

  source: string;
  tokens: Token[] = [];

  constructor(source: string) {
    this.source = source;
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;

      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }

  scanToken() {
    const character = this.advance();

    switch (character) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;

      case "!":
        this.match("=")
          ? this.addToken(TokenType.BANG_EQUAL)
          : this.addToken(TokenType.BANG);
        break;
      case "=":
        this.match("=")
          ? this.addToken(TokenType.EQUAL_EQUAL)
          : this.addToken(TokenType.EQUAL);
        break;
      case "<":
        this.match("=")
          ? this.addToken(TokenType.LESS_EQUAL)
          : this.addToken(TokenType.LESS);
        break;
      case ">":
        this.match("=")
          ? this.addToken(TokenType.GREATER_EQUAL)
          : this.addToken(TokenType.GREATER);
        break;

      case "/":
        if (this.match("/")) {
          while (this.peek() !== "\n" && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;

      case " ":
      case "\r":
      case "\t":
        break;

      case "\n":
        this.line++;
        break;

      default:
        Lox.error(this.line, `Unexpected character: "${character}"`);
    }
  }

  private peek() {
    if (this.isAtEnd()) {
      return "\0";
    }
    return this.source.at(this.current);
  }

  private match(expected: string) {
    if (this.isAtEnd()) {
      return false;
    }

    if (this.source.at(this.current) !== expected) {
      return false;
    }

    this.current++;
    return true;
  }

  private addToken(tokenType: TokenType, literal: Literal = null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(tokenType, text, literal, this.line));
  }

  private advance() {
    return this.source.at(this.current++);
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }
}
