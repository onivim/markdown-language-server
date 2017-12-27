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

// RegExes from https://gist.github.com/renehamburger/12f14a9bd9297394e5bd
const ImageTokenRegEx = /!\[([^\[]+)\]\(([^\)]+)\)/g
const HyperLinkRegEx = /\[([^\[]+)\]\(([^\)]+)\)/g

export const getLinkTokens = (line: string): IMarkdownToken[] => {
    return getMatchesFromRegex(line, HyperLinkRegEx)
}

export const getImageTokens = (line: string): IMarkdownToken[] => {
    return getMatchesFromRegex(line, ImageTokenRegEx)
}

const getMatchesFromRegex = (line: string, regex: RegExp): IMarkdownToken[] => {
    const clonedRegEx = new RegExp(regex)

    const ret: IMarkdownToken[] = []

    let match = clonedRegEx.exec(line)
    while (match !== null) {
        const start = match.index
        const fullMatch = match[0]
        const altText = match[1]
        const hyperLink = match[2]
        const end = match.index + fullMatch.length - 1

        ret.push({
            raw: fullMatch,
            name: altText,
            url: hyperLink,
            start,
            end,
        })

        match = clonedRegEx.exec(line)
    }
    return ret
}
