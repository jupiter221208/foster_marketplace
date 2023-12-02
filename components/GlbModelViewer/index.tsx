import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Stage, OrbitControls, Center, useScroll } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

export default function GlbModelViewer() {
  const [lightMode, setLightMode] = useState(useSelector(state => (state as any).lightMode))
  console.log(lightMode)

  return (
    <Canvas dpr={[1, 2]} camera={{ fov: 45 }} className="max-h-[1500px]">
      <color attach="background" args={['gray']} />
      <OrbitControls />
      <Center>
        <Stage environment={null}>
          <Model url="/3D-models/tent.glb" />
        </Stage>
      </Center>
    </Canvas>
  )
}

function Model(props) {
  const modelRef: any = useRef()
  const model: any = useGLTF(props.url)

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001
    }
  })

  return <primitive ref={modelRef} object={model.scene} scale={0.01} />
}
