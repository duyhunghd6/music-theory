import React from 'react'

export const LazyAbcEditor = React.lazy(() => import('../features/notation/components/AbcEditor'))
export const LazyFretboardWrapper = React.lazy(
  () => import('../features/instruments/guitar/components/FretboardWrapper')
)
export const LazyModuleContent = React.lazy(
  () => import('../features/theory/components/ModuleContent')
)
