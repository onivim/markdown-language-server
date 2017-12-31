import { Range } from "vscode-languageserver";

import { Processor, Plugin } from "unified";
const unified: Processor = require("unified");
import { Contents } from "vfile";
const parse: Plugin = require("remark-parse");
import { FormatSettings } from "remark-stringify";
import { Parent } from "unist";
const stringify: Plugin = require("remark-stringify");


export class MarkdownDocument {
  private _root?: Parent;
  constructor(public readonly text: Contents) {}

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

  get root(): Parent {
    if (!this._root)
      this._root = unified().use(parse).parse(this.text) as Parent
    return this._root;
  }
}