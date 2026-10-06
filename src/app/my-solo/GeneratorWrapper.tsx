'use client'

import SoloGeneratorClient from './SoloGeneratorClient'

export default function GeneratorWrapper() {
  const handleGenerated = () => {
    // Reload the page so the server component re-fetches the new solo from DB
    window.location.href = '/my-solo'
  }

  return <SoloGeneratorClient onGenerated={handleGenerated} />
}
