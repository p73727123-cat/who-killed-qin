import { useState, type ReactNode } from 'react'
import { SceneHotspot } from '../components/SceneHotspot'
import type { Scene, SceneHotspot as SceneHotspotData } from '../types/game'

type SceneViewProps = {
  scene: Scene
  placeholderImage: string
  portraitImage?: string
  overlay?: ReactNode
  onStartDialogue: (dialogueId: string) => void
}

export function SceneView({
  scene,
  placeholderImage,
  portraitImage,
  overlay,
  onStartDialogue,
}: SceneViewProps) {
  const [activeInspection, setActiveInspection] = useState<{
    sceneId: string
    hotspot: SceneHotspotData
  } | null>(null)
  const visibleInspection = activeInspection?.sceneId === scene.id ? activeInspection.hotspot : null

  const handleHotspot = (hotspot: SceneHotspotData) => {
    if (hotspot.dialogueId) {
      setActiveInspection(null)
      onStartDialogue(hotspot.dialogueId)
      return
    }

    setActiveInspection({ sceneId: scene.id, hotspot })
  }

  return (
    <section className="scene-view" aria-labelledby="scene-title">
      <img
        className="scene-view__background"
        src={scene.backgroundImage}
        alt={scene.backgroundAlt}
        onError={(event) => {
          event.currentTarget.src = placeholderImage
        }}
      />
      <div className="scene-view__shade" />
      <div className="scene-view__heading">
        <h1 id="scene-title">{scene.name}</h1>
      </div>
      {!overlay && (
        <div className="scene-view__hotspots">
          {scene.hotspots.map((hotspot) => (
            <SceneHotspot hotspot={hotspot} key={hotspot.id} onActivate={handleHotspot} />
          ))}
        </div>
      )}
      {visibleInspection?.interactionText && !overlay && (
        <aside className="scene-view__inspection">
          <p>{visibleInspection.interactionText}</p>
        </aside>
      )}
      {overlay && (
        <div className="scene-view__overlay">
          {portraitImage && (
            <img
              className="scene-view__portrait"
              src={portraitImage}
              alt=""
              onError={(event) => {
                event.currentTarget.src = placeholderImage
              }}
            />
          )}
          {overlay}
        </div>
      )}
    </section>
  )
}
