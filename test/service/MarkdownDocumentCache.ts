import * as assert from "assert";
import MarkdownDocumentCache from "../../src/service/MarkdownDocumentCache"
import { TextDocument } from "vscode-languageserver";
import { MarkdownDocument } from "../../src/service/MarkdownDocument";

const createDocument = 
  (uri: string, languageId: string = "markdown", version: number = 1) => TextDocument.create(uri, languageId, version, "")

describe("MarkdownDocumentCache", () => {
  let markdownDocumentCache: MarkdownDocumentCache

  before(() => {
    markdownDocumentCache = new MarkdownDocumentCache(3, 0.1);
  })
  
  after(() => {
    markdownDocumentCache.dispose()
  })

  describe("get", () => {
    it("return MarkdownDocument", () => {
      const markdownDocument = markdownDocumentCache.get(createDocument("test://testDoc"))
      assert(markdownDocument !== null, "return value is not null")
      assert(markdownDocument instanceof MarkdownDocument, "return value is instance of MarkdownDocument")
    })

    it("return same instance if documents are equals", () => {
      const markdownDocument = markdownDocumentCache.get(createDocument("test://testDoc"))
      const markdownDocument2 = markdownDocumentCache.get(createDocument("test://testDoc"))
      assert(markdownDocument === markdownDocument2, "return same instance")
    })

    it("return different instances if version is not equal", () => {
      const markdownDocument = markdownDocumentCache.get(createDocument("test://testDoc", "markdown", 1))
      const markdownDocument2 = markdownDocumentCache.get(createDocument("test://testDoc", "markdown", 2))
      assert(markdownDocument !== markdownDocument2, "return different instances")
    })

    it("return different instances if languageId is not equal", () => {
      const markdownDocument = markdownDocumentCache.get(createDocument("test://testDoc", "markdown1"))
      const markdownDocument2 = markdownDocumentCache.get(createDocument("test://testDoc", "markdown2"))
      assert(markdownDocument !== markdownDocument2, "return different instances")
    })

    it("remove older document when maxEntries is reached", () => {
      const markdownDocument = markdownDocumentCache.get(createDocument("test://testDoc"))
      markdownDocumentCache.get(createDocument("test://testDoc1"))
      markdownDocumentCache.get(createDocument("test://testDoc2"))
      markdownDocumentCache.get(createDocument("test://testDoc3"))
      const markdownDocument2 = markdownDocumentCache.get(createDocument("test://testDoc"))
      assert(markdownDocument !== markdownDocument2, "return different instance")
    })
  })

  describe("delete", () => {
    it("remove from cache", () => {
      const textDoc = createDocument("test://testDoc")
      const markdownDocument = markdownDocumentCache.get(textDoc)
      markdownDocumentCache.delete(textDoc)
      const markdownDocument2 = markdownDocumentCache.get(textDoc)
      assert(markdownDocument !== markdownDocument2, "return different instance")
    })
  })

  describe("cleanup", () => {
    it("remove from cache", (done) => {
      const markdownDocument = markdownDocumentCache.get(createDocument("test://testDoc"))
      setTimeout(() => {
        const markdownDocument2 = markdownDocumentCache.get(createDocument("test://testDoc"))
        assert(markdownDocument !== markdownDocument2, "return different instance")
        done()
      }, 200);
    })
  })

  describe("dispose", () => {
    it("can be called multiple time", () => {
      markdownDocumentCache.dispose()
      markdownDocumentCache.dispose()
    })
  })
})