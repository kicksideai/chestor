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
