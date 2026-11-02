import { describe, it, expect } from 'vitest'
import { createOutputLimiter } from './outputLimiter'

describe('createOutputLimiter', () => {
  it('passes text through while under the line limit', () => {
    const limiter = createOutputLimiter({ maxLines: 2, maxBytes: 1000 })

    expect(limiter.accept('a')).toBe('a')
    expect(limiter.accept('b')).toBe('b')
    expect(limiter.truncated).toBe(false)
  })

  it('drops text and marks truncated once the line limit is exceeded', () => {
    const limiter = createOutputLimiter({ maxLines: 2, maxBytes: 1000 })

    limiter.accept('a')
    limiter.accept('b')

    expect(limiter.accept('c')).toBeNull()
    expect(limiter.truncated).toBe(true)
  })

  it('counts bytes in UTF-8, so Thai text hits the byte limit sooner', () => {
    // "สวัสดี" มี 6 ตัวอักษรแต่ใช้ 18 ไบต์ใน UTF-8
    const limiter = createOutputLimiter({ maxLines: 100, maxBytes: 10 })

    expect(limiter.accept('สวัสดี')).toBeNull()
    expect(limiter.truncated).toBe(true)
  })

  it('stays truncated after the first overflow, even for short text', () => {
    const limiter = createOutputLimiter({ maxLines: 1, maxBytes: 1000 })

    limiter.accept('a')
    limiter.accept('b')

    expect(limiter.accept('c')).toBeNull()
  })
})
