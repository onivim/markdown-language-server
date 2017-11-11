import { createConnection, IConnection, TextDocuments, InitializeParams, InitializeResult, ServerCapabilities } from "vscode-languageserver"

import { TextDocument } from "vscode-languageserver-types"

import * as types from "vscode-languageserver-types"

let connection: IConnection = createConnection()

console.log = connection.console.log.bind(connection.console)
console.error = connection.console.error.bind(connection.console)

let documents: TextDocuments = new TextDocuments()

documents.listen(connection)

connection.onInitialize((params: InitializeParams): InitializeResult => {
    let capabilities: ServerCapabilities = {
        textDocumentSync: documents.syncKind,
        hoverProvider: true,
        definitionProvider: true,
    }

    return {capabilities}
})

const documentContent: { [documentUri: string]: string } = {}

const writeGood = require("write-good")

interface IWriteGoodSuggestion {
    reason: string
    index: number // line
    offset: number // character
}

documents.onDidChangeContent(change => {
    const suggestions: IWriteGoodSuggestion[] = writeGood(change.document.getText())

    const diagnostics = suggestions.map((suggestion:  IWriteGoodSuggestion) => {
        const position = change.document.positionAt(suggestion.index)
        const diagnostic: types.Diagnostic = {
            message: suggestion.reason,
            range: types.Range.create(position.line, position.character, position.line, position.character + suggestion.offset),
        }

        return diagnostic
    })

    connection.sendDiagnostics({ uri: change.document.uri, diagnostics })
})

connection.onHover(async (textDocumentPosition): Promise<types.Hover> => {

    let document = documents.get(textDocumentPosition.textDocument.uri)

    // TODO:
    // Image content
    throw "No content"
})

connection.listen()
