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
