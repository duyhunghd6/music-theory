import { useEffect, useRef, useState, useCallback } from 'react'
import abcjs from 'abcjs'
import type { AbcJsNavigator, AudioContextWindow } from 'abcjs'
import 'abcjs/abcjs-audio.css'

/**
 * iPhone Music Staff Player Test Page
 * URL: /test-iphone-player
 *
 * This page tests iOS Safari compatibility for music staff playback:
 * 1. User gesture requirement for AudioContext.resume()
 * 2. Device mute switch handling (iOS 17+ navigator.audioSession)
 * 3. ABCJS synth initialization flow
 * 4. Visual feedback for audio state
 */

// Simple test ABC notation
const TEST_ABC = `%abc-2.1
X:1
T:iPhone Audio Test
C:Test Tune
M:4/4
L:1/4
Q:1/4=120
K:C
C D E F | G A B c | d e f g | a b c' d' |
c' B A G | F E D C | E G c e | d B G C |]`

// C Major Scale for basic testing
const C_MAJOR_SCALE = `X:1
T:C Major Scale
M:4/4
L:1/4
Q:1/4=100
K:C
C D E F | G A B c |]`

// Chord progression for richer audio test
const CHORD_PROGRESSION = `X:1
T:Chord Progression Test
M:4/4
L:1/4
Q:1/4=80
K:C
[CEG] [CEG] [DFA] [DFA] | [EGB] [EGB] [FAc] [FAc] | [GBd] [GBd] [Ace] [Ace] | [Bdf] [Bdf] [ceg] [ceg] |]`

type AudioState =
  | 'not-initialized'
  | 'suspended'
  | 'running'
  | 'closed'
  | 'interrupted'
  | 'error'

const getActiveAudioContext = (): AudioContext | undefined => {
  const activeAudioContext = abcjs.synth.activeAudioContext
  return typeof activeAudioContext === 'function' ? activeAudioContext() : undefined
}

export default function IPhonePlayerTestPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const audioContainerRef = useRef<HTMLDivElement>(null)
  const synthRef = useRef<InstanceType<typeof abcjs.synth.CreateSynth> | null>(null)
  const synthControlRef = useRef<InstanceType<typeof abcjs.synth.SynthController> | null>(null)
  const visualObjRef = useRef<abcjs.TuneObject | null>(null)

  const [audioState, setAudioState] = useState<AudioState>('not-initialized')
  const [selectedAbc, setSelectedAbc] = useState<string>(TEST_ABC)
  const [isControllerReady, setControllerReady] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isSafari: false,
    iosMajorVersion: 0,
    userAgent: '',
  })
  const [audioSessionSupported, setAudioSessionSupported] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  // Logging helper
  const log = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const entry = `[${timestamp}] ${message}`
    console.log(entry)
    setLogs((prev) => [...prev.slice(-50), entry])
  }, [])

  // Detect device info on mount
  useEffect(() => {
    const ua = navigator.userAgent
    const isIOS = /iPhone|iPad|iPod/.test(ua)
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua)

    // Extract iOS version
    let iosMajorVersion = 0
    const versionMatch = ua.match(/OS (\d+)_/)
    if (versionMatch) {
      iosMajorVersion = parseInt(versionMatch[1], 10)
    }

    setDeviceInfo({
      isIOS,
      isSafari,
      iosMajorVersion,
      userAgent: ua,
    })

    log(`Device: iOS=${isIOS}, Safari=${isSafari}, iOS Version=${iosMajorVersion}`)

    // Check audioSession API support (iOS 17+)
    const audioSessionAPI = (navigator as AbcJsNavigator).audioSession
    if (audioSessionAPI) {
      setAudioSessionSupported(true)
      log('✅ navigator.audioSession API is supported')

      // Set audio session to "playback" to ignore mute switch
      try {
        audioSessionAPI.type = 'playback'
        log('✅ Set audioSession.type = "playback" (ignores mute switch)')
      } catch (err) {
        log(`❌ Failed to set audioSession.type: ${err}`)
      }
    } else {
      log('⚠️ navigator.audioSession API not available (iOS < 17 or non-Safari)')
    }
  }, [log])

  // Initialize synth objects
  useEffect(() => {
    log('Initializing ABCJS synth objects...')
    synthRef.current = new abcjs.synth.CreateSynth()
    synthControlRef.current = new abcjs.synth.SynthController()

    return () => {
      synthRef.current = null
      synthControlRef.current = null
    }
  }, [log])

  // Load controller UI
  useEffect(() => {
    if (!audioContainerRef.current || !synthControlRef.current) return

    const timer = setTimeout(() => {
      if (!synthControlRef.current) return

      log('Loading synth controller UI...')
      synthControlRef.current.load('#audio-container', null, {
        displayLoop: true,
        displayRestart: true,
        displayPlay: true,
        displayProgress: true,
        displayWarp: true,
      })
      setControllerReady(true)
      log('✅ Controller UI loaded')
    }, 100)

    return () => clearTimeout(timer)
  }, [log])

  // Render ABC notation
  useEffect(() => {
    if (!containerRef.current) return

    log('Rendering ABC notation...')
    try {
      const rendered = abcjs.renderAbc('abc-paper', selectedAbc, {
        responsive: 'resize',
        add_classes: true,
        staffwidth: 800,
        paddingtop: 10,
        paddingbottom: 10,
      })

      if (rendered[0]) {
        visualObjRef.current = rendered[0]
        log('✅ ABC rendered successfully')
      }
    } catch (error) {
      log(`❌ Render error: ${error}`)
    }
  }, [selectedAbc, log])

  // Setup audio after controller is ready
  useEffect(() => {
    if (!isControllerReady || !visualObjRef.current) return
    if (!synthRef.current || !synthControlRef.current) return

    const setupAudio = async () => {
      log('Setting up audio...')
      try {
        await synthRef.current!.init({ visualObj: visualObjRef.current! })
        await synthControlRef.current!.setTune(visualObjRef.current!, false, {})
        log('✅ Audio setup complete')

        // Check AudioContext state
        const ctx = getActiveAudioContext()
        if (ctx) {
          setAudioState(ctx.state as AudioState)
          log(`AudioContext state: ${ctx.state}`)
        }
      } catch (err) {
        log(`❌ Audio setup error: ${err}`)
        setAudioState('error')
      }
    }

    setupAudio()
  }, [isControllerReady, selectedAbc, log])

  // User gesture handler to unlock audio
  const handleUnlockAudio = useCallback(async () => {
    log('🔓 User gesture: attempting to unlock audio...')

    try {
      // Get the active AudioContext from abcjs
      let ctx = getActiveAudioContext()

      // If no context exists, create one via abcjs
      if (!ctx && synthRef.current && visualObjRef.current) {
        log('No active AudioContext, initializing synth...')
        await synthRef.current.init({ visualObj: visualObjRef.current })
        ctx = getActiveAudioContext()
      }

      if (!ctx) {
        // Fallback: create raw AudioContext
        log('Creating fallback AudioContext...')
        const AudioContextClass = window.AudioContext || (window as AudioContextWindow).webkitAudioContext
        ctx = new AudioContextClass()
      }

      if (ctx && ctx.state === 'suspended') {
        log('Resuming suspended AudioContext...')
        await ctx.resume()
        log(`✅ AudioContext resumed, new state: ${ctx.state}`)
      }

      setAudioState(ctx?.state || 'running')
    } catch (err) {
      log(`❌ Failed to unlock audio: ${err}`)
      setAudioState('error')
    }
  }, [log])

  // Check current AudioContext state
  const checkAudioState = useCallback(() => {
    const ctx = getActiveAudioContext()
    if (ctx) {
      setAudioState(ctx.state as AudioState)
      log(`Current AudioContext state: ${ctx.state}`)
    } else {
      setAudioState('not-initialized')
      log('AudioContext not yet created')
    }
  }, [log])

  const getStateColor = (state: AudioState) => {
    switch (state) {
      case 'running':
        return 'bg-green-500'
      case 'suspended':
        return 'bg-yellow-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStateEmoji = (state: AudioState) => {
    switch (state) {
      case 'running':
        return '🔊'
      case 'suspended':
        return '🔇'
      case 'error':
        return '❌'
      default:
        return '⏳'
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
          📱 iPhone Music Staff Player Test
        </h1>

        {/* Device Info Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Device Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div className="bg-slate-100 dark:bg-slate-700 rounded p-2">
              <span className="text-slate-500 dark:text-slate-400">iOS:</span>{' '}
              <span
                className={`font-medium ${deviceInfo.isIOS ? 'text-green-600' : 'text-slate-600'}`}
              >
                {deviceInfo.isIOS ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 rounded p-2">
              <span className="text-slate-500 dark:text-slate-400">Safari:</span>{' '}
              <span
                className={`font-medium ${deviceInfo.isSafari ? 'text-green-600' : 'text-slate-600'}`}
              >
                {deviceInfo.isSafari ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 rounded p-2">
              <span className="text-slate-500 dark:text-slate-400">iOS Ver:</span>{' '}
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {deviceInfo.iosMajorVersion || 'N/A'}
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 rounded p-2">
              <span className="text-slate-500 dark:text-slate-400">audioSession:</span>{' '}
              <span
                className={`font-medium ${audioSessionSupported ? 'text-green-600' : 'text-orange-500'}`}
              >
                {audioSessionSupported ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Audio State Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Audio State:
              </h2>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getStateColor(audioState)}`} />
                <span className="text-lg">{getStateEmoji(audioState)}</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">{audioState}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={checkAudioState}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Check State
              </button>
              <button
                onClick={handleUnlockAudio}
                className="px-4 py-1.5 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors shadow-sm"
              >
                🔓 Unlock Audio
              </button>
            </div>
          </div>

          {audioState === 'suspended' && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-300 text-sm">
              <strong>⚠️ Audio is suspended.</strong> Tap the "Unlock Audio" button above to enable
              playback. On iOS, audio requires a user gesture to start.
            </div>
          )}

          {deviceInfo.isIOS && !audioSessionSupported && (
            <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg text-orange-700 dark:text-orange-300 text-sm">
              <strong>📵 Mute Switch Warning:</strong> Your device mute switch must be OFF for
              audio to play. iOS 17+ supports ignoring the mute switch via audioSession API.
            </div>
          )}
        </div>

        {/* ABC Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Select Test Piece
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedAbc(TEST_ABC)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedAbc === TEST_ABC
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Test Tune
            </button>
            <button
              onClick={() => setSelectedAbc(C_MAJOR_SCALE)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedAbc === C_MAJOR_SCALE
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              C Major Scale
            </button>
            <button
              onClick={() => setSelectedAbc(CHORD_PROGRESSION)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedAbc === CHORD_PROGRESSION
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Chord Progression
            </button>
          </div>
        </div>

        {/* Music Staff Display */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
            🎼 Music Staff
          </h2>
          <div
            id="abc-paper"
            ref={containerRef}
            className="bg-white dark:bg-slate-700 rounded-lg overflow-x-auto"
          />
        </div>

        {/* Audio Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
            🎛️ Playback Controls
          </h2>
          <div id="audio-container" ref={audioContainerRef} className="abcjs-audio" />
        </div>

        {/* Console Logs */}
        <div className="bg-slate-900 rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-green-400 mb-2">📋 Console Logs</h2>
          <div className="h-48 overflow-y-auto font-mono text-xs text-green-300 space-y-0.5">
            {logs.map((log, i) => (
              <div key={i} className="hover:bg-slate-800 px-2 py-0.5 rounded">
                {log}
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-slate-500 italic">Logs will appear here...</div>
            )}
          </div>
        </div>

        {/* iOS Audio Tips */}
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-300">
          <h3 className="font-semibold mb-2">📖 iOS Safari Audio Tips</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Audio requires a user gesture (tap) to start - tap "Unlock Audio" first</li>
            <li>The device mute switch affects Web Audio API playback</li>
            <li>iOS 17+ can ignore mute switch via navigator.audioSession.type = "playback"</li>
            <li>After unlocking, playback controls should work normally</li>
            <li>If playback stops working, tap "Unlock Audio" again</li>
          </ul>
        </div>

        {/* Styling for ABCJS */}
        <style>{`
          #abc-paper svg {
            width: 100%;
            max-width: 100%;
          }
          .dark #abc-paper svg path,
          .dark #abc-paper svg line,
          .dark #abc-paper svg text {
            fill: #cbd5e1 !important;
            stroke: #cbd5e1 !important;
          }
          .abcjs-inline-audio {
            background-color: #f1f5f9 !important;
            border-radius: 12px !important;
            padding: 12px 16px !important;
          }
          .dark .abcjs-inline-audio {
            background-color: rgb(30 41 59 / 0.8) !important;
          }
          .abcjs-inline-audio .abcjs-btn {
            background-color: #0891b2 !important;
            border: none !important;
            border-radius: 6px !important;
          }
          .abcjs-inline-audio .abcjs-btn:hover {
            background-color: #0e7490 !important;
          }
          .abcjs-inline-audio .abcjs-midi-progress-background {
            background-color: #cbd5e1 !important;
            border-radius: 4px !important;
          }
          .abcjs-inline-audio .abcjs-midi-progress-indicator {
            background-color: #0891b2 !important;
            border-radius: 4px !important;
          }
        `}</style>
      </div>
    </div>
  )
}
