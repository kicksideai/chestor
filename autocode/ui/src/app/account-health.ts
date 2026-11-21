// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import type { Account } from './dto.ts'
import { accountState } from './presentation.ts'

const resetTime = new Intl.DateTimeFormat(undefined, { weekday: 'short', hour: 'numeric', minute: '2-digit' })

const windowLabels: Record<string, string> = {
  five_hour: '5-hour limit', seven_day: 'Weekly limit',
  seven_day_sonnet: 'Weekly Sonnet limit', seven_day_opus: 'Weekly Opus limit',
}

export const usageLabel = (value: string) => windowLabels[value] ?? 'Usage limit'
export const resetLabel = (value: number) => resetTime.format(value)

export function accountHealth(account: Account, now: number) {
  const state = accountState(account, now)
  if (state === 'disabled') return { state, label: 'Disabled', help: 'Enable this account to run tasks with it.' }
  if (state === 'unavailable') {
    return { state, label: 'Needs attention', help: 'Check that the provider is installed and that you have access to this account.' }
  }
  const blocked = account.rate_limits?.windows.find(window => window.status === 'rejected' && window.resets_at && window.resets_at * 1000 > now)
  if (blocked?.resets_at) return { state: 'cooling', label: `${usageLabel(blocked.window)} reached, resets ${resetLabel(blocked.resets_at * 1000)}`, help: 'Use another account or wait for the reset.' }
  if (state === 'cooling') {
    const time = Date.parse(account.cooldown_until)
    return { state, label: `Limited until ${resetLabel(time)}`, help: 'Use another account or wait for the reset.' }
  }
  const code = account.last_error.match(/^([a-z][a-z0-9_]+)(?=:|$)/)?.[1]
  if (code === 'rate_limit') return { state, label: 'Ready', help: 'The last task hit a rate limit. Try again or use another account.', code }
  if (account.last_error) return { state: 'failed', label: 'Needs attention', help: 'The last task reported an account error. Check the credential and reconnect if needed.', code }
  return { state, label: 'Ready', help: '' }
}

const products: Record<string, { name: string; hint: string }> = {
  codex: { name: 'Codex', hint: 'ChatGPT sign-in or an OpenAI API key' },
  claude: { name: 'Claude Code', hint: 'Claude subscription token' },
  agy: { name: 'Antigravity', hint: 'Google Antigravity login or Gemini API key' },
  grok: { name: 'Grok', hint: 'xAI API key' },
  muse: { name: 'Muse', hint: 'Meta API key or Muse login file' },
  opencode: { name: 'OpenCode', hint: 'API key or an OpenCode login file' },
  pi: { name: 'Pi', hint: 'API key or a Pi login file' },
}

export function providerProduct(agent: string, title: string) {
  return products[agent] ?? { name: title, hint: 'Provider credential' }
}
