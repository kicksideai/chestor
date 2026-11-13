// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { test } from 'node:test'
const require = createRequire(new URL('../ui/package.json', import.meta.url))
const { parse } = require('yaml')
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8')
const entry = (path, name) => parse(read(path)).entries.find(e => e.name === name)
test('image deletion holds no Docker authority and only the imports it uses', () => {
  assert.ok(!entry('src/api/images/_index.yaml', 'images_delete').security?.policies.includes('chestor.autocode.security:docker_commands'))
  assert.ok(!entry('src/service/_index.yaml', 'image_management').imports.docker_image)
  assert.ok(!entry('src/security/workers/_index.yaml', 'worker_calls').policy.resources.includes('kickside.core.retention:notify'))
})

test('observation hooks cannot reconstruct owners or dispatch tools', () => {
  const policies = entry('src/api/_index.yaml', 'run_hook').security.policies
  for (const name of ['deferred_runs', 'deferred_actor', 'gateway_dispatch', 'worker_calls'])
    assert.ok(!policies.includes('chestor.autocode.security:' + name), name)
})
test('member validators hold no general host command authority', () => {
  assert.deepEqual(entry('src/service/_index.yaml', 'verify_workspace').security.policies, ['chestor.autocode.security:workspace_probe'])
})

test('optional gateway tools do not impose new host bindings on ordinary installs', () => {
  const entries = parse(read('src/_index.yaml')).entries
  assert.ok(!entries.some(e => e.component === 'kickside/agents'))
})

test('closed workspace and image kinds grant mutation only on their own function entries', () => {
  const kinds = parse(read('src/components/_index.yaml')).entries
  for (const name of ['workspace', 'image']) {
    assert.equal(kinds.find(e => e.name === name).meta.mutation, 'closed')
    const policy = entry('src/security/management/_index.yaml', `${name}_mutation`)
    assert.equal(policy.policy.resources, `chestor.autocode.components:${name}`)
    assert.deepEqual(policy.policy.actions, ['component.kind.create', 'component.kind.update'])
    assert.ok(!policy.groups?.length)
  }
  const targets = [
    ['src/api/workspaces/_index.yaml', 'workspaces_create', 'workspace'],
    ...['images_create', 'images_update', 'images_prepare'].map(name => ['src/api/images/_index.yaml', name, 'image']),
    ['src/service/_index.yaml', 'image_ready', 'image'],
  ]
  for (const [path, name, kind] of targets)
    assert.ok(entry(path, name).security.policies.includes(`chestor.autocode.security:${kind}_mutation`), name)
  for (const name of ['module_access', 'module_management']) {
    const policy = entry(name === 'module_access' ? 'src/security/_index.yaml' : 'src/security/management/_index.yaml', name)
    assert.ok(!policy.meta.includes.some(id => id.endsWith('_mutation')), name)
  }
})
