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


connection.onHover(async (textDocumentPosition): Promise<types.Hover> => {

    let document = documents.get(textDocumentPosition.textDocument.uri)

    // TODO:
    // Image content
    throw "No content"
})

connection.listen()
