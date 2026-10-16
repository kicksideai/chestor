// Compact, dependency-free markdown renderer for node/edge descriptions and
// material bodies. HTML is escaped first, then a known-safe subset of inline
// and block constructs is emitted, so the output is safe by construction
// (no raw HTML from the source can survive escaping).

function escapeHtml(src: string): string {
  return src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inline(src: string): string {
  let s = escapeHtml(src)
  // inline code
  s = s.replace(/`([^`]+)`/g, (_m, c) => `<code>${c}</code>`)
  // bold then italic
  s = s.replace(/\*\*([^*]+)\*\*/g, (_m, c) => `<strong>${c}</strong>`)
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, (_m, pre, c) => `${pre}<em>${c}</em>`)
  s = s.replace(/(^|[^_])_([^_\n]+)_/g, (_m, pre, c) => `${pre}<em>${c}</em>`)
  // links [text](url) — only http/https/mailto to avoid javascript: URIs
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
    (_m, text, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`)
  return s
}

export function renderMarkdown(source: string | undefined | null): string {
  if (!source) return ''
  const lines = String(source).replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let listType: 'ul' | 'ol' | null = null
  let inCode = false
  const codeBuf: string[] = []

  function closeList() {
    if (listType) { out.push(`</${listType}>`); listType = null }
  }

  for (const line of lines) {
    const fence = line.trim().startsWith('```')
    if (fence) {
      if (inCode) { out.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`); codeBuf.length = 0; inCode = false }
      else { closeList(); inCode = true }
      continue
    }
    if (inCode) { codeBuf.push(line); continue }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      closeList()
      const level = heading[1].length
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      continue
    }

    const ol = /^\s*\d+\.\s+(.*)$/.exec(line)
    const ul = /^\s*[-*]\s+(.*)$/.exec(line)
    if (ol || ul) {
      const want: 'ul' | 'ol' = ol ? 'ol' : 'ul'
      if (listType && listType !== want) closeList()
      if (!listType) { listType = want; out.push(`<${want}>`) }
      out.push(`<li>${inline((ol ? ol[1] : (ul as RegExpExecArray)[1]))}</li>`)
      continue
    }

    if (line.trim() === '') { closeList(); continue }

    closeList()
    out.push(`<p>${inline(line)}</p>`)
  }
  if (inCode) out.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`)
  closeList()
  return out.join('')
}
