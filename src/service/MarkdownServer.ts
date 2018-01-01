import { LintsSettings } from "./lintRules";
import { FormatSettings } from "remark-stringify";
import { TextDocument, Diagnostic, Range, TextEdit, Position, Hover, MarkedString } from "vscode-languageserver";
import { MarkdownValidation } from "./MarkdownValidation";
import { MarkdownDocument } from "./MarkdownDocument";
import MarkdownDocumentCache from "./MarkdownDocumentCache";

export type MarkdownSettings = {
  validate?: boolean,
  lints?: LintsSettings,
  format?: FormatSettings
}

export class MarkdownServer {
  private settings: MarkdownSettings;
  private markdownDocuments: MarkdownDocumentCache;
  private validation: MarkdownValidation;

  constructor(settings: MarkdownSettings) {
    this.settings = settings;
    this.markdownDocuments = new MarkdownDocumentCache(10, 60)
    this.validation = new MarkdownValidation(settings.lints)
  }
  configure(settings: MarkdownSettings) {
    this.settings = settings;
    this.validation.configure(settings.lints)
  }
  validate(document: TextDocument): Promise<Diagnostic[]> {
    return this.validation.doValidation(this.markdownDocuments.get(document))
  }
  format(document: TextDocument, range?: Range): TextEdit[] {
    const mDocument = this.markdownDocuments.get(document)
    const newText = mDocument.stringify(this.settings.format, range)
    if (!range)
      range = Range.create(Position.create(0, 0), document.positionAt(document.getText().length));

    return [TextEdit.replace(range, mDocument.stringify())]
  }
  hover(document: TextDocument, position: Position): Hover {
    throw "Not implemented"
  }
  closeDocument(document: TextDocument) {
    this.markdownDocuments.delete(document)
  }
  shutdown() {
    this.markdownDocuments.dispose()
  }
}
