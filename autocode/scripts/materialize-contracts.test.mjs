// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
const require = createRequire(new URL('../ui/package.json', import.meta.url))
const Ajv = require('ajv')
const catalog = JSON.parse(readFileSync(new URL('../src/contracts/list_agents.output.schema.json', import.meta.url)))
test('catalog driver option scopes accept profile IDs', () => {
  const validate = new Ajv({ strict: false }).compile(catalog.properties.agents.items.properties.options.items)
  assert.equal(validate({ name: 'permission', label: 'Permission', description: '', section: '', group: '', order: 1, type: 'string', profiles: ['batch'] }), true, JSON.stringify(validate.errors))
})

const root = new URL('../', import.meta.url)
const { parse } = require('yaml')
const block = parse(readFileSync(new URL('src/blocks/_index.yaml', root), 'utf8')).entries.find(e => e.name === 'block.task').data.block
for (const [name, schema, value] of [
  ['task', JSON.parse(readFileSync(new URL('src/contracts/submit_task.input.schema.json', root))), {agent: 'claude', image_id: 'image', prompt: 'task'}],
  ['profile', JSON.parse(readFileSync(new URL('src/contracts/add_profile.input.schema.json', root))), {title: 'Profile', agent: 'claude', image_id: 'image'}],
  ['profile update', JSON.parse(readFileSync(new URL('src/contracts/update_profile.input.schema.json', root))), {id: 'profile'}],
  ['Block', block.config, {agent: 'claude', image_id: 'image', prompt: 'task'}],
]) test(`${name} supplies tools only through traits`, () => {
  const validate = new Ajv({ strict: false }).compile(schema)
  assert.equal(validate({...value, tools: {traits: ['app:gateway_trait'], context: {board_id: 'board'}}}), true, JSON.stringify(validate.errors))
  assert.equal(validate({...value, tools: {tools: ['app:gateway_echo']}}), false)
})
