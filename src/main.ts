#!/usr/bin/env node

import { createConnection, IConnection, TextDocuments, InitializeParams, InitializeResult, ServerCapabilities } from "vscode-languageserver"

import { TextDocument, Range } from "vscode-languageserver-types"

import * as types from "vscode-languageserver-types"
import { LintsSettings } from "./services/lintRules"
import { MarkdownValidation } from "./services/MarkdownValidation";
import { MarkdownDocument } from "./MarkdownDocument";
import { FormatSettings } from "remark-stringify";
import { MarkdownSettings, MarkdownServer } from "./services/MarkdownServer";

const connection =
  process.argv.length <= 2
    ? createConnection(process.stdin, process.stdout) // no arg specified
    : createConnection();

console.log = connection.console.log.bind(connection.console)
//console.error = connection.console.error.bind(connection.console)

const documents = new TextDocuments()
const server = new MarkdownServer({})

documents.listen(connection)

connection.onInitialize((params: InitializeParams): InitializeResult => {
    const capabilities: ServerCapabilities = {
        textDocumentSync: documents.syncKind,
        hoverProvider: true,
        definitionProvider: true,
        documentFormattingProvider: true
    }

    return {capabilities}
})

const pendingValidationRequests: { [uri: string]: NodeJS.Timer } = {};
const validationDelayMs = 200;

documents.onDidChangeContent(change => {
    triggerValidation(change.document)
})


function cleanPendingValidation(textDocument: TextDocument): void {
    const request = pendingValidationRequests[textDocument.uri];
    if (request) {
        clearTimeout(request);
        delete pendingValidationRequests[textDocument.uri];
    }
}
  
function triggerValidation(textDocument: TextDocument): void {
    cleanPendingValidation(textDocument);
    pendingValidationRequests[textDocument.uri] = setTimeout(() => {
        delete pendingValidationRequests[textDocument.uri];
        validateTextDocument(textDocument);
    }, validationDelayMs);
}
  
function validateTextDocument(textDocument: TextDocument): void {
    server.validate(textDocument).then(diagnostics => {
        connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    })
}
  
connection.onDocumentFormatting(formatting => {
    return server.format(documents.get(formatting.textDocument.uri))
})

connection.onDocumentRangeFormatting(formatting => {
    return server.format(documents.get(formatting.textDocument.uri), formatting.range)
})

connection.onHover(hover => {
    return server.hover(documents.get(hover.textDocument.uri), hover.position)
})

connection.listen()
