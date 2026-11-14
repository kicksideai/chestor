// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { manifestProblems, viewProblems, trackedFiles } from './module-rules.mjs'

test('dependency versions belong to their entry regardless of YAML field order', () => {
  assert.deepEqual(manifestProblems('version: "1.0"\nentries:\n  - name: dep\n    kind: ns.dependency\n    component: acme/module\n    version: ">=1.2"\n'), [])
  assert.equal(manifestProblems('entries:\n  - name: first\n    version: "*"\n    kind: registry.entry\n  - name: dep\n    kind: ns.dependency\n    component: acme/module\n').length, 1)
})
test('each view declaration owns its announcement fields', () => {
  assert.equal(viewProblems('entries:\n- name: other\n  kind: registry.entry\n  announced: true\n  auto_register: true\n  tag_name: chestor-autocode\n- name: view\n  kind: view.component\n  meta: {tag_name: chestor-autocode}\n', 'chestor-autocode').length, 1)
})
test('Git execution and tracked-file failures fail verification', () => {
  const failure = Object.assign(new Error('Git failed'), { status: 1 })
  assert.throws(() => trackedFiles('.', (_command, args) => { if (args[0] === 'rev-parse') return '.'; throw failure }), failure)
  const missing = Object.assign(new Error('missing git'), { code: 'ENOENT' })
  assert.throws(() => trackedFiles('.', () => { throw missing }), missing)
})
test('a confirmed non-repository can omit tracked-file checks', () => {
  assert.deepEqual(trackedFiles('.', () => { throw Object.assign(new Error('non-repository'), { status: 128, stderr: 'fatal: not a git repository (or any of the parent directories): .git\n' }) }), [])
})

test('dependency versions accept only star or minimum-version ranges', () => {
  for (const version of ['^1.2', '~1.2', '<1.2', '<=1.2', '>1.2', '1.2.3']) {
    assert.equal(manifestProblems(`entries:\n- name: dep\n  kind: ns.dependency\n  component: acme/module\n  version: "${version}"\n`).length, 1, version)
  }
})
