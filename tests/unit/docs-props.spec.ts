import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const componentDocs = resolve(process.cwd(), 'docs/components')

function splitMarkdownRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/gu, '')
    .split(/(?<!\\)\|/gu)
    .map((cell) => cell.trim())
}

describe('component Props documentation', () => {
  it('gives every parameter table a non-empty description column', () => {
    const failures: string[] = []

    for (const filename of readdirSync(componentDocs).filter((file) => file.endsWith('.md'))) {
      const lines = readFileSync(resolve(componentDocs, filename), 'utf8').split(/\r?\n/gu)

      for (let index = 0; index < lines.length - 1; index += 1) {
        const headers = splitMarkdownRow(lines[index])
        const isParameterTable =
          lines[index].trim().startsWith('|') &&
          headers.includes('类型') &&
          headers.includes('默认') &&
          ['Prop', '名称', '参数'].includes(headers[0])

        if (!isParameterTable) continue

        const descriptionIndex = headers.indexOf('说明')
        if (descriptionIndex < 0) {
          failures.push(`${filename}:${index + 1} 缺少“说明”列`)
          continue
        }

        for (
          let rowIndex = index + 2;
          rowIndex < lines.length && lines[rowIndex].trim().startsWith('|');
          rowIndex += 1
        ) {
          const cells = splitMarkdownRow(lines[rowIndex])
          if (cells[0]?.includes('、')) {
            failures.push(`${filename}:${rowIndex + 1} 多个参数必须拆分为独立行`)
          }
          const description = cells[descriptionIndex]?.replace(/`/gu, '').trim()
          if (!description || /^[-—]+$/u.test(description)) {
            failures.push(`${filename}:${rowIndex + 1} 参数 ${cells[0] || '(未知)'} 缺少说明`)
          }
        }
      }
    }

    expect(failures).toEqual([])
  })
})
