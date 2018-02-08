import * as assert from "assert";
import { MarkdownDocument } from "../../src/service/MarkdownDocument";
import { Range } from "vscode-languageserver-types"

describe("MarkdownDocument", () => {
  describe("root", () => {
    it("instanceof Node", () => {
      const markdownDocument = new MarkdownDocument("");
      assert(Array.isArray(markdownDocument.root.children), "root has an array children property")
      assert(markdownDocument.root.type, "root has type property")
    })
  })

  describe("stringify", () => {
    it("Accept empty range", () => {
      const markdownDocument = new MarkdownDocument("*flying* _Unicorn_\n");
      assert(markdownDocument.stringify({
        emphasis: '*'
      }) == "*flying* *Unicorn*\n")
    })

    it("Find node when it's in range", () => {
      const markdownDocument = new MarkdownDocument(
`Hello

*flying* _Unicorn_
`
      );

      assert(
        markdownDocument.stringify(
          { emphasis: '*' }, 
          Range.create(2, 0, 2, "*flying* _Unicorn_".length)
        ) == "*flying* *Unicorn*"
      )
    })
  })
})