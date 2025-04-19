import type { Token } from "@/token";
import type { LoxObject } from "./types";

export interface Expr {}

export class Binary implements Expr {
  left: Expr;
  token: Token;
  right: Expr;

  constructor(left: Expr, token: Token, right: Expr) {
    this.left = left;
    this.token = token;
    this.right = right;
  }
}

export class Grouping implements Expr {
  expression: Expr;

  constructor(expression: Expr) {
    this.expression = expression;
  }
}

export class Literal implements Expr {
  value: LoxObject;

  constructor(value: LoxObject) {
    this.value = value;
  }
}

export class Unary implements Expr {
  right: Expr;

  constructor(right: Expr) {
    this.right = right;
  }
}
