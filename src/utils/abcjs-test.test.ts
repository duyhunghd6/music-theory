import { describe, it } from 'vitest'
import abcjs from 'abcjs'

describe('abcjs pitch test', () => {
  it('inspects pitched property', () => {
    const abc = 'X:1\nK:G\nF4'
    const visualObj = abcjs.renderAbc('*', abc, {
      clickListener: (abcelem) => {
        console.log('abcelem.pitches:', JSON.stringify(abcelem.pitches, null, 2))
      },
    })[0]

    // In node.js, renderAbc might not trigger click (no dom), but visualObj should contain lines
    const voice = visualObj.lines[0].staff[0].voices[0]
    const F_note = voice.find((el: any) => el.el_type === 'note' && el.pitches)
    console.log('F_note pitches:', JSON.stringify(F_note?.pitches, null, 2))
  })
})
