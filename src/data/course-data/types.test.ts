import { describe, it, expect } from 'vitest'
import type { SectionType, Submodule } from './types'

describe('course-data section contract', () => {
  it('accepts flute as the canonical lesson section name', () => {
    const section: SectionType = 'flute'
    expect(section).toBe('flute')
  })

  it('allows submodules to declare flute in their section list', () => {
    const submodule = {
      id: '1.1',
      title: 'Lesson',
      description: 'Description',
      sections: ['theory', 'flute'],
    } satisfies Submodule

    expect(submodule.sections).toContain('flute')
  })
})
