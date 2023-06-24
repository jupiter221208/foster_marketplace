import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'

// styles
import styles from './index.module.scss'
import LoadingModal from 'components/Modal/LoadingModal'
import { FadeLoader } from 'react-spinners'

// api

const WallSection = props => {
  const { wallArt, finishEditing } = props
  const [canvas, setCanvas] = useState('')
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    const resizeFunction = () => {
      if (wallArt) {
        drawApparel()
      }
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

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

  const getArtFrame = ratio => {
    let frame = '2x1.png'
    if (ratio === 2 / 1) frame = '2x1.png'
    else if (ratio === 3 / 2) frame = '3x2.png'
    else if (ratio === 4 / 3) frame = '4x3.png'
    else if (ratio === 5 / 3) frame = '5x3.png'
    else if (ratio === 5 / 4) frame = '5x4.png'
    else if (ratio === 6 / 5) frame = '6x5.png'
    else if (ratio === 7 / 5) frame = '7x5.png'
    else if (ratio === 1 / 2) frame = '1x2.png'
    else if (ratio == 2 / 3) frame = '2x3.png'
    else if (ratio == 3 / 4) frame = '3x4.png'
    else if (ratio == 3 / 5) frame = '3x5.png'
    else if (ratio == 4 / 5) frame = '4x5.png'
    else if (ratio == 5 / 6) frame = '5x6.png'
    else if (ratio == 5 / 7) frame = '5x7.png'
    else if (ratio == 1) frame = '1x1.png'
    return '/images/wallart/frame/' + frame
  }

  const getArtFrameBorder = ratio => {
    let border = 20
    if (ratio == 1 / 2) border = 30
    else if (ratio == 3 / 5) border = 30
    else if (ratio == 5 / 7) border = 20
    else if (ratio == 2 / 3) border = 15
    else if (ratio == 3 / 4) border = 20
    else if (ratio == 4 / 5) border = 20
    else if (ratio == 5 / 6) border = 26
    else if (ratio == 1) border = 29
    else if (ratio == 6 / 5) border = 38
    else if (ratio == 5 / 4) border = 22
    else if (ratio == 4 / 3) border = 12
    else if (ratio == 7 / 5) border = 30
    else if (ratio == 3 / 2) border = 18
    else if (ratio == 5 / 3) border = 25
    else if (ratio == 2 / 1) border = 32
    return border
  }

  const drawApparel = () => {
    let newCanvas = canvas as fabric.Canvas
    if (newCanvas == '') {
      newCanvas = new fabric.Canvas('canvas')
    } else {
      newCanvas.clear().renderAll()
    }

    let screenWidth = window.innerWidth * 0.41
    let screenHeight = window.innerHeight - 160
    newCanvas.setDimensions({
      width: screenWidth,
      height: screenHeight,
    })

    new fabric.Image.fromURL(wallArt.wall, img => {
      newCanvas.add(img)
      const { width, height } = img.getOriginalSize()
      if (width > height) {
        img.set({
          scaleX: screenHeight / height, //screenWidth / width,
          scaleY: screenHeight / height,
          top: 0,
          left: -((width * screenHeight) / height - screenWidth) / 2,
          lockAspectRatio: true,
        })
      } else {
        img.set({
          scaleX: screenWidth / width, //screenWidth / width,
          scaleY: screenWidth / width,
          top: -((height * screenWidth) / width - screenHeight) / 2,
          left: 0,
          lockAspectRatio: true,
        })
      }

      newCanvas.renderAll()
      newCanvas.item(0).selectable = false
      setCanvas(newCanvas)

      setTimeout(() => {
        const artRatio = wallArt.size.width / wallArt.size.height
        let multipleRatio = getArtRatio(artRatio)
        let frame = getArtFrame(artRatio)

        new fabric.Image.fromURL(frame, img => {
          newCanvas.add(img)
          const { width, height } = img.getOriginalSize()
          let viewWidth = screenWidth * multipleRatio
          let ratio = viewWidth / width

          img.set({
            scaleX: ratio,
            scaleY: ratio,
            top: (screenHeight - height * ratio) / 2,
            left: (screenWidth - viewWidth) / 2,
            lockAspectRatio: true,
          })
          newCanvas.add(img)
          newCanvas.renderAll()
          img.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
          })
          setCanvas(newCanvas)

          setTimeout(() => {
            new fabric.Image.fromURL(wallArt.art, img => {
              const { width, height } = img.getOriginalSize()
              let viewWidth = screenWidth * multipleRatio
              const artRatio = wallArt.size.width / wallArt.size.height

              viewWidth = viewWidth - getArtFrameBorder(artRatio) / multipleRatio
              let ratio = viewWidth / width
              img.set({
                scaleX: ratio,
                scaleY: ratio,
                top: (screenHeight - height * ratio - getArtFrameBorder(artRatio) / multipleRatio / 12) / 2,
                left: (screenWidth - viewWidth) / 2 - (artRatio === 1 ? 2 : 0),
                lockAspectRatio: true,
              })
              img.shadow = { color: 'rgba(32,36,39,0.5)', offsetX: 20, offsetY: 20, blur: 20 }
              // img.strokeWidth = 30
              // img.stroke = '#222726'
              img.lockUniScaling = true
              newCanvas.add(img)
              newCanvas.renderAll()
              img.setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
              })
              setCanvas(newCanvas)
            })
          }, 500)
        })
      }, 500)
    })
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
    </div>
  )
}

export default WallSection
