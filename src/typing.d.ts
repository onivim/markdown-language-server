declare module 'remark-parse' {
  import { Plugin, Node } from "unified";

  const parse: Plugin

  export default parse;
}

declare module 'remark-stringify' {
  import { Plugin } from "unified";
  
  const stringify: Plugin

  export default stringify;

  // See https://github.com/remarkjs/remark/tree/master/packages/remark-stringify#options
  export type FormatSettings = {
    /**
     * Stringify with the required escapes for GFM compatible markdown (default: true).
     *
     * Escape pipes (|, for tables)
     * Escape colons (:, for literal URLs)
     * Escape tildes (~, for strike-through)
     */
    gfm?: boolean,
    
    /**
     * Stringify for CommonMark compatible markdown (default: false).
     *
     * Compile adjacent blockquotes separately
     * Escape more characters using slashes, instead of as entities
     */
    commonmark?: boolean,
    
    /**
     * Stringify for pedantic compatible markdown (default: false).
     *
     * Escape underscores in words
     */
    pedantic?: boolean,

    
    /**
     * How to stringify entities (default: false):
     *
     * true — Entities are generated for special HTML characters (& > &amp;) and non-ASCII characters (© > &copy;). If named entities are not (widely) supported, numbered character references are used (’ > &#x2019;)
     * 'numbers' — Numbered entities are generated (& > &#x26;) for special HTML characters and non-ASCII characters
     * 'escape' — Special HTML characters are encoded (& > &amp;, ’ > &#x2019;), non-ASCII characters not (ö persists)
     */
    entities?: boolean | 'numbers' | 'escape',
    
    /**
     * Compile headings, when possible, in Setext-style (default: false). 
     * 
     * Uses = for level one headings and - for level two headings. Other heading levels are compiled as ATX (respecting closeAtx).
     */
    setext?: boolean,
    
    /**
     * Compile ATX headings with the same amount of closing hashes as opening hashes (default: false).
     */
    closeAtx?: boolean,
    
    /**
     * Create tables without fences: initial and final pipes (default: false).
     */
    looseTable?: boolean,
    
    /**
     * Create tables without spacing between pipes and content (default: true).
     */
    spacedTable?: boolean,
    
    /**
     * Create tables without spacing between pipes and content (default: true).
     */
    paddedTable?: boolean,
    
    /**
     * Create tables with padding in each cell so that they are the same size (default: true).
     */
    stringLength?: boolean,
    
    /** 
     * Function passed to markdown-table to detect the length of a table cell (default: s => s.length).
     */
    fence?: (fence: string) => number,
    
    /**
     * Fence marker to use for code blocks (default: '`').
     */
    fences?: '~' | '`',
    
    /**
     * Stringify code blocks without language with fences (default: false).
     */
    bullet?: boolean,
    
    /**
     * Bullet marker to use for unordered list items (default: '-').
     */
    listItemIndent?: '-' | '*' | '+',
    
    /**
     * How to indent the content from list items (default: 'tab').
     *  
     * 'tab': use tab stops (4 spaces)
     * '1': use one space
     * 'mixed': use 1 for tight and tab for loose list items
     */
    incrementListMarker?: 'tab' | 'mixed' | '1',
    
    /**
     * Whether to increment ordered list item bullets (default: true).
     */
    rule?: boolean,
    
    /**
     * Marker to use for thematic breaks / horizontal rules (default: '*').
     */
    ruleRepetition?: '-' | '*' | '_',
    
    /**
     * Number of markers to use for thematic breaks / horizontal rules (default: 3). Should be 3 or more.
     */
    ruleSpaces?: number,
    
    /**
     *   Whether to pad thematic break (horizontal rule) markers with spaces (default true).
     */
    strong?: boolean,
    
    /**
     *  Marker to use for importance (default '*').
     */
    emphasis?: '_' | '*'
  }
}

declare module 'unified' {
  import { ToVFile, VFile } from "vfile";

  export type Plugin = Function | Array<[Function, any]>
  export type Node = any

  export interface Processor extends ProcessorFunc{
    use(plugin: Plugin ,options?: any): this
    parse(value: ToVFile): Node,
    stringify(node: Node, file?: ToVFile): string,
    run(node: Node, file?: ToVFile): Promise<VFile>,
    runSync(node: Node, file?: ToVFile): VFile,
    process(file: ToVFile): Promise<VFile>,
    processSync(file: ToVFile): VFile,
    data(key: string): any,
    data(key: string, value: any): this,
    freeze(): Processor
  }
  type ProcessorFunc = () => Processor
  
  const unified: Processor

  export default unified
}

declare module 'vfile' {
  export type ToVFile = VFile | string

  export interface VFile {
    contents?: Buffer | string,
    cwd: string,
    path?: string,
    stem?: string,
    extname?: string,
    dirname?: string,
    history: Array<string>,
    messages?: Array<VMessage>
  }

  export interface VMessage {
    reason: string,
    fatal: boolean
    line?: number,
    column?: number,
    location?: VPosition,
    source?: string
    ruleId?: string
    stack?: string
  }
  
  export interface VPosition {
    start: VPoint,
    end: VPoint,
    indent?: number
  }
  
  export interface VPoint {
    line?: number,
    column?: number,
    offset?: number
  }
}

declare module 'unist-util-visit' {
  import { Node } from "unified";

  type Test = (node: Node) => boolean | string | Object
  function visit(tree: Node, test: Test | Array<Test> | undefined, visitor: (node: Node) => void, reverse?: boolean): void

  export default visit
}