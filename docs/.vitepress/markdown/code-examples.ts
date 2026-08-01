import type MarkdownIt from 'markdown-it'
import { parse } from 'vue/compiler-sfc'

export interface DocsCodeExampleParts {
  javascript?: string
  javascriptLanguage?: 'js' | 'ts'
  html?: string
  css?: string
}

function normalizeCodeIndentation(source: string): string {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')

  while (lines.length && !lines[0].trim()) lines.shift()
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop()

  const indentation = lines.filter((line) => line.trim()).map((line) => line.match(/^[\t ]*/)?.[0].length ?? 0)
  const commonIndentation = indentation.length ? Math.min(...indentation) : 0

  return lines.map((line) => (line.trim() ? line.slice(commonIndentation) : '')).join('\n')
}

export function splitVueCodeExample(source: string): DocsCodeExampleParts | null {
  const result = parse(source, { filename: 'DocsCodeExample.vue' })
  if (result.errors.length) return null

  const { descriptor } = result
  const scriptBlocks = [descriptor.script, descriptor.scriptSetup]
    .filter((block) => Boolean(block?.content.trim()))
    .map((block) => normalizeCodeIndentation(block?.content ?? ''))

  const javascript = scriptBlocks.join('\n\n')
  const html = descriptor.template?.content.trim() ? normalizeCodeIndentation(descriptor.template.content) : ''
  const css = descriptor.styles
    .filter((block) => block.content.trim())
    .map((block) => normalizeCodeIndentation(block.content))
    .join('\n\n')

  if (!javascript && !html && !css) return null

  return {
    ...(javascript
      ? {
          javascript,
          javascriptLanguage:
            descriptor.script?.lang === 'ts' || descriptor.scriptSetup?.lang === 'ts'
              ? ('ts' as const)
              : ('js' as const),
        }
      : {}),
    ...(html ? { html } : {}),
    ...(css ? { css } : {}),
  }
}

export function installDocsCodeExamples(md: MarkdownIt): void {
  const renderFence = md.renderer.rules.fence
  if (!renderFence) return

  md.renderer.rules.fence = (tokens, index, options, env, self) => {
    const sourceToken = tokens[index]
    if (sourceToken.info.trim().split(/\s+/u)[0] !== 'vue') {
      return renderFence(tokens, index, options, env, self)
    }

    const parts = splitVueCodeExample(sourceToken.content)
    if (!parts) return renderFence(tokens, index, options, env, self)

    const renderPart = (content: string, language: string): string => {
      const token = Object.assign(Object.create(Object.getPrototypeOf(sourceToken)), sourceToken)
      token.info = language
      token.content = `${content}\n`
      return renderFence([token], 0, options, env, self)
    }

    const slots = [
      parts.javascript
        ? `<template #javascript>${renderPart(parts.javascript, parts.javascriptLanguage ?? 'js')}</template>`
        : '',
      parts.html ? `<template #html>${renderPart(parts.html, 'html')}</template>` : '',
      parts.css ? `<template #css>${renderPart(parts.css, 'css')}</template>` : '',
    ].join('')

    return `<docs-code-example>${slots}</docs-code-example>`
  }
}
