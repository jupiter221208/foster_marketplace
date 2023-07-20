import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'

// styles
import { useDispatch } from 'react-redux'
import styles from './index.module.scss'
import { FadeLoader } from 'react-spinners'
import { useViewport } from 'utils'
import uploadFileToS3 from 'apis/aws'
import { dataURLtoFile } from 'utils/helpers'

const ApparelSection = props => {
  const { nftName, apparel, nftCoverUrl, finishEditing } = props
  const [canvas, setCanvas] = useState('')
  const [loader, setLoader] = useState(false)
  const viewport = useViewport()
  const dispatch = useDispatch()

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

  const uploadApparelSection = async (imgDataString: string) => {
    let timestamp = new Date().getTime()
    let filename = nftName + timestamp + '.png'
    var imgFile = dataURLtoFile(imgDataString, filename)
    const { url } = await uploadFileToS3(imgFile, filename)
    return url + filename
  }

  useEffect(() => {
    ;(async () => {
      let newCanvas = canvas as fabric.Canvas
      if (newCanvas != '' && newCanvas.item(1)) {
        if (finishEditing) {
          newCanvas.discardActiveObject()
          newCanvas.item(1).selectable = false
          let imgDataString = newCanvas.toDataURL({
            format: 'png',
            quality: 1,
          })
          let imgUrl = await uploadApparelSection(imgDataString)
          dispatch({ type: 'set', printImageUrl: imgUrl })
        } else {
          newCanvas.item(1).selectable = true
        }
        newCanvas.renderAll()
        setCanvas(newCanvas)
      }
    })()
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
    if (viewport === 'xs' || viewport === 'md' || viewport === 'sm') {
      screenWidth = window.innerWidth * 0.85
    }
    newCanvas.setDimensions({
      width: screenWidth,
      height: screenWidth,
    })

    new fabric.Image.fromURL(apparel, img => {
      const { width, height } = img.getOriginalSize()
      img.scale(1)
      newCanvas.add(img)
      if (viewport === 'xs' || viewport === 'md' || viewport === 'sm') {
        img.set({
          scaleX: screenWidth / width,
          scaleY: screenWidth / width,
          top: 0,
          left: 0,
        })
      }
      newCanvas.item(0).selectable = false
      setTimeout(() => {
        new fabric.Image.fromURL(
          nftCoverUrl,
          img => {
            const { width, height } = img.getOriginalSize()
            if (viewport === 'xs' || viewport === 'md' || viewport === 'sm') {
              let apparelWidth = screenWidth * 0.25
              img.scaleToWidth(apparelWidth, false)
              img.set({
                scaleX: apparelWidth / width,
                scaleY: apparelWidth / width,
                top: apparelWidth,
                left: (screenWidth * 0.75) / 2,
              })
            } else {
              img.scaleToWidth(150, false)
              img.set({
                scaleX: 150 / width,
                scaleY: 150 / width,
                top: 150,
                left: screenWidth / 2 - 60,
              })
            }

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
          },
          { crossOrigin: 'Anonymous' }
        )
      }, 500)
    })

    setCanvas(newCanvas)
  }

  return (
    <div className={styles.container}>
      <canvas id="canvas" />
      {loader && (
        <div className="w-full absolute">
          <div className="w-full flex justify-center">
            <FadeLoader color="#63D6CD" width="6" height="12" />
          </div>
          <div className={styles.progressText}>
            {viewport === 'xs' || viewport === 'md' || viewport === 'sm' ? (
              <p>Preview generation in progress, please continue to select your desired apparel parameters</p>
            ) : (
              <p>
                Preview generation in progress, please continue to
                <br /> select your desired apparel parameters
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ApparelSection
