import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import { FadeLoader } from 'react-spinners'
import { useViewport } from 'utils'
import { dataURLtoFile } from 'utils/helpers'
import uploadFileToS3 from 'apis/aws'
import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'

// api

const WallSection = props => {
  const { canvasId, nftName, wallArt, finishEditing } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const [canvas, setCanvas] = useState('')
  const [loader, setLoader] = useState(false)
  const [bgOrgSize, setBgOrgSize] = useState(null)
  const [artOrgSize, setArtOrgSize] = useState(null)

  const uploadApparelSection = async (imgDataString: string) => {
    let timestamp = new Date().getTime()
    let filename = nftName + timestamp + '.png'
    var imgFile = dataURLtoFile(imgDataString, filename)
    const { url } = await uploadFileToS3(imgFile, filename)
    return url + filename
  }

  useEffect(() => {
    const resizeFunction = () => {
      if (wallArt) {
        let newCanvas = canvas as fabric.Canvas

        if (newCanvas != '') {
          let screenWidth, screenHeight
          if (window.innerWidth < 576) {
            screenWidth = window.innerWidth
            screenHeight = window.innerWidth
          } else if (window.innerWidth < 768) {
            screenWidth = window.innerWidth - 100
            screenHeight = screenWidth * 0.8
          } else if (window.innerWidth < 1024) {
            screenWidth = window.innerWidth - 270
            screenHeight = screenWidth * 0.8
          } else {
            let width_ratio = window.innerWidth > 1680 ? 0.41 : 0.38
            screenWidth = Math.floor(window.innerWidth * width_ratio)
            screenHeight = window.innerHeight - 160
          }

          newCanvas.setDimensions({
            width: screenWidth,
            height: screenHeight,
          })
          if (bgOrgSize === null) return
          const { width, height } = bgOrgSize
          let wallImg = newCanvas.item(0)
          if (width > height) {
            wallImg.set({
              scaleX: screenHeight / height,
              scaleY: screenHeight / height,
              top: 0,
              left: -((width * screenHeight) / height - screenWidth) / 2,
              lockAspectRatio: true,
            })
          } else {
            wallImg.set({
              scaleX: screenWidth / width,
              scaleY: screenWidth / width,
              top: -((height * screenWidth) / width - screenHeight) / 2,
              left: 0,
              lockAspectRatio: true,
            })
          }
          let artImage = newCanvas.item(1)

          if (artOrgSize === null) return

          let width1 = artOrgSize.width
          let height1 = artOrgSize.height
          const artRatio = wallArt.size.width / wallArt.size.height
          let multipleRatio = getArtRatio(artRatio)

          let viewWidth = screenWidth * multipleRatio
          let ratio = viewWidth / width1
          artImage.set({
            scaleX: ratio,
            scaleY: ratio,
            top: (screenHeight - height1 * ratio) / 2,
            left: (screenWidth - viewWidth) / 2,
          })

          newCanvas.renderAll()
        }
      }
    }
    window.addEventListener('resize', resizeFunction)
  }, [artOrgSize, bgOrgSize])

  useEffect(() => {
    if (wallArt) {
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
  }, [wallArt])

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
          newCanvas.item(1).selectable = false
        } else {
          newCanvas.item(1).selectable = true
        }

        newCanvas.renderAll()
        setCanvas(newCanvas)
      }
    })()
  }, [finishEditing])

  const getArtRatio = ratio => {
    let multipleRatio = 0.5
    if (ratio === 2 / 1) multipleRatio = 0.74
    else if (ratio === 3 / 2) multipleRatio = 0.8
    else if (ratio === 4 / 3) multipleRatio = 0.56
    else if (ratio === 5 / 3) multipleRatio = 0.8
    else if (ratio === 5 / 4) multipleRatio = 0.61
    else if (ratio === 6 / 5) multipleRatio = 0.85
    else if (ratio === 7 / 5) multipleRatio = 0.86
    else if (ratio === 0.5) multipleRatio = 0.35
    else if (ratio == 2 / 3) multipleRatio = 0.54
    else if (ratio == 3 / 4) multipleRatio = 0.61
    else if (ratio == 3 / 5) multipleRatio = 0.48
    else if (ratio == 4 / 5) multipleRatio = 0.5
    else if (ratio == 5 / 6) multipleRatio = 0.58
    else if (ratio == 5 / 7) multipleRatio = 0.62
    else if (ratio == 1) multipleRatio = 0.65
    return multipleRatio
  }

  const drawApparel = () => {
    let newCanvas = canvas as fabric.Canvas
    if (newCanvas == '') {
      newCanvas = new fabric.Canvas(canvasId)
      setCanvas(newCanvas)
    } else {
      newCanvas.clear().renderAll()
    }

    let screenWidth, screenHeight
    if (window.innerWidth < 576) {
      screenWidth = window.innerWidth
      screenHeight = window.innerWidth
    } else if (window.innerWidth < 768) {
      screenWidth = window.innerWidth - 100
      screenHeight = screenWidth * 0.8
    } else if (window.innerWidth < 1024) {
      screenWidth = window.innerWidth - 270
      screenHeight = screenWidth * 0.8
    } else {
      let width_ratio = window.innerWidth > 1680 ? 0.41 : 0.38
      screenWidth = Math.floor(window.innerWidth * width_ratio)
      screenHeight = window.innerHeight - 160
    }

    newCanvas.setDimensions({
      width: screenWidth,
      height: screenHeight,
    })

    new fabric.Image.fromURL(wallArt.wall, img => {
      newCanvas.add(img)
      const { width, height } = img.getOriginalSize()
      setBgOrgSize({ width: width, height: height })

      if (width > height) {
        img.set({
          scaleX: screenHeight / height,
          scaleY: screenHeight / height,
          top: 0,
          left: -((width * screenHeight) / height - screenWidth) / 2,
          lockAspectRatio: true,
        })
      } else {
        img.set({
          scaleX: screenWidth / width,
          scaleY: screenWidth / width,
          top: -((height * screenWidth) / width - screenHeight) / 2,
          left: 0,
          lockAspectRatio: true,
        })
      }

      newCanvas.renderAll()
      newCanvas.item(0).selectable = false

      setTimeout(() => {
        new fabric.Image.fromURL(wallArt.art, img => {
          const { width, height } = img.getOriginalSize()
          setArtOrgSize(img.getOriginalSize())
          const artRatio = wallArt.size.width / wallArt.size.height
          let multipleRatio = getArtRatio(artRatio)
          let viewWidth = screenWidth * multipleRatio
          let ratio = (viewWidth / width) * 0.8
          let leftMargin = (screenWidth - viewWidth) / 2

          if (screenWidth < 1024) leftMargin = (screenWidth - viewWidth) / 2 + 12
          img.set({
            scaleX: ratio,
            scaleY: ratio,
            top: (screenHeight - height * ratio) / 2,
            left: leftMargin,
            lockAspectRatio: true,
          })
          img.shadow = { color: 'rgba(32,36,39,0.5)', offsetX: 20, offsetY: 20, blur: 20 }
          img.strokeWidth = 20
          img.stroke = '#2b2b2b'
          img.selectable = false
          newCanvas.add(img)
          newCanvas.renderAll()
          img.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
          })
        })
      }, 500)
    })
  }

  return (
    <div className={styles.container}>
      <canvas id={canvasId} />
      {loader && (
        <div className="w-full h-full top-0 absolute flex justify-center items-center">
          <div className="w-full">
            <div className="w-full flex justify-center">
              <FadeLoader color="#95dbd5" width="6" height="12" />
            </div>

            <div className={styles.progressText}>
              <p>
                Preview generation in progress, please continue to
                <br /> select your desired apparel parameters
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WallSection
