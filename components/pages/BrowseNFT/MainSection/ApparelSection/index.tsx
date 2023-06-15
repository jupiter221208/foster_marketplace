import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// custom functions
import { useViewport } from 'utils'

// json

// images

// styles
import styles from './index.module.scss'

// api

const ApparelSection = props => {
  const { apparel, nftCoverUrl } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
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

    let width = window.innerWidth * 0.3
    newCanvas.setDimensions({
      width: width,
      height: width,
    })

    new fabric.Image.fromURL(apparel, img => {
      img.scale(1)
      newCanvas.add(img)
      newCanvas.renderAll()
      newCanvas.item(0).selectable = false
    })
    setTimeout(() => {
      new fabric.Image.fromURL(nftCoverUrl, img => {
        img.scaleToWidth(150, false)
        img.set({ top: 150 })
        img.set({ left: width / 2 - 65 })
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
