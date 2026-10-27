// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, driver, respond, normal, option, requestContractErrors } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import { autocode } from '../../ui/src/app/api.ts'

describe('api', () => {
  it('preserves committed account updates and exposes cooldown partial failure without retrying', async () => {
    const health_error = { message: 'Health unavailable', kind: 'Unavailable', retryable: true, details: { code: 'health_down' } }
    mocks.put.mockResolvedValue({ data: { success: true, id: 'a', health_error } })
    expect(await autocode.updateAccount('a', { enabled: true })).toMatchObject({ id: 'a', health_error })
  })
  it('accepts omitted optional run fields', async () => {
    normal()
    expect(await autocode.run('r', 0)).toMatchObject({ run: { id: 'r' } })
  })
  it('retains complete driver metadata in the catalog', async () => {
    mocks.get.mockResolvedValue({ data: { success: true, ...respond('/catalog'), agents: [{ ...driver, options: [option], unattended: { permissions: true }, capabilities: ['network'] }] } })
    expect((await autocode.catalog()).agents[0]).toMatchObject({ options: [option], unattended: { permissions: true }, capabilities: ['network'] })
  })
  it('reads the canonical run_id from submission', async () => {
    mocks.post.mockResolvedValue({ data: { success: true, run_id: 'started' } })
    expect(await autocode.startRun({ agent: 'agent', account_id: 'account', image_id: 'image', workspace_id: '', repo_url: '', prompt: 'task', options: {}, unattended: false })).toEqual({ run_id: 'started' })
  })
  it('rejects malformed endpoint DTOs before a consumer receives them', async () => {
    mocks.get.mockResolvedValue({ data: { success: true, accounts: [{ id: 'bad' }] } })
    await expect(autocode.accounts()).rejects.toThrow(/account|response/i)
  })
  it('retains structured HTTP error metadata', async () => {
    mocks.get.mockRejectedValue({ response: { data: { success: false, error: 'Busy', kind: 'UNAVAILABLE', code: 'BUSY', retryable: true, details: { code: 'BUSY' } } } })
    await expect(autocode.accounts()).rejects.toMatchObject({ message: 'Busy', kind: 'UNAVAILABLE', code: 'BUSY', retryable: true, details: { code: 'BUSY' } })
  })
})

// Each adapter's service input includes the HTTP path and query values.
describe('shared HTTP contract guard', () => {
  it.each([
    ['post', '/runs', undefined],
    ['post', '/runs', { agent: 'agent', image_id: 'i', prompt: 'Task', extra: true }],
    ['post', '/accounts', { agent: 'agent', credential_kind: 'key', label: 'Account' }],
    ['put', '/accounts/a', { agent: 'agent' }],
    ['delete', '/accounts/' + 'a'.repeat(65), undefined],
    ['get', '/runs/r?after_seq=0&before_seq=1', undefined],
    ['get', '/runs?limit=101', undefined],
    ['post', '/runs/' + 'r'.repeat(65) + '/cancel', undefined],
  ])('rejects invalid %s %s inputs even with mocked HTTP', (method, path, body) => {
    expect(requestContractErrors(method as string, '/api/v1/autocode' + path, body)).not.toEqual([])
  })
  it.each(['/accounts', '/images', '/workspaces', '/runs?cursor=next', '/runs/r?before_seq=0'])('validates translated GET %s inputs', path => {
    expect(requestContractErrors('get', '/api/v1/autocode' + path)).toEqual([])
  })
  it('validates the serialized body and decoded path IDs', () => {
    expect(requestContractErrors('put', '/api/v1/autocode/accounts/a%20b', { label: 'Renamed', secret: undefined })).toEqual([])
  })
})
