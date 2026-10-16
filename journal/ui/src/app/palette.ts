import { FAMILY_ORDER } from './force-layout'
import type { EdgeFamily, NodeFamily } from './force-layout'
import type { Palette } from './graph-draw'

/**
 * The canvas cannot read a custom property, so the palette is resolved out of
 * the component's own stylesheet through a probe: one hidden element per token,
 * each carrying the token as its colour. Everything the graph inks therefore
 * still comes from the host's theme contract, in both schemes and after a
 * re-brand, rather than from a literal palette written here.
 */

const NODE_TOKENS: Record<NodeFamily, string> = {
  anchor: '--jr-accent',
  rule: '--jr-rule',
  decision: '--jr-decision',
  evidence: '--jr-evidence',
  risk: '--jr-danger',
  open: '--jr-warn',
  agent: '--jr-accent-strong',
  note: '--jr-muted',
}

const EDGE_TOKENS: Record<EdgeFamily, string> = {
  structure: '--jr-muted',
  support: '--jr-success',
  conflict: '--jr-danger',
  succession: '--jr-decision',
  presence: '--jr-accent',
}

const SHELL_TOKENS = {
  bg: '--jr-bg',
  fg: '--jr-fg',
  muted: '--jr-muted',
  faint: '--jr-faint',
  border: '--jr-border',
  accent: '--jr-accent',
  panel: '--jr-panel',
} as const

function tokens(): string[] {
  return [
    ...Object.values(SHELL_TOKENS),
    ...FAMILY_ORDER.map(family => NODE_TOKENS[family]),
    NODE_TOKENS.agent,
    ...Object.values(EDGE_TOKENS),
  ]
}

/** The hidden element the palette is read from; one per canvas. */
export function createProbe(document: Document): HTMLElement {
  const probe = document.createElement('div')
  probe.setAttribute('aria-hidden', 'true')
  probe.className = 'jr-ink-probe'
  const unique = [...new Set(tokens())]
  for (const token of unique) {
    const span = document.createElement('i')
    span.dataset.token = token
    span.style.color = `var(${token})`
    probe.appendChild(span)
  }
  return probe
}

const FALLBACK = 'CanvasText'

export function readPalette(probe: HTMLElement): Palette {
  const resolved = new Map<string, string>()
  for (const child of Array.from(probe.children)) {
    const token = (child as HTMLElement).dataset.token
    if (!token) continue
    const value = getComputedStyle(child as HTMLElement).color
    resolved.set(token, value && value !== 'transparent' ? value : FALLBACK)
  }
  const of = (token: string) => resolved.get(token) || FALLBACK
  return {
    bg: of(SHELL_TOKENS.bg),
    fg: of(SHELL_TOKENS.fg),
    muted: of(SHELL_TOKENS.muted),
    faint: of(SHELL_TOKENS.faint),
    border: of(SHELL_TOKENS.border),
    accent: of(SHELL_TOKENS.accent),
    panel: of(SHELL_TOKENS.panel),
    family: {
      anchor: of(NODE_TOKENS.anchor), rule: of(NODE_TOKENS.rule), decision: of(NODE_TOKENS.decision),
      evidence: of(NODE_TOKENS.evidence), risk: of(NODE_TOKENS.risk), open: of(NODE_TOKENS.open),
      agent: of(NODE_TOKENS.agent), note: of(NODE_TOKENS.note),
    },
    edge: {
      structure: of(EDGE_TOKENS.structure), support: of(EDGE_TOKENS.support),
      conflict: of(EDGE_TOKENS.conflict), succession: of(EDGE_TOKENS.succession),
      presence: of(EDGE_TOKENS.presence),
    },
  }
}

/**
 * Calls back whenever the theme the host applies could have changed. The shell
 * marks the scheme on the document element, and a reader may also be following
 * the system, so both are watched.
 */
export function watchTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', onChange)
  return () => {
    observer.disconnect()
    media.removeEventListener('change', onChange)
  }
}
