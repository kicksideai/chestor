// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
const require = createRequire(new URL('../ui/package.json', import.meta.url))
const { parse } = require('yaml')

export function manifestProblems(source) {
  const entries = parse(source)?.entries ?? []
  return entries.filter(entry => entry.kind === 'ns.dependency')
    .filter(entry => typeof entry.version !== 'string' || !(entry.version === '*' || /^(>=|<=|>|<|\^|~)/.test(entry.version)))
    .map(entry => `${entry.name}: ns.dependency must declare a compatibility range, never an exact version`)
}
export function viewProblems(source, tag) {
  const entries = parse(source)?.entries ?? []
  return entries.filter(entry => entry.kind === 'view.component' || entry.meta?.type === 'view.component')
    .filter(entry => entry.meta?.announced !== true || typeof entry.meta?.auto_register !== 'boolean'
      || (entry.meta?.tag_name === tag && entry.meta?.auto_register !== true)
      || typeof entry.meta?.tag_name !== 'string' || !(entry.meta.tag_name === tag || entry.meta.tag_name.startsWith(tag + '-')))
    .map(entry => `${entry.name}: view.component must declare its announcement, registration and module tag`)
}
export function trackedFiles(root, run = execFileSync) {
  const options = { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, LC_ALL: 'C' } }
  try { run('git', ['rev-parse', '--git-dir'], options) }
  catch (error) {
    if (error.status === 128 && /^fatal: not a git repository\b/.test(String(error.stderr))) return []
    throw error
  }
  return run('git', ['ls-files', '--', '.'], options).trim().split('\n').filter(Boolean)
}
