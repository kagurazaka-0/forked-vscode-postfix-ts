import * as ts from 'typescript'
import { CompletionItemBuilder } from '../completionItemBuilder'
import { BaseExpressionTemplate } from './baseTemplates'

export class VarTemplate extends BaseExpressionTemplate {
  constructor(private keyword: 'var' | 'let' | 'const') {
    super(keyword)
  }

  buildCompletionItem(node: ts.Node, indentSize?: number) {
    return CompletionItemBuilder
      .create(this.keyword, node, indentSize)
      .replace(this.keyword + ' ${1:name} = {{expr}}$0', true)
      .build()
  }

  canUse(node: ts.Node) {
    return (super.canUse(node) || this.isNewExpression(node) || this.isObjectLiteral(node) || this.isStringLiteral(node))
      && !this.inReturnStatement(node)
      && !this.inFunctionArgument(node)
      && !this.inVariableDeclaration(node)
      && !this.inAssignmentStatement(node)
  }
}