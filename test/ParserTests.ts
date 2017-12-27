import * as assert from "assert"

import * as Parser from "./../src/Parser"

describe("Parser", () => {
    describe("getLinkTokens", () => {
        it("returns null if no link tokens", () => {
            const tokens = Parser.getLinkTokens("# hello")

            assert.deepEqual(tokens, [])
        })

        it("returns correct result for single link token", () => {  
            const tokens = Parser.getLinkTokens("[test](http://onivim.io)")

            assert.deepEqual(tokens, [{
                raw: "[test](http://onivim.io)",
                name: "test",
                url: "http://onivim.io",
                start: 0,
                end: 23,
            }])
        })
    })

    describe("getImageTokens", () => {
        it("returns null if no image tokens", () => {
            const tokens = Parser.getImageTokens("# hello")

            assert.deepEqual(tokens, [])
        })

        it("returns correct result for single image token", () => {  
            const tokens = Parser.getImageTokens("![testImage](http://onivim.io/hero.png)")

            assert.deepEqual(tokens, [{
                raw: "![testImage](http://onivim.io/hero.png)",
                name: "testImage",
                url: "http://onivim.io/hero.png",
                start: 0,
                end: 38,
            }])
        })
    })
})
