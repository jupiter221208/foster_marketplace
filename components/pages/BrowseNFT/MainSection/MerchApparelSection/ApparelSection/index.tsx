import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'

// styles
import styles from './index.module.scss'
import LoadingModal from 'components/Modal/LoadingModal'
import { FadeLoader } from 'react-spinners'

// api

const ApparelSection = props => {
  const { apparel, nftCoverUrl, finishEditing } = props
  const [canvas, setCanvas] = useState('')
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    const resizeFunction = () => {
      if (apparel) {
        // drawApparel()
      }
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  useEffect(() => {
    if (apparel) {
      setLoader(false)
      drawApparel()
    } else {
      let newCanvas = canvas as fabric.Canvas
      if (newCanvas != '') {
        newCanvas.clear().renderAll()
        setCanvas(newCanvas)
      }
      setLoader(true)
    }
  }, [apparel])

  useEffect(() => {
    let newCanvas = canvas as fabric.Canvas
    if (newCanvas != '' && newCanvas.item(1)) {
      if (finishEditing) {
        newCanvas.discardActiveObject()
        newCanvas.item(1).selectable = false
      } else {
        newCanvas.item(1).selectable = true
      }
      newCanvas.renderAll()
      setCanvas(newCanvas)
    }
  }, [finishEditing])

  const drawApparel = () => {
    let newCanvas = canvas as fabric.Canvas
    if (newCanvas == '') {
      newCanvas = new fabric.Canvas('canvas')
    } else {
      newCanvas.clear()
      newCanvas.renderAll()
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
          img.set({
            scaleX: 150 / width,
            scaleY: 150 / width,
            top: 150,
            left: screenWidth / 2 - 60,
            lockAspectRatio: true,
          })
          img.lockUniScaling = true
          newCanvas.add(img)
          img.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
          })
          newCanvas.setActiveObject(img)
          newCanvas.renderAll()
        })
      }, 500)
    })

    setCanvas(newCanvas)
  }

  return (
    <div className={styles.container}>
      <canvas id="canvas" />
      {loader && (
        <div className="w-full absolute">
          {/* <LoadingModal open={loader} /> */}
          <div className="w-full flex justify-center">
            <FadeLoader color="#63D6CD" width="6" height="12" />
          </div>

          <div className={styles.progressText}>
            <p>
              Preview generation in progress, please continue to
              <br /> select your desired apparel parameters
            </p>
          </div>
        </div>
      )}
      {/* <img src={apparel} alt="" className="h-full" />
      <div className="absolute top-[20%] w-[30%] h-[30%]">
        <img src={nftCoverUrl} alt="" className="w-full h-full object-cover" />
      </div> */}
    </div>
  )
}

export default ApparelSection
