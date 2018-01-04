import { Range } from "vscode-languageserver";

import { Processor, Plugin } from "unified";
const unified: Processor = require("unified");
import { Contents } from "vfile";
const parse: Plugin = require("remark-parse");
import { FormatSettings } from "remark-stringify";
import { Parent, Node, Point } from "unist";
const stringify: Plugin = require("remark-stringify");

export class MarkdownDocument {
  private _root?: Parent;
  constructor(public readonly text: Contents) {}

  stringify(settings?: FormatSettings, range?: Range): string {
    let root: Node = this.root

    if (range) {
      // TODO: Multi-node findRange
      root = MarkdownDocument.findNode(this.root, {
        line: range.start.line + 1,
        column: range.start.character + 1
      }, {
        line: range.end.line + 1,
        column: range.end.character + 1
      })
    }
    let result = unified().use(stringify, settings).stringify(root)
    if (range && root.position) {
      result = result.substring(
        root.position.start.column - range.start.character - 1,
        result.length - (root.position.end.column - range.end.character - 1)
      )
    }
    return result;
  }

  get root(): Parent {
    if (!this._root)
      this._root = unified().use(parse).parse(this.text) as Parent
    return this._root;
  }

  private static findNode(node: Parent , start: Point, end: Point): Node {
    if (node.children) {
      for (const child of node.children) {
        if (child.position &&
            MarkdownDocument.compare(child.position.start, start) && 
            MarkdownDocument.compare(end, child.position.end)
          ) {
          return MarkdownDocument.findNode(child as Parent, start, end);
        }
      }
    }    
    return node;
  }

  private static compare(beforePos: Point, afterPos: Point): boolean {
    if (afterPos.line > beforePos.line) {
      return true;
    } else if (afterPos.line === beforePos.line) {
      return afterPos.column >= beforePos.column;
    }
    return false;
  }
}

