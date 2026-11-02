import { describe, it, expect } from 'vitest'
import { describePackageStatus } from './packageStatus'
import { th } from '../../i18n/th'

describe('describePackageStatus', () => {
  it('turns a loading message into a Thai message with the package names', () => {
    expect(describePackageStatus('Loading numpy, pandas')).toBe(
      th.runner.prepare.packageLoading('numpy, pandas'),
    )
  })

  it('turns a loaded message into a Thai completion message', () => {
    expect(describePackageStatus('Loaded numpy')).toBe(th.runner.prepare.packageLoaded('numpy'))
  })

  it('falls back to the generic message for anything it does not recognise', () => {
    expect(describePackageStatus("Didn't find package foo")).toBe(
      th.runner.prepare.packageDefault,
    )
    expect(describePackageStatus(undefined)).toBe(th.runner.prepare.packageDefault)
  })
})
