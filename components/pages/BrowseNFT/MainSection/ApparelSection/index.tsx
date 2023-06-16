import React, { useState, useEffect } from 'react'
import { Canvas, Image, Rect } from 'fabric'

// styles
import styles from './index.module.scss'

// api

const ApparelSection = props => {
  const { apparel, nftCoverUrl } = props
  const [canvas, setCanvas] = useState<Canvas | null>(null)

  useEffect(() => {
    const resizeFunction = () => {
      if (apparel) {
        drawApparel()
      }
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  useEffect(() => {
    if (apparel) {
      drawApparel()
    }
  }, [apparel])

  const drawApparel = () => {
    let newCanvas = canvas ?? new Canvas('canvas')
    newCanvas.clear()
    newCanvas.renderAll()

    let screenWidth = window.innerWidth * 0.3
    newCanvas.setDimensions({
      width: screenWidth,
      height: screenWidth,
    })

    Image.fromURL(apparel, img => {
      img.scale(1)
      img.selectable = false
      newCanvas.add(img)
      newCanvas.renderAll()
    })
    setTimeout(() => {
      Image.fromURL(nftCoverUrl, img => {
        const { width, height } = img.getOriginalSize()
        img.scaleToWidth(150, false)
        img.set({ scaleX: 150 / width, scaleY: 150 / height, top: 150, left: screenWidth / 2 - 60 })
        newCanvas.add(img)
        newCanvas.renderAll()
      })
    }, 500)

    setCanvas(newCanvas)
  }

  return (
    <div className={styles.container}>
      <canvas id="canvas" />
      {/* <img src={apparel} alt="" className="h-full" />
      <div className="absolute top-[20%] w-[30%] h-[30%]">
        <img src={nftCoverUrl} alt="" className="w-full h-full object-cover" />
      </div> */}
    </div>
  )
}

export default ApparelSection
