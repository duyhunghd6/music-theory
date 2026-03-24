// Type declarations for abcjs
// See: https://github.com/paulrosen/abcjs

declare module 'abcjs' {
  export interface AbcPitch {
    pitch: number
    name: string
  }

  export interface CursorMidiPitch {
    pitch: number
    durationInMeasures: number
    volume: number
    instrument: number
  }

  export interface AudioSessionLike {
    type: string
  }

  export interface AbcJsNavigator extends Navigator {
    audioSession?: AudioSessionLike
  }

  export interface AudioContextWindow extends Window {
    webkitAudioContext?: typeof AudioContext
  }

  export interface SynthModule {
    CreateSynth: typeof CreateSynth
    SynthController: typeof SynthController
    activeAudioContext?: () => AudioContext
  }

  export interface RenderOptions {
    responsive?: 'resize' | string
    add_classes?: boolean
    staffwidth?: number
    scale?: number
    paddingtop?: number
    paddingbottom?: number
    paddingleft?: number
    paddingright?: number
    wrap?: {
      minSpacing?: number
      maxSpacing?: number
      preferredMeasuresPerLine?: number
    }
    clickListener?: (
      abcelem: AbcElem,
      tuneNumber: number,
      classes: string,
      analysis: Analysis,
      drag: Drag
    ) => void
  }

  export interface AbcElem {
    el_type: string
    startChar: number
    endChar: number
    pitches?: AbcPitch[]
  }

  export interface Analysis {
    // Analysis data
  }

  export interface Drag {
    // Drag data
  }

  export interface TuneObject {
    lines: unknown[]
    metaText: Record<string, string>
    getBarLength: () => number
    millisecondsPerMeasure: () => number
    setUpAudio: (options?: AudioOptions) => AudioBuffer
  }

  export interface AudioOptions {
    chordsOff?: boolean
    voicesOff?: boolean
    sequenceCallback?: (noteMapTrack: NoteMapTrack, pitchNumber: number) => void
    callbackContext?: unknown
    onEnded?: () => void
  }

  export interface AudioBuffer {
    tracks: unknown[]
    totalDuration: number
  }

  export interface NoteMapTrack {
    // Track data
  }

  export function renderAbc(
    elementOrSelector: string | HTMLElement,
    abcString: string,
    options?: RenderOptions
  ): TuneObject[]

  export interface NoteTimingEvent {
    measureStart?: boolean
    left?: number | null
    top?: number | null
    height?: number | null
    elements?: HTMLElement[][]
    midiPitches?: CursorMidiPitch[]
  }

  export namespace synth {
    export class CreateSynth {
      init(options: { visualObj: TuneObject; audioContext?: AudioContext }): Promise<void>
      prime(): Promise<void>
      start(): void
      pause(): void
      resume(): void
      stop(): void
      seek(percent: number, units?: 'percent' | 'seconds'): void
    }

    export class SynthController {
      load(
        selector: string,
        cursorControl: CursorControl | null,
        options?: SynthControllerOptions
      ): void
      setTune(visualObj: TuneObject, userAction: boolean, options?: AudioOptions): Promise<void>
      play(): void
      pause(): void
      restart(): void
      setWarp(percent: number): void
    }

    export interface SynthControllerOptions {
      displayLoop?: boolean
      displayRestart?: boolean
      displayPlay?: boolean
      displayProgress?: boolean
      displayWarp?: boolean
    }

    export interface CursorControl {
      onStart?: () => void
      onEvent?: (event: NoteTimingEvent) => void
      onFinished?: () => void
    }

    export function getMidiFile(
      abcString: string,
      options?: { midiOutputType?: 'binary' | 'encoded' | 'link' }
    ): unknown
  }
}

declare module 'abcjs/abcjs-audio.css'

// ABC notation file imports (using Vite's ?raw query)
declare module '*.abc?raw' {
  const content: string
  export default content
}
