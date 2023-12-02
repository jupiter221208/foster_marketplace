import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Stage, OrbitControls, Center } from '@react-three/drei'
import { Box3, Vector3 } from 'three'

import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react'

type ModelTypes = {
  url: string
  setModelSize: Dispatch<SetStateAction<Vector3>>
  setMaterialsColor: Dispatch<SetStateAction<RGB[]>>
}

type RGB = {
  r: number
  g: number
  b: number
}

export default function GlbModelViewer() {
  const [modelSize, setModelSize] = useState(new Vector3(0, 0, 0))
  const [materialColors, setMaterialColor] = useState<RGB[]>([])

  function getBackgroundColor(materialColors: RGB[]) {
    // Calculate the average color
    let avgColor = { r: 0, g: 0, b: 0 }
    materialColors.forEach(color => {
      avgColor.r += color.r
      avgColor.g += color.g
      avgColor.b += color.b
    })
    avgColor.r /= materialColors.length
    avgColor.g /= materialColors.length
    avgColor.b /= materialColors.length

    // Calculate the brightness of the average color
    let brightness = Math.sqrt(
      0.299 * avgColor.r * avgColor.r + 0.587 * avgColor.g * avgColor.g + 0.114 * avgColor.b * avgColor.b
    )

    // Decide the background color based on the brightness
    return brightness > 0.5 ? 'black' : 'white'
  }

  return (
    <Canvas dpr={[1, 2]} className="max-h-[500px] max-w-[500px] mx-auto">
      <color attach="background" args={[getBackgroundColor(materialColors)]} />
      <ambientLight intensity={0.3} />
      <directionalLight intensity={0.3} />
      <CameraRig modelSize={modelSize} />
      <Center>
        <Stage environment={null}>
          <Model setMaterialsColor={setMaterialColor} setModelSize={setModelSize} url="/3D-models/baby.glb" />
        </Stage>
      </Center>
    </Canvas>
  )
}

function Model({ url, setModelSize, setMaterialsColor }: ModelTypes) {
  const modelRef: any = useRef()
  const model: any = useGLTF(url)

  const allColors: RGB[] = []
  model.scene.traverse(node => {
    if (node.isMesh && node.material.color.isColor) {
      const newColor = {
        r: node.material.color.r,
        g: node.material.color.g,
        b: node.material.color.b,
      }

      allColors.push(newColor)
    }
  })
  setMaterialsColor(allColors)

  useEffect(() => {
    const box = new Box3().setFromObject(model.scene)
    const size = new Vector3()
    box.getSize(size)
    setModelSize(size)
  }, [])

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001
    }
  })

  return <primitive ref={modelRef} object={model.scene} scale={0.01} />
}

function CameraRig({ modelSize }: { modelSize: Vector3 }) {
  const { camera } = useThree()

  const largestDimension = Math.max(modelSize.x, modelSize.y, modelSize.z)

  useEffect(() => {
    camera.position.set(0, 0, largestDimension * 1.1)
  }, [modelSize])
  return <OrbitControls />
}
