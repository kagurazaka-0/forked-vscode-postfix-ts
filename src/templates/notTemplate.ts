import * as ts from 'typescript'
import { CompletionItemBuilder } from '../completionItemBuilder'
import { BaseTemplate } from './baseTemplates'
import { NOT_COMMAND } from '../notCommand'
import { invertExpression } from '../utils/invert-expression'

export class NotTemplate extends BaseTemplate {
  buildCompletionItem(node: ts.Node, indentSize?: number) {
    const completionBuilder = CompletionItemBuilder
      .create('not', node, indentSize)

    if (this.isBinaryExpression(node)) {
      const expressions = this.getBinaryExpressions(node)
      if (expressions.length > 1) {
        return completionBuilder
          .insertText('')
          .command({
            title: '',
            command: NOT_COMMAND,
            arguments: expressions
          })
          .description('`!expr` - *[multiple options]*')
          .build()
      }
    }

    const replacement = invertExpression(node, undefined, indentSize)
    return completionBuilder
      .replace(replacement)
      .build()
  }

  canUse (node: ts.Node) {
    return !this.isTypeNode(node) &&
        (this.isExpression(node)
        || this.isUnaryExpression(node)
        || this.isUnaryExpression(node.parent)
        || this.isBinaryExpression(node)
        || this.isCallExpression(node)
        || this.isIdentifier(node))
  }

  private getBinaryExpressions = (node: ts.Node) => {
    const possibleExpressions = [node]

    do {
      this.isBinaryExpression(node.parent) && possibleExpressions.push(node.parent)

      node = node.parent
    } while (node.parent)

    return possibleExpressions
  }
}