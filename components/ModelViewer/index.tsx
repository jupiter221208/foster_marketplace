/* eslint-disable */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Center } from '@react-three/drei'
import { Box3, Vector3, Mesh, MeshStandardMaterial } from 'three'

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
  const [materialColors, setMaterialColor] = useState<RGB[]>([])

  /**
   * getBackgroundColor function calculates the average color of the materials and decides the background color based on the brightness.
   *
   * @param {RGB[]} materialColors - The array of colors of the materials.
   *
   * @returns {string} The background color ('black' or 'white').
   */
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

  // Return the Canvas component with the loaded 3D model and configured scene
  return (
    <Canvas dpr={[1, 2]} className="min-w-full  min-h-full">
      <color attach="background" args={[getBackgroundColor(materialColors)]} />
      <ambientLight intensity={10} />
      <directionalLight intensity={1} />
      <CameraRig modelSize={modelSize} />
      <Center>
        <Model setMaterialsColor={setMaterialColor} setModelSize={setModelSize} url={props.url} />
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
 * @param {Function} props.setMaterialsColor - The function to call to set the materials color of the model.
 *
 * @returns {JSX.Element} The primitive component with the loaded 3D model.
 */
function Model({ url, setModelSize, setMaterialsColor }: ModelTypes) {
  const modelRef = useRef<Mesh>() // Create a ref for the 3D model
  const model = useGLTF(url) // Load the 3D model from the provided URL

  const allColors: RGB[] = [] // Initialize an array to store the colors of the model's materials
  // Traverse the nodes of the 3D model
  model.scene.traverse(node => {
    // Cast the node to a Mesh and its material to a MeshStandardMaterial
    const nodeMesh = node as Mesh
    const nodeMaterial = nodeMesh.material as MeshStandardMaterial
    // If the node is a mesh and its material has a color, add the color to the array
    if (nodeMesh.isMesh && nodeMaterial.color.isColor) {
      const newColor = {
        r: nodeMaterial.color.r,
        g: nodeMaterial.color.g,
        b: nodeMaterial.color.b,
      }
      allColors.push(newColor)
    }
  })
  setMaterialsColor(allColors) // Set the materials color state with the array of colors

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
