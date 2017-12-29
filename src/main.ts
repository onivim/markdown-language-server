#!/usr/bin/env node

import { createConnection, IConnection, TextDocuments, InitializeParams, InitializeResult, ServerCapabilities } from "vscode-languageserver"

import { TextDocument } from "vscode-languageserver-types"

import * as types from "vscode-languageserver-types"
import { LintsSettings } from "./services/lintRules"
import { MarkdownValidation } from "./services/MarkdownValidation";

export type MarkdownSettings = {
    validate?: boolean;
    lints?: LintsSettings; 
}

const connection: IConnection = createConnection()

console.log = connection.console.log.bind(connection.console)
//console.error = connection.console.error.bind(connection.console)

const documents: TextDocuments = new TextDocuments()
const validation = new MarkdownValidation()
let settings = {}

documents.listen(connection)

connection.onInitialize((params: InitializeParams): InitializeResult => {
    const capabilities: ServerCapabilities = {
        textDocumentSync: documents.syncKind,
        hoverProvider: true,
        definitionProvider: true,
    }

    return {capabilities}
})

documents.onDidChangeContent(change => {
    const diagnostics = validation.doValidation(change.document, settings)

    diagnostics.then(diagnostics => connection.sendDiagnostics({ uri: change.document.uri, diagnostics }))
})

connection.listen()
