export enum Level {
	Ignore = 1,
	Warning = 2,
	Error = 3
}

export type RuleSettings = {
    level?: Level,
    options?: any
}
export class Rule {
    public constructor(public remarkLint: string, public defaultSettings: RuleSettings = { level: Level.Warning }) {}
}

export const Rules = {
    blockquoteIndentation: new Rule('remark-lint-blockquote-indentation'),
    checkboxCharacterStyle: new Rule('remark-lint-checkbox-character-style'),
    checkboxContentIndent: new Rule('remark-lint-checkbox-content-indent'),
    codeBlockStyle: new Rule('remark-lint-code-block-style'),
    definitionCase: new Rule('remark-lint-definition-case'),
    definitionSpacing: new Rule('remark-lint-definition-spacing'),
    emphasisMarker: new Rule('remark-lint-emphasis-marker'),
    fencedCodeFlag: new Rule('remark-lint-fenced-code-flag'),
    fencedCodeMarker: new Rule('remark-lint-fenced-code-marker'),
    fileExtension: new Rule('remark-lint-file-extension'),
    finalDefinition: new Rule('remark-lint-final-definition'),
    finalNewline: new Rule('remark-lint-final-newline'),
    firstHeadingLevel: new Rule('remark-lint-first-heading-level'),
    hardBreakSpaces: new Rule('remark-lint-hard-break-spaces'),
    headingIncrement: new Rule('remark-lint-heading-increment'),
    headingStyle: new Rule('remark-lint-heading-style'),
    linebreakStyle: new Rule('remark-lint-linebreak-style'),
    linkTitleStyle: new Rule('remark-lint-link-title-style'),
    listItemBulletIndent: new Rule('remark-lint-list-item-bullet-indent'),
    listItemContentIndent: new Rule('remark-lint-list-item-content-indent'),
    listItemIndent: new Rule('remark-lint-list-item-indent'),
    listItemSpacing: new Rule('remark-lint-list-item-spacing'),
    maximumHeadingLength: new Rule('remark-lint-maximum-heading-length'),
    maximumLineLength: new Rule('remark-lint-maximum-line-length'),
    noAutoLinkWithoutProtocol: new Rule('remark-lint-no-auto-link-without-protocol'),
    noBlockquoteWithoutMarker: new Rule('remark-lint-no-blockquote-without-marker'),
    noConsecutiveBlankLines: new Rule('remark-lint-no-consecutive-blank-lines'),
    noDuplicateDefinitions: new Rule('remark-lint-no-duplicate-definitions'),
    noDuplicateHeadings: new Rule('remark-lint-no-duplicate-headings'),
    noDuplicateHeadingsInSection: new Rule('remark-lint-no-duplicate-headings-in-section'),
    noEmphasisAsHeading: new Rule('remark-lint-no-emphasis-as-heading'),
    noEmptyUrl: new Rule('remark-lint-no-empty-url'),
    noFileNameArticles: new Rule('remark-lint-no-file-name-articles'),
    noFileNameConsecutiveDashes: new Rule('remark-lint-no-file-name-consecutive-dashes'),
    noFileNameIrregularCharacters: new Rule('remark-lint-no-file-name-irregular-characters'),
    noFileNameMixedCase: new Rule('remark-lint-no-file-name-mixed-case'),
    noFileNameOuterDashes: new Rule('remark-lint-no-file-name-outer-dashes'),
    noHeadingContentIndent: new Rule('remark-lint-no-heading-content-indent'),
    noHeadingIndent: new Rule('remark-lint-no-heading-indent'),
    noHeadingLikeParagraph: new Rule('remark-lint-no-heading-like-paragraph'),
    noHeadingPunctuation: new Rule('remark-lint-no-heading-punctuation'),
    noHtml: new Rule('remark-lint-no-html'),
    noInlinePadding: new Rule('remark-lint-no-inline-padding'),
    noLiteralUrls: new Rule('remark-lint-no-literal-urls'),
    noMissingBlankLines: new Rule('remark-lint-no-missing-blank-lines'),
    noMultipleToplevelHeadings: new Rule('remark-lint-no-multiple-toplevel-headings'),
    noParagraphContentIndent: new Rule('remark-lint-no-paragraph-content-indent'),
    noReferenceLikeUrl: new Rule('remark-lint-no-reference-like-url'),
    noShellDollars: new Rule('remark-lint-no-shell-dollars'),
    noShortcutReferenceImage: new Rule('remark-lint-no-shortcut-reference-image'),
    noShortcutReferenceLink: new Rule('remark-lint-no-shortcut-reference-link'),
    noTableIndentation: new Rule('remark-lint-no-table-indentation'),
    noTabs: new Rule('remark-lint-no-tabs'),
    noUndefinedReferences: new Rule('remark-lint-no-undefined-references'),
    noUnusedDefinitions: new Rule('remark-lint-no-unused-definitions'),
    orderedListMarkerStyle: new Rule('remark-lint-ordered-list-marker-style'),
    orderedListMarkerValue: new Rule('remark-lint-ordered-list-marker-value'),
    ruleStyle: new Rule('remark-lint-rule-style'),
    strongMarker: new Rule('remark-lint-strong-marker'),
    tableCellPadding: new Rule('remark-lint-table-cell-padding'),
    tablePipeAlignment: new Rule('remark-lint-table-pipe-alignment'),
    tablePipes: new Rule('remark-lint-table-pipes'),
    unorderedListMarkerStyle: new Rule('remark-lint-unordered-list-marker-style')
}

export type LintsSettings = {
    [_ in keyof typeof Rules]?: RuleSettings
}
