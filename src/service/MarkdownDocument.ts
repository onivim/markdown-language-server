import { Range } from "vscode-languageserver";

import { Processor, Node, Plugin } from "unified";
const unified: Processor = require("unified");
import { ToVFile } from "vfile";
const parse: Plugin = require("remark-parse");
import { FormatSettings } from "remark-stringify";
const stringify: Plugin = require("remark-stringify");


export class MarkdownDocument {
  private _root?: Node;
  constructor(public readonly text: ToVFile) {}

  stringify(settings?: FormatSettings, range?: Range): string {
    let root = this.root

    if (range) {
      // TODO
      /*for (const children of root.children) {
        if (range.start.line < children.position.start.line) {
          root = children;
        }
      }*/
    }

    return unified().use(stringify, settings).stringify(root)
  }

  get root(): Node {
    if (!this._root)
      this._root = unified().use(parse).parse(this.text)
    return this._root;
  }
}