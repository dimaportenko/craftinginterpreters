import type { Token } from "@/token";
import type { LoxObject } from "./types";

export interface Expr {
  accept<R>(visitor: ExprVisitor<R>): R;
}

interface ExprVisitor<R> {
  visitBinary(expr: BinaryExpr): R;
  visitGrouping(expr: GroupingExpr): R;
  visitLitiral(expr: LiteralExpr): R;
  visitUnary(expr: UnaryExpr): R;
}

export class BinaryExpr implements Expr {
  left: Expr;
  token: Token;
  right: Expr;

  constructor(left: Expr, token: Token, right: Expr) {
    this.left = left;
    this.token = token;
    this.right = right;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitBinary(this);
  }
}

export class GroupingExpr implements Expr {
  expression: Expr;

  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitGrouping(this);
  }
}

export class LiteralExpr implements Expr {
  value: LoxObject;

  constructor(value: LoxObject) {
    this.value = value;
  }
  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitLitiral(this);
  }
}

export class UnaryExpr implements Expr {
  operator: Token;
  right: Expr;

  constructor(operator: Token, right: Expr) {
    this.right = right;
    this.operator = operator;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitUnary(this);
  }
}

export class AstPrinter implements ExprVisitor<string> {
  print(expr: Expr): string {
    return expr.accept(this);
  }

  parantethesize(name: string, ...exprs: Expr[]): string {
    let result = `(${name}`;

    for (const expr of exprs) {
      result += " ";
      result += expr.accept(this);
    }

    result += ")";

    return result;
  }

  visitBinary(expr: BinaryExpr): string {
    return this.parantethesize(expr.token.lexeme, expr.left, expr.right);
  }

  visitGrouping(expr: GroupingExpr): string {
    return this.parantethesize("group", expr.expression);
  }

  visitLitiral(expr: LiteralExpr): string {
    if (expr.value === null) {
      return "nil";
    }
    if (typeof expr.value === "string") {
      return expr.value;
    }

    return expr.value.toString();
  }

  visitUnary(expr: UnaryExpr): string {
    return this.parantethesize(expr.operator.lexeme, expr.right);
  }
}
