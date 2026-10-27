// SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
import { mocks, render, normal } from './fixtures.ts'
import { describe, expect, it } from 'vitest'
import Maintenance from '../../ui/src/app/maintenance.vue'

describe('maintenance', () => {
  it('shows the effective build cache retention in cleanup confirmation', async () => {
  normal()
  const w = render(Maintenance)
  await w.get('button').trigger('click')
  expect(mocks.confirm).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('48h') }))
})
})
