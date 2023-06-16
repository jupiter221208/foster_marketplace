import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'

// styles
import styles from './index.module.scss'

// api

const ApparelSection = props => {
  const { apparel, nftCoverUrl } = props
  const [canvas, setCanvas] = useState('')

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
    let newCanvas = canvas as fabric.Canvas
    if (newCanvas == '') {
      newCanvas = new fabric.Canvas('canvas')
    } else {
      newCanvas.clear().renderAll()
    }

    let screenWidth = window.innerWidth * 0.3
    newCanvas.setDimensions({
      width: screenWidth,
      height: screenWidth,
    })

    new fabric.Image.fromURL(apparel, img => {
      img.scale(1)
      newCanvas.add(img)
      newCanvas.renderAll()
      newCanvas.item(0).selectable = false
      setTimeout(() => {
        new fabric.Image.fromURL(nftCoverUrl, img => {
          const { width, height } = img.getOriginalSize()
          img.scaleToWidth(150, false)
          img.set({ scaleX: 150 / width, scaleY: 150 / height, top: 150, left: screenWidth / 2 - 60 })
          newCanvas.add(img)
          newCanvas.renderAll()
        })
      }, 500)
    })

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
