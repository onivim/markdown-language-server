import { Range } from "vscode-languageserver";

import unified, { Node } from "unified";
import { ToVFile } from "vfile";
import parse from "remark-parse";
import stringify, { FormatSettings } from "remark-stringify";


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