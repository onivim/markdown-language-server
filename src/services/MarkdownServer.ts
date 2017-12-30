import { LintsSettings } from "./lintRules";
import { FormatSettings } from "remark-stringify";
import { TextDocument, Diagnostic, Range, TextEdit, Position, Hover, MarkedString } from "vscode-languageserver";
import { MarkdownValidation } from "./MarkdownValidation";
import { MarkdownDocument } from "../MarkdownDocument";

export type MarkdownSettings = {
  validate?: boolean,
  lints?: LintsSettings,
  format?: FormatSettings
}

export class MarkdownServer {
  private settings: MarkdownSettings;
  private validation: MarkdownValidation;

  constructor(settings: MarkdownSettings) {
    this.settings = settings;
    this.validation = new MarkdownValidation(settings.lints)
  }
  configure(settings: MarkdownSettings) {
    this.settings = settings;
    this.validation.configure(settings.lints)
  }
  validate(document: TextDocument): Promise<Diagnostic[]> {
    return this.validation.doValidation(new MarkdownDocument(document.getText()))
  }
  format(document: TextDocument, range?: Range): TextEdit[] {
    const mDocument = new MarkdownDocument(document.getText());
    const newText = mDocument.stringify(this.settings.format, range)
    if (!range)
      range = Range.create(Position.create(0, 0), document.positionAt(document.getText().length));

    return [TextEdit.replace(range, mDocument.stringify())]
  }
  hover(document: TextDocument, position: Position): Hover {
    throw "Not implemented"
  }
}
