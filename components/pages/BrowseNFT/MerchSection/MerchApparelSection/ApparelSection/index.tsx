import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'

// styles
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.scss'
import { FadeLoader } from 'react-spinners'
import { useViewport } from 'utils'
import uploadFileToS3 from 'apis/aws'
import { CDN_PREFIX, dataURLtoFile } from 'utils/helpers'
import { useRouter } from 'next/router'

const ApparelSection = props => {
  const { canvasId, nftName, apparel, nftCoverUrl, finishEditing, saveImage } = props
  const coverUrl = nftCoverUrl.replace(CDN_PREFIX, '')
  const [canvas, setCanvas] = useState('')
  const [loader, setLoader] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)

  const viewport = useViewport()
  const dispatch = useDispatch()
  const isAddToCart = useSelector(state => (state as any).isAddToCart)
  const router = useRouter()

  useEffect(() => {
    if (apparel && apparel.length > 0) {
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
    return url
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
          if (isAddToCart) {
            dispatch({ type: 'set', activeTab: 4 })
            router.push(`/merch-logs/`)
          }
        } else {
          newCanvas.item(1).selectable = true
        }
        newCanvas.renderAll()
        setCanvas(newCanvas)
      }
    })()
  }, [finishEditing])

  const drawApparel = () => {
    if (isDrawing) return

    setIsDrawing(true)
    let newCanvas = canvas as fabric.Canvas
    if (newCanvas == '') {
      newCanvas = new fabric.Canvas(canvasId)
    } else {
      newCanvas.clear()
      newCanvas.renderAll()
    }

    let screenWidth = window.innerWidth * 0.3
    if (viewport === 'xs') {
      screenWidth = window.innerWidth * 0.85 - 32
    } else if (viewport === 'sm' || viewport === 'md') {
      screenWidth = window.innerWidth * 0.5 - 32
    }
    newCanvas.setDimensions({
      width: screenWidth,
      height: screenWidth,
    })
    new fabric.Image.fromURL(apparel, img => {
      const { width, height } = img.getOriginalSize()
      img.scale(screenWidth / 600, false)
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
          coverUrl,
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
              let ratio = screenWidth / 600
              img.scaleToWidth(150 * ratio, false)
              img.set({
                scaleX: (150 * ratio) / width,
                scaleY: (150 * ratio) / width,
                top: 150 * ratio,
                left: (screenWidth - (150 * ratio) / width) / 2 - (150 * ratio) / 2, //((screenWidth - 150 * (screenWidth / 600)) / 21) * 11,
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
            setIsDrawing(false)
          },
          { crossOrigin: 'Anonymous' }
        )
      }, 500)
    })

    setCanvas(newCanvas)
  }

  return (
    <div className={styles.container}>
      <canvas id={canvasId} />
      {loader && (
        <div className="w-full absolute">
          <div className="w-full flex justify-center">
            <FadeLoader color="#95dbd5" width="6px" height="12px" />
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
