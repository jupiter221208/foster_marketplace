/* eslint-disable */
import { Box3, Vector3, WebGLRenderer, Scene, PerspectiveCamera, AmbientLight, DirectionalLight } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import React, { useState, useEffect } from 'react'

const ModelViewer = ({
  path,
  width = 500,
  height = 500,
  orbitLimited = false,
  fullScreen = false,
  getSnapshot = { onSnapshot: url => {}, status: false },
}) => {
  // State variables
  const [renderer, setRenderer] = useState(null)
  const [scene, setScene] = useState(null)
  const [camera, setCamera] = useState(null)
  const [controls, setControls] = useState(null)
  const [model, setModel] = useState(null)

  // Load the GLTF model and set up the scene
  useEffect(() => {
    const newRenderer = new WebGLRenderer({ alpha: true, preserveDrawingBuffer: true })
    newRenderer.setSize(width, height)
    newRenderer.setClearColor(0x000000, 0)
    setRenderer(newRenderer)

    const scene = new Scene()
    setScene(scene)

    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
    setCamera(camera)

    const controls = new OrbitControls(camera, newRenderer.domElement)
    if (orbitLimited) {
      controls.enableZoom = false
      controls.minPolarAngle = 0.5
      controls.maxPolarAngle = 2.5
    }
    setControls(controls)

    const render = () => {
      controls.update()
      newRenderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    render()

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    dracoLoader.setDecoderConfig({ type: 'js' })
    loader.setDRACOLoader(dracoLoader)
    loader.loadAsync(path).then(gltf => {
      setModel(gltf)
      scene.add(gltf.scene)

      const bbox = new Box3().setFromObject(gltf.scene)
      const center = bbox.getCenter(new Vector3())
      const size = bbox.getSize(new Vector3())

      camera.position.set(0, 0, Math.max(size.x, size.y, size.z) * 1.5)
      controls.target.set(center.x, center.y, center.z)
      controls.update()

      const ambientLight = new AmbientLight(0x404040, 1.2)
      scene.add(ambientLight)

      const directionalLight = new DirectionalLight(0xffffff, 1)
      scene.add(directionalLight)
    })

    return () => {
      // Dispose of resources
      newRenderer.dispose()
    }
  }, [])

  useEffect(() => {
    if (renderer && !fullScreen) {
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    } else if (renderer && fullScreen) {
      renderer.setSize(innerWidth, innerHeight)
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
    }
  }, [width, height])

  useEffect(() => {
    if (getSnapshot.status) giveSnapshot()
  }, [getSnapshot.status])
  async function giveSnapshot() {
    if (renderer) {
      const screenshot = renderer.domElement.toBlob(blob => {
        getSnapshot.onSnapshot(blob) // Pass the image object as a property to onSnapshot
      })
    }
  }

  return (
    <div
      ref={el => {
        if (renderer && el) {
          el.appendChild(renderer.domElement)
        }
      }}
    />
  )
}

export default ModelViewer
