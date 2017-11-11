/**
 * Lightweight parser to extract links & images from a line of markdown
 */

export interface IMarkdownToken {
    raw: string
    name: string
    url: string
    start: number
    end: number
}

export const getLinkTokens = (line: string): IMarkdownToken[] => {
    return []
}

export const getImageTokens = (line: string): IMarkdownToken[] => {
    return []
}
