import type { SceneHotspot as SceneHotspotData } from '../types/game'

type SceneHotspotProps = {
  hotspot: SceneHotspotData
  onActivate: (hotspot: SceneHotspotData) => void
}

export function SceneHotspot({ hotspot, onActivate }: SceneHotspotProps) {
  return (
    <button
      className={`scene-hotspot scene-hotspot--${hotspot.type}`}
      style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}
      type="button"
      onClick={() => onActivate(hotspot)}
    >
      {hotspot.label}
    </button>
  )
}
