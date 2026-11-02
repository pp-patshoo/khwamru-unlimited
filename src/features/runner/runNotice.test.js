import { describe, it, expect } from 'vitest'
import { getRunNotice } from './runNotice'
import { th } from '../../i18n/th'

describe('getRunNotice', () => {
  it('returns null for a normal run', () => {
    expect(getRunNotice({ ok: true, stopped: null, outputTruncated: false })).toBeNull()
  })

  it('explains an automatic timeout stop', () => {
    expect(getRunNotice({ ok: false, stopped: 'timeout' })).toBe(th.playground.timeoutStopped)
  })

  it('explains a stop requested by the learner', () => {
    expect(getRunNotice({ ok: false, stopped: 'user' })).toBe(th.playground.userStopped)
  })

  it('explains that output was cut', () => {
    expect(getRunNotice({ ok: true, stopped: null, outputTruncated: true })).toBe(
      th.playground.outputTruncated,
    )
  })
})
