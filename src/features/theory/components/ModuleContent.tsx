import React from 'react'
import { useModuleStore } from '../../../stores/useModuleStore'
import { CollapsiblePanel } from '../../../components/ui/CollapsiblePanel'
import { TopicCard } from '../../../components/theory/TopicCard'
import { TheoryPanel } from '../../../components/theory/TheoryPanel'
import { HarmonicTimeline } from '../../../components/harmony/HarmonicTimeline'

const MODULE_1_TOPICS = [
  {
    title: 'Staff & Clefs',
    description: 'Learn the grand staff, treble, and bass clefs',
    completed: true,
  },
  {
    title: 'Musical Alphabet',
    description: 'A B C D E F G - the building blocks',
    completed: true,
  },
  { title: 'Accidentals', description: 'Sharps, flats, and naturals', completed: false },
  { title: 'Intervals', description: 'Distance between pitches', completed: false },
  { title: 'Enharmonics', description: 'Same pitch, different names', completed: false },
]

const MODULE_2_TOPICS = [
  { title: 'Note Values', description: 'Whole, half, quarter, eighth notes', completed: false },
  { title: 'Rests', description: 'Silence in music notation', completed: false },
  { title: 'Time Signatures', description: '4/4, 3/4, 6/8 and more', completed: false },
  { title: 'Tempo', description: 'From Largo to Presto', completed: false },
  { title: 'Syncopation', description: 'Off-beat rhythms', completed: false },
]

interface ModuleContentProps {
  className?: string
}

export const ModuleContent: React.FC<ModuleContentProps> = ({ className }) => {
  const currentModuleId = useModuleStore((state) => state.currentModuleId)
  const [activeTopicIndex, setActiveTopicIndex] = React.useState(0)

  const topics = currentModuleId === 1 ? MODULE_1_TOPICS : MODULE_2_TOPICS

  React.useEffect(() => {
    const firstIncomplete = topics.findIndex((t) => !t.completed)
    setActiveTopicIndex(firstIncomplete >= 0 ? firstIncomplete : 0)
  }, [currentModuleId, topics])

  return (
    <div className={`space-y-3 ${className}`}>
      <CollapsiblePanel
        title={`Module ${currentModuleId} Topics`}
        icon="format_list_numbered"
        defaultOpen
      >
        <div className="space-y-2">
          {topics.map((topic, index) => (
            <TopicCard
              key={topic.title}
              number={index + 1}
              title={topic.title}
              description={topic.description}
              completed={topic.completed}
              active={index === activeTopicIndex}
              onClick={() => setActiveTopicIndex(index)}
            />
          ))}
        </div>
      </CollapsiblePanel>

      {[1, 3, 4].includes(currentModuleId) && (
        <CollapsiblePanel title="Theory Panel" icon="library_books" defaultOpen>
          <TheoryPanel />
        </CollapsiblePanel>
      )}

      {[4, 5].includes(currentModuleId) && (
        <CollapsiblePanel title="Harmonic Timeline" icon="view_timeline" defaultOpen>
          <HarmonicTimeline />
        </CollapsiblePanel>
      )}
    </div>
  )
}

export default ModuleContent
