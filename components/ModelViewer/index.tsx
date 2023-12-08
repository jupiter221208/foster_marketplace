/* eslint-disable */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Center } from '@react-three/drei'
import {
  Box3,
  Vector3,
  Mesh,
  MeshStandardMaterial,
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  Color,
  DirectionalLight,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

import { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react'

type ModelTypes = {
  url: string
  setModelSize: Dispatch<SetStateAction<Vector3>>
}

type RGB = {
  r: number
  g: number
  b: number
}

/**
 * ModelViewer function component loads a 3D model and sets up the scene.
 *
 * @param {string} props.url - The URL of the 3D model to load.
 *
 * @returns {JSX.Element} The Canvas component with the loaded 3D model and configured scene.
 */

export default function ModelViewer(props: { url: string }) {
  // Initialize state for the size of the model and the colors of the materials
  const [modelSize, setModelSize] = useState(new Vector3(0, 0, 0))

  // Return the Canvas component with the loaded 3D model and configured scene
  return (
    <Canvas gl={{ alpha: true }} dpr={[1, 2]} className="min-w-full  min-h-full">
      <ambientLight intensity={1.5} />
      <directionalLight intensity={1.5} />
      <CameraRig modelSize={modelSize} />
      <Center>
        <Model setModelSize={setModelSize} url={props.url} />
      </Center>
    </Canvas>
  )
}

/**
 * Model function component loads a 3D model and sets up its rotation.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.url - The URL of the 3D model to load.
 * @param {Function} props.setModelSize - The function to call to set the size of the model.
 *
 * @returns {JSX.Element} The primitive component with the loaded 3D model.
 */
function Model({ url, setModelSize }: ModelTypes) {
  const modelRef = useRef<Mesh>() // Create a ref for the 3D model
  const model = useGLTF(url) // Load the 3D model from the provided URL

  // When the component mounts or the model changes, calculate the size of the model and set the model size state
  useEffect(() => {
    const box = new Box3().setFromObject(model.scene)
    const size = new Vector3()
    box.getSize(size)
    setModelSize(size)
  }, [])

  // On each frame, if the model ref is defined, rotate the model around the y-axis
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001
    }
  })

  // Return a primitive component with the 3D model and a scale of 0.1
  return <primitive ref={modelRef} object={model.scene} scale={0.1} />
}

/**
 * CameraRig function component sets up the camera and controls for the 3D scene.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {THREE.Vector3} props.modelSize - The size of the 3D model.
 *
 * @returns {JSX.Element} The OrbitControls component with configured properties.
 */
function CameraRig({ modelSize }: { modelSize: Vector3 }) {
  // Get the camera from the React Three Fiber context
  const { camera } = useThree()

  // Calculate the largest dimension of the model
  const largestDimension = Math.max(modelSize.x, modelSize.y, modelSize.z)

  // Update the camera position when the model size changes
  useEffect(() => {
    camera.position.set(0, 0, largestDimension * 1.2)
  }, [modelSize])

  // Return the OrbitControls component with zooming disabled and polar angle limits set
  return <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 9} maxPolarAngle={Math.PI - Math.PI / 7} />
}

export async function getSnapshot(path) {
  const renderer = new WebGLRenderer({ alpha: true })
  renderer.setSize(1000, 1000)
  renderer.setClearColor(0x000000, 0)
  const element = document.body.appendChild(renderer.domElement)

  const scene = new Scene()
  const camera = new PerspectiveCamera(75, 1, 0.1, 1000)

  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
  dracoLoader.setDecoderConfig({ type: 'js' })
  loader.setDRACOLoader(dracoLoader)
  const gltf = await loader.loadAsync(path)
  scene.add(gltf.scene)

  const bbox = new Box3().setFromObject(gltf.scene)

  const size = new Vector3()
  bbox.getSize(size)

  camera.position.set(0, size.y / 2, Math.max(size.x, size.y, size.z))

  const ambientLight = new AmbientLight(0x404040, 1.2)
  scene.add(ambientLight)

  const directionalLight = new DirectionalLight(0xffffff, 1)
  scene.add(directionalLight)

  renderer.render(scene, camera)

  const screenshot = renderer.domElement.toDataURL()
  const res = await fetch(screenshot)
  const blob = await res.blob()
  document.body.removeChild(element)
  return [{ type: 'image/png', blob }]
}
