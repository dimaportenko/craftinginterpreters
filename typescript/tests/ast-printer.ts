import {
  AstPrinter,
  BinaryExpr,
  GroupingExpr,
  LiteralExpr,
  UnaryExpr,
} from "@/ast";
import { Token, TokenType } from "@/token";

function main() {
  const expression = new BinaryExpr(
    new UnaryExpr(
      new Token(TokenType.MINUS, "-", null, 1),
      new LiteralExpr(123),
    ),
    new Token(TokenType.STAR, "*", null, 1),
    new GroupingExpr(new LiteralExpr(45.76)),
  );

  console.log(new AstPrinter().print(expression));
}

main();
