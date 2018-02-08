import * as assert from "assert";
import { Rules, Rule } from "../../src/service/lintRules"

describe("lintsRules", () => {
  describe("Rules", () => {
    it("remarkLint is a npm module", () => {
      for (const key in Rules) {
        require.resolve(((Rules as any)[key] as Rule).remarkLint)
      }
    })
  })
})