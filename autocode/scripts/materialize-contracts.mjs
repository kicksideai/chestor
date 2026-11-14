// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { createRequire } from 'node:module'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const require = createRequire(new URL('../ui/package.json', import.meta.url))
const { build } = require('esbuild')
const { zodToJsonSchema } = require('zod-to-json-schema')
const { parseDocument } = require('yaml')
const root = fileURLToPath(new URL('../', import.meta.url))
const compiled = await build({ entryPoints: [root + 'ui/src/app/wire.ts'], bundle: true, write: false, platform: 'node', format: 'esm' })
const wire = await import('data:text/javascript;base64,' + Buffer.from(compiled.outputFiles[0].text).toString('base64'))
const fragments = Object.fromEntries(['endpoint', 'accountEndpoint', 'profile', 'profileInput', 'profilePatch', 'credentialKind', 'usage', 'toolSurfaceSchema', 'profileListing', 'nativeError'].map(name => {
  const { $schema, ...schema } = zodToJsonSchema(wire[name], { $refStrategy: 'none' })
  return [name, schema]
}))
// The contract keeps arrays unique; Zod retains their ordered values.
fragments.toolSurfaceSchema.properties.traits.uniqueItems = true
fragments.toolSurfaceSchema.properties.tools.uniqueItems = true
for (const name of ['profile', 'profileInput', 'profilePatch']) fragments[name].properties.account_pool.uniqueItems = true
let stale = false
async function materialize(path, text) {
  const before = await readFile(path, 'utf8')
  if (text === before) return
  if (process.argv.includes('--check')) { console.error(`Stale contract: ${path}`); stale = true }
  else await writeFile(path, text)
}
const locations = {
  'add_account.input.schema.json': [['properties.endpoint', 'accountEndpoint']],
  'update_account.input.schema.json': [['properties.endpoint', 'accountEndpoint']],
  'list_accounts.output.schema.json': [['properties.accounts.items.properties.endpoint', 'accountEndpoint']],
  'submit_task.input.schema.json': [['properties.endpoint', 'endpoint'], ['properties.tools', 'toolSurfaceSchema']],
  'get_run.output.schema.json': [['properties.run.properties.endpoint', 'endpoint'], ['properties.run.properties.usage', 'usage'], ['properties.run.properties.error_native', 'nativeError']],
  'list_runs.output.schema.json': [['properties.runs.items.properties.usage', 'usage']],
  'list_profiles.output.schema.json': [['properties.profiles.items', 'profileListing']],
  'submit_task.output.schema.json': [['properties.notification_error', 'nativeError']],
  'get_profile.output.schema.json': [['properties.profile', 'profile']],
  'list_agents.output.schema.json': [['properties.agents.items.properties.credentials.items', 'credentialKind']],
}
function replace(schema, path, value) {
  const keys = path.split('.')
  const key = keys.pop()
  const parent = keys.reduce((node, part) => node[part], schema)
  if (!(key in parent)) throw new Error(`Missing schema location: ${path}`)
  parent[key] = value
}
for (const file of await readdir(root + 'src/contracts')) {
  if (!file.endsWith('.schema.json')) continue
  const path = root + 'src/contracts/' + file
  let schema = JSON.parse(await readFile(path, 'utf8'))
  if (file === 'add_profile.input.schema.json') schema = fragments.profileInput
  if (file === 'update_profile.input.schema.json') schema = fragments.profilePatch
  for (const [path, fragment] of locations[file] ?? []) replace(schema, path, fragments[fragment])
  if (file === 'list_agents.output.schema.json')
    replace(schema, 'properties.agents.items.properties.options.items.properties.profiles.items', { type: 'string' })
  await materialize(path, JSON.stringify(schema, null, 2) + '\n')
}
const path = root + 'src/blocks/_index.yaml'
const doc = parseDocument(await readFile(path, 'utf8'))
const entries = doc.get('entries', true)
for (const entry of entries.items) {
  if (entry.get('name') !== 'block.task') continue
  for (const [name, fragment] of [['endpoint', 'endpoint'], ['tools', 'toolSurfaceSchema']])
    entry.setIn(['data', 'block', 'config', 'properties', name], doc.createNode(fragments[fragment]))
  entry.setIn(['data', 'block', 'output', 'properties', 'usage'], doc.createNode(fragments.usage))
  entry.setIn(['data', 'block', 'output', 'properties', 'error_native'], doc.createNode(fragments.nativeError))
}
await materialize(path, String(doc))
if (stale) process.exitCode = 1
