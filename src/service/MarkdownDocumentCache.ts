import { TextDocument } from "vscode-languageserver/lib/main";
import { MarkdownDocument } from "./MarkdownDocument";
import { clearInterval } from "timers";

export class MarkdownDocumentCache {
  private markdownDocuments: Map<string, { version: number, languageId: string, time: number, document: MarkdownDocument }>
  private interval?: NodeJS.Timer;

  constructor(public maxEntries: number, cleanupInterval: number) {
    this.markdownDocuments = new Map()
    this.interval = setInterval(() => {
      const time = Date.now() - cleanupInterval * 1000

      for (const [uri, info] of this.markdownDocuments.entries())
        if (info.time < time)
          this.markdownDocuments.delete(uri);
    }, cleanupInterval)
  }

  get(document: TextDocument): MarkdownDocument {
    const mDocInfo = this.markdownDocuments.get(document.uri)
    if (mDocInfo) {
      const { version, languageId, document: mDoc } = mDocInfo
      if (version === document.version && languageId === document.languageId) {
        mDocInfo.time = Date.now()
        return mDoc
      }
    }
    const mDoc = new MarkdownDocument(document.getText())
    this.markdownDocuments.set(document.uri, {
      version: document.version,
      languageId: document.languageId,
      time: Date.now(),
      document: mDoc
    })

    if (this.markdownDocuments.size === this.maxEntries) {
      // Remove oldest
      let oldestTime = Infinity
      let oldest
      for (const [uri, info] of this.markdownDocuments.entries()) {
        if (info.time < oldestTime) {
          oldest = uri;
          oldestTime = info.time
        }
      }
      if (oldest)
        this.markdownDocuments.delete(oldest)
    }

    return mDoc
  }

  delete(document: TextDocument) {
    this.markdownDocuments.delete(document.uri)
  }

  dispose() {
    if (this.interval)
      clearInterval(this.interval)
    this.markdownDocuments.clear()
  }
}