import { TextDocument, Diagnostic, DiagnosticSeverity, Range, Position } from "vscode-languageserver-types";
import { MarkdownSettings } from "../main"
import { Rules, Rule, Level, RuleSettings } from './lintRules'
import { start } from "repl";
const remark = require('remark');

export class MarkdownValidation {
  public doValidation(textDocument: TextDocument, settings: MarkdownSettings): Promise<Diagnostic[]> {
    const validator = remark()

    const rulesSettings = new Map()

    for (const ruleName in Rules) {
      const rule: Rule = (Rules as any)[ruleName]
      const ruleSettings : RuleSettings = Object.assign(((settings.lints || {}) as any)[ruleName] || {}, rule.defaultSettings)
      rulesSettings.set(rule.remarkLint, ruleSettings)

      if (ruleSettings.level != Level.Ignore)
        validator.use(require(rule.remarkLint), ruleSettings.options)
    }
    const result: Promise<VFile> = validator.process(textDocument.getText())

    return result.then((file) => file.messages.map(message => {
      let range;
      if(message.location && validatePoint(message.location.start)) {
        let end = message.location.end;
        if (!validatePoint(end))
          end = message.location.start;
        range = Range.create(
          message.location.start.line as number - 1, message.location.start.column as number - 1, 
          end.line as number - 1, end.column as number - 1
        )
      }
      else
        range = Range.create(0,0,0,0)
      const ruleSettings = rulesSettings.get(`${message.source}-${message.ruleId}`)
      return <Diagnostic>{
        range,
        severity: ruleSettings.level == Level.Warning ? DiagnosticSeverity.Warning : DiagnosticSeverity.Error,
        code: message.ruleId,
        source: message.ruleId,
        message: message.reason
      } 
    }))
  }
}

function validatePoint(point: VPoint) {
  return point.line && point.offset
}

type VMessage = {
  reason: string,
  fatal: boolean
  line?: number,
  column?: number,
  location?: VPosition,
  source?: string
  ruleId?: string
  stack?: string
}

type VFile = {
  contents?: Buffer | string,
  cwd: string,
  path?: string,
  stem?: string,
  extname?: string,
  dirname?: string,
  history: Array<string>,
  messages: Array<VMessage>
}

type VPosition = {
  start: VPoint,
  end: VPoint,
  indent?: number
}

type VPoint = {
  line?: number,
  column?: number,
  offset?: number
}