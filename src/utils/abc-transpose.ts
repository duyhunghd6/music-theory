const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLAT_TO_SHARP: Record<string, string> = {
  Cb: 'B',
  Db: 'C#',
  Eb: 'D#',
  Fb: 'E',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
  'E#': 'F',
  'B#': 'C',
}

const MAJOR_KEYS = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
] as const

const MINOR_KEYS = [
  'Cm',
  'C#m',
  'Dm',
  'D#m',
  'Em',
  'Fm',
  'F#m',
  'Gm',
  'G#m',
  'Am',
  'A#m',
  'Bm',
] as const

const NOTE_TO_SEMITONE: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
}

const normalizeToSharp = (note: string): string => FLAT_TO_SHARP[note] || note

const modulo = (value: number, mod: number): number => ((value % mod) + mod) % mod

const semitoneToSharpNote = (semitone: number): string => SHARP_NOTES[modulo(semitone, 12)]

const scientificToMidi = (note: string): number | null => {
  const match = note.match(/^([A-G])([#b]?)(-?\d+)$/)
  if (!match) return null

  const [, letter, accidental, octaveText] = match
  const octave = parseInt(octaveText, 10)
  const base = NOTE_TO_SEMITONE[letter]
  let semitone = base

  if (accidental === '#') semitone += 1
  if (accidental === 'b') semitone -= 1

  return (octave + 1) * 12 + semitone
}

const midiToScientific = (midi: number): string => {
  const normalizedMidi = Math.max(0, Math.min(127, midi))
  const octave = Math.floor(normalizedMidi / 12) - 1
  const note = semitoneToSharpNote(normalizedMidi % 12)
  return `${note}${octave}`
}

const scientificToAbc = (note: string): string => {
  const match = note.match(/^([A-G])([#b]?)(-?\d+)$/)
  if (!match) return note

  const [, letter, accidental, octaveText] = match
  const octave = parseInt(octaveText, 10)

  const abcAccidental = accidental === '#' ? '^' : accidental === 'b' ? '_' : ''

  if (octave <= 4) {
    const commas = ','.repeat(4 - octave)
    return `${abcAccidental}${letter}${commas}`
  }

  if (octave === 5) {
    return `${abcAccidental}${letter.toLowerCase()}`
  }

  const apostrophes = "'".repeat(octave - 5)
  return `${abcAccidental}${letter.toLowerCase()}${apostrophes}`
}

const abcTokenToScientific = (token: string): string | null => {
  const match = token.match(/^([\^_=]*)([A-Ga-g])([,']*)$/)
  if (!match) return null

  const [, accidentalToken, letterToken, octaveMarks] = match
  const letter = letterToken.toUpperCase()
  let octave = letterToken === letterToken.toLowerCase() ? 5 : 4

  for (const marker of octaveMarks) {
    if (marker === ',') octave -= 1
    if (marker === "'") octave += 1
  }

  let accidentalOffset = 0
  for (const marker of accidentalToken) {
    if (marker === '^') accidentalOffset += 1
    if (marker === '_') accidentalOffset -= 1
  }

  const baseSemitone = NOTE_TO_SEMITONE[letter] + accidentalOffset
  const midi = (octave + 1) * 12 + baseSemitone
  return midiToScientific(midi)
}

const transposeKey = (key: string, semitones: number): string | null => {
  const normalized = key.trim()
  const majorIndex = MAJOR_KEYS.indexOf(normalized as (typeof MAJOR_KEYS)[number])
  if (majorIndex !== -1) {
    return MAJOR_KEYS[modulo(majorIndex + semitones, 12)]
  }

  const minorIndex = MINOR_KEYS.indexOf(normalized as (typeof MINOR_KEYS)[number])
  if (minorIndex !== -1) {
    return MINOR_KEYS[modulo(minorIndex + semitones, 12)]
  }

  const tonicMatch = normalized.match(/^([A-G][#b]?)(.*)$/)
  if (!tonicMatch) return null

  const [, tonic, suffix] = tonicMatch
  const tonicSemitone = SHARP_NOTES.indexOf(normalizeToSharp(tonic))
  if (tonicSemitone === -1) return null

  return `${semitoneToSharpNote(tonicSemitone + semitones)}${suffix}`
}

export const transposeNoteName = (note: string, semitones: number): string => {
  if (semitones === 0) return note

  const midi = scientificToMidi(note)
  if (midi === null) return note

  return midiToScientific(midi + semitones)
}

export const transposeAbc = (abc: string, semitones: number): string => {
  if (semitones === 0) return abc

  return abc
    .split('\n')
    .map((line) => {
      if (line.startsWith('w:')) return line
      if (/^[A-Z]:/.test(line) || /^%%/.test(line) || /^\[V:/.test(line)) {
        if (!line.startsWith('K:')) return line

        return line.replace(/^K:\s*([^\s]+)(.*)$/, (_, key, rest) => {
          const transposedKey = transposeKey(key, semitones)
          return transposedKey ? `K:${transposedKey}${rest}` : line
        })
      }

      return line.replace(/("[^"]*")|([\^_=]*[A-Ga-g][,']*)/g, (match, quoted, noteToken) => {
        if (quoted) return quoted
        if (!noteToken) return match

        const scientific = abcTokenToScientific(noteToken)
        if (!scientific) return match

        return scientificToAbc(transposeNoteName(scientific, semitones))
      })
    })
    .join('\n')
}
