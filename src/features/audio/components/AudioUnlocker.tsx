import React from 'react'
import { useAudioStore } from '../../../stores/useAudioStore'
import { AUDIO_STRINGS } from '../constants'

interface AudioUnlockerProps {
  onUnlock?: () => Promise<void> | void
}

const AudioUnlocker: React.FC<AudioUnlockerProps> = ({ onUnlock }) => {
  const isReady = useAudioStore((state) => state.isReady)
  const initializeAudio = useAudioStore((state) => state.initializeAudio)

  if (isReady) return null

  const handleUnlock = async () => {
    await onUnlock?.()
    await initializeAudio()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-ricePaper p-8 rounded-2xl shadow-xl max-w-sm w-full text-center border-2 border-warmWood/20">
        <h2 className="text-2xl font-bold text-warmWood mb-4">{AUDIO_STRINGS.UNLOCK.TITLE}</h2>
        <p className="text-stoneGrey mb-8">{AUDIO_STRINGS.UNLOCK.DESCRIPTION}</p>

        <button
          onClick={handleUnlock}
          className="w-full py-4 px-6 bg-bambooGreen hover:bg-brightLeaf text-white rounded-xl font-bold text-lg transition-colors shadow-md active:scale-95"
          aria-label="Start Music Theory"
        >
          {AUDIO_STRINGS.UNLOCK.BUTTON}
        </button>
      </div>
    </div>
  )
}

export default AudioUnlocker
