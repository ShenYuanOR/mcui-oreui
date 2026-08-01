import type MarkdownIt from 'markdown-it'

export function installDocsTables(md: MarkdownIt): void {
  const renderTableOpen = md.renderer.rules.table_open
  const renderTableClose = md.renderer.rules.table_close

  md.renderer.rules.table_open = (tokens, index, options, env, self) => {
    const table = renderTableOpen
      ? renderTableOpen(tokens, index, options, env, self)
      : self.renderToken(tokens, index, options)

    return `<div class="mc-docs-table-scroll">${table}`
  }

  md.renderer.rules.table_close = (tokens, index, options, env, self) => {
    const table = renderTableClose
      ? renderTableClose(tokens, index, options, env, self)
      : self.renderToken(tokens, index, options)

    return `${table}</div>`
  }
}
