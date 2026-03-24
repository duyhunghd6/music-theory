import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../../../stores/useGameStore'

export const FeedbackOverlay: React.FC = () => {
  const lastFeedback = useGameStore((state) => state.lastFeedback)
  const [feedbacks, setFeedbacks] = useState<
    { id: number; text: string; score: number; color: string }[]
  >([])

  useEffect(() => {
    if (lastFeedback) {
      const id = Date.now()
      let color = 'text-red-500'
      if (lastFeedback.rating === 'PERFECT') color = 'text-green-500'
      else if (
        lastFeedback.rating === 'GOOD' ||
        lastFeedback.rating === 'EARLY' ||
        lastFeedback.rating === 'LATE'
      )
        color = 'text-yellow-500'

      const text = `${lastFeedback.label} ${lastFeedback.scoreDelta > 0 ? '+' + lastFeedback.scoreDelta : ''}`

      setFeedbacks((prev) => [...prev, { id, text, score: lastFeedback.scoreDelta, color }])

      setTimeout(() => {
        setFeedbacks((prev) => prev.filter((f) => f.id !== id))
      }, 1000)
    }
  }, [lastFeedback])

  return (
    <div className="fixed inset-0 pointer-events-none flex justify-center items-center z-50">
      <AnimatePresence>
        {feedbacks.map((feedback) => (
          <motion.div
            key={feedback.id}
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: -50, scale: 1.2 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`absolute text-4xl font-bold ${feedback.color} drop-shadow-lg`}
          >
            {feedback.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
