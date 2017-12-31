import { TextDocument, Diagnostic, DiagnosticSeverity, Range, Position } from "vscode-languageserver-types";
import { Rules, Rule, Level, RuleSettings, LintsSettings } from './lintRules'
import { MarkdownDocument } from "./MarkdownDocument";
import { VFile, VPoint } from "vfile";
import { Processor } from "unified";
const unified: Processor = require("unified");
const vfile = require("vfile");

export class MarkdownValidation {
  private validate: (node: any) => Promise<VFile>
  private rulesSettings: Map<string, RuleSettings>;

  constructor(settings: LintsSettings = {}) {
    this.configure(settings);
  }

  public configure(settings: LintsSettings = {}) {
    const rulesSettings = new Map()
    const validator = unified()
    for (const ruleName in Rules) {
      const rule: Rule = (Rules as any)[ruleName]
      const ruleSettings : RuleSettings = Object.assign((settings as any)[ruleName] || {}, rule.defaultSettings)
      rulesSettings.set(rule.remarkLint, ruleSettings)

      if (ruleSettings.level != Level.Ignore)
        validator.use(require(rule.remarkLint), ruleSettings.options)
    }
    validator.freeze()

    this.validate = (node) => {
      const file: VFile = vfile()
      return validator.run(node, file).then(() => file)
    }
    this.rulesSettings = rulesSettings;
  }

  public doValidation(document: MarkdownDocument): Promise<Diagnostic[]> {
    return this.validate(document.root).then((file) => file.messages.map(message => {
      let range;
      if(message.location && MarkdownValidation.validatePoint(message.location.start)) {
        let end = message.location.end;

        if (!MarkdownValidation.validatePoint(end))
          end = message.location.start;

        range = Range.create(
          message.location.start.line as number - 1, message.location.start.column as number - 1, 
          end.line as number - 1, end.column as number - 1
        )
      }
      else
        range = Range.create(0,0,0,0)
      const ruleSettings = this.rulesSettings.get(`${message.source}-${message.ruleId}`) || { level: Level.Ignore }
      return <Diagnostic>{
        range,
        severity: ruleSettings.level == Level.Warning ? DiagnosticSeverity.Warning : DiagnosticSeverity.Error,
        code: message.ruleId,
        source: message.ruleId,
        message: message.reason
      } 
    }))
  }

  static validatePoint({ line, offset }: VPoint) {
    return line && offset
  }
}