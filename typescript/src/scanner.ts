import { keywords, Token, TokenType, type Literal } from "@/token";
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

      case '"':
        this.str();
        break;

      default: {
        if (this.isDigit(character)) {
          this.num();
        } else if (this.isAlpha(character)) {
          this.identifier();
        } else {
          Lox.error(this.line, `Unexpected character: "${character}"`);
        }
      }
    }
  }

  /** @description scan string */
  private str() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") {
        this.line++;
      }

      this.advance();
    }

    if (this.isAtEnd()) {
      Lox.error(this.current, "Unterminated string.");
    }

    // closing '"'
    this.advance();

    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private identifier() {
    while (this.isAlphaNumberic(this.peek())) {
      this.advance();
    }

    const value = this.source.substring(this.start, this.current);
    const type = keywords[value] ?? TokenType.IDENTIFIER;
    this.addToken(type);
  }

  /** @description scan number */
  private num() {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      // consume "."
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    this.addToken(
      TokenType.NUMBER,
      this.source.substring(this.start, this.current),
    );
  }

  /** @description pick current character */
  private peek() {
    if (this.isAtEnd()) {
      return "\0";
    }
    return this.source.charAt(this.current);
  }

  /** @description pick next character */
  private peekNext() {
    if (this.current + 1 > this.source.length) {
      return "\0";
    }

    return this.source.charAt(this.current + 1);
  }

  private match(expected: string) {
    if (this.isAtEnd()) {
      return false;
    }

    if (this.source.charAt(this.current) !== expected) {
      return false;
    }

    this.current++;
    return true;
  }

  private addToken(tokenType: TokenType, literal: Literal = null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(tokenType, text, literal, this.line));
  }

  /** @description move to next character */
  private advance() {
    return this.source.charAt(this.current++);
  }

  private isAtEnd() {
    return this.current >= this.source.length;
  }

  private isDigit(character: string) {
    return (
      this.charCode(character) >= this.charCode("0") &&
      this.charCode(character) <= this.charCode("9")
    );
  }

  private isAlpha(character: string) {
    const charCode = this.charCode(character);
    return (
      (charCode >= this.charCode("a") && charCode <= this.charCode("z")) ||
      (charCode >= this.charCode("A") && charCode <= this.charCode("Z")) ||
      charCode === this.charCode("_")
    );
  }

  private isAlphaNumberic(character: string) {
    return this.isDigit(character) || this.isAlpha(character);
  }

  private charCode(character: string) {
    return character.charCodeAt(0);
  }
}
