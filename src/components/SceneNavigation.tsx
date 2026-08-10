import type { Scene } from '../types/game'

type SceneNavigationProps = {
  scenes: Scene[]
  unlockedSceneIds: string[]
  currentSceneId: string
  label: string
  onSelectScene: (sceneId: string) => void
}

export function SceneNavigation({
  scenes,
  unlockedSceneIds,
  currentSceneId,
  label,
  onSelectScene,
}: SceneNavigationProps) {
  const unlockedScenes = scenes.filter((scene) => unlockedSceneIds.includes(scene.id))

  return (
    <nav className="scene-navigation" aria-label={label}>
      {unlockedScenes.map((scene) => (
        <button
          className="scene-navigation__button"
          disabled={scene.id === currentSceneId}
          key={scene.id}
          type="button"
          onClick={() => onSelectScene(scene.id)}
        >
          {scene.name}
        </button>
      ))}
    </nav>
  )
}
