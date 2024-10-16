import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import Dropzone from 'react-dropzone'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import Lottie from 'lottie-react'

// component
import MerchDTGCard from './MerchDTGCard'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'
import TechniqueClipboardChip from 'components/Chip/TechniqueClipboardChip'
import Alert from 'components/Alert'

// json
import apparelList from 'assets/json/merch-shop/merch-apparel-list.json'
import animationData from 'assets/lottery/upload-file.json'

//resources
import InfoIcon from 'assets/icons/info-green-small.svg?component'

// styles
import styles from './index.module.scss'
import MerchShopInfoModal from 'components/Modal/MerchShopInfoModal'
import LoadingButton from 'components/Button/LoadingButton'
import MerchShopQuestionModal from 'components/Modal/MerchShopQuestionModal'
import { useViewport } from 'utils'

const MerchDTGSection = props => {
  const { selectedCard, productDetail, setProductDetail } = props
  const viewport = useViewport()
  const [canvas, setCanvas] = useState('')
  const [cardSide, setCardSide] = useState('front')
  const [embPlace, setEmbPlace] = useState('front')
  const [assetUrl, setAssetUrl] = useState<any>(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showEmbPosModal, setShowEmbPosModal] = useState(false)
  const [snapshotAsset, setSnapshotAsset] = useState({ front: '', back: '', right: '', left: '' })
  const [processingImage, setProcessingImage] = useState(false)
  const [questionType, setQuestionType] = useState('')
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [curPercentage, setCurPercentage] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState([])
  const techniques = Object.keys(apparelList[selectedCard.id].location)
  const [technique, setTechnique] = useState(techniques[0])

  const colors = Object.keys(apparelList[selectedCard.id].apparel.front)
  const [color, setColor] = useState(colors[0])
  const canvasId = 'canvas-mobile'
  const alertId = 'alert-tech'
  const SweatPantModel = 15
  const unusedModalIds = [SweatPantModel]

  useEffect(() => {
    const handleMove = event => {
      if (event.type === 'touchmove' && event.target.className.includes('bar__progress')) {
        const clickPositionInPage = event.touches[0].clientX
        const bar = document.getElementById('bar__progress')!
        const barStart = bar.getBoundingClientRect().left || 0
        const barWidth = bar.offsetWidth
        const clickPositionInBar = clickPositionInPage - barStart
        let pros = (clickPositionInBar / barWidth) * 100
        if (pros < 0) pros = 0
        if (pros > 100) pros = 100
        setCurPercentage(pros)
      }
    }
    window.addEventListener('touchmove', handleMove)
    return () => {
      window.removeEventListener('touchmove', handleMove)
    }
  }, [])
  useEffect(() => {
    if (productDetail?.snapshotAssetUrl) {
      setTechnique(productDetail?.technique)
      setColor(productDetail?.color)
      setTimeout(() => {
        setSnapshotAsset(productDetail?.snapshotAssetUrl)
      }, 100)
    }
  }, [productDetail])

  useEffect(() => {
    document.getElementById(alertId).style.display = 'none'
  }, [])

  useEffect(() => {
    if (assetUrl) {
      drawApparel()
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardSide, assetUrl, embPlace, color])

  useEffect(() => {
    setSnapshotAsset({ front: '', back: '', right: '', left: '' })
    setAssetUrl(null)
    setCurPercentage(0)
    setEmbPlace('front')
    setCardSide('front')

    if (!unusedModalIds.includes(selectedCard.id)) setShowEmbPosModal(true)

    let newCanvas = canvas as fabric.Canvas
    if (newCanvas) {
      newCanvas.clear()
      newCanvas.renderAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCard])

  useEffect(() => {
    if (cardSide === 'front' && snapshotAsset[cardSide].length === 0 && !unusedModalIds.includes(selectedCard.id))
      setShowEmbPosModal(true)
    else setShowEmbPosModal(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [technique, cardSide])

  useEffect(() => {
    if (technique === 'dtg') {
      setEmbPlace('front')
    } else {
      if (apparelList[selectedCard.id].location[technique].front.hasOwnProperty('width_right_chest'))
        setEmbPlace('right_chest')
      else setEmbPlace('chest')
    }
  }, [technique])

  const isSaved = () => {
    if (
      snapshotAsset['front'] === '' &&
      snapshotAsset['back'] === '' &&
      snapshotAsset['right'] === '' &&
      snapshotAsset['left'] === ''
    )
      return false
    return true
  }

  const clearApparel = () => {
    setAssetUrl(null)

    let newAsset = { ...snapshotAsset }
    newAsset[cardSide] = ''
    setSnapshotAsset(newAsset)
    setProductDetail({ snapshotAssetUrl: newAsset, technique, color, side: cardSide, detailSide: embPlace })

    setCurPercentage(0)

    let newCanvas = canvas as fabric.Canvas
    if (newCanvas == '') {
      newCanvas = new fabric.Canvas(canvasId)
    } else {
      newCanvas.clear()
      newCanvas.renderAll()
    }

    if (cardSide === 'front') setShowEmbPosModal(true)
  }

  const getCardLabel = (side, id) => {
    if (id === SweatPantModel) {
      if (side === 'front') return 'Front left leg'
      else if (side === 'back') return 'Front right leg'
      else if (side === 'right') return 'Back left leg'
      else if (side === 'left') return 'Back right leg'
    }
    return ''
  }

  function resizeImage(url, maxWidth, maxHeight, callback) {
    var img = new Image()
    img.onload = function () {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      var ratio = Math.min(maxWidth / img.width, maxHeight / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      callback(canvas.toDataURL())
    }
    img.src = url
  }

  useEffect(() => {
    if (!assetUrl) return

    let newCanvas = canvas as fabric.Canvas
    if (newCanvas == '') {
      newCanvas = new fabric.Canvas(canvasId)
    }

    var center = newCanvas.getCenter()
    if (window.innerWidth < 640) {
      var centerPoint = new fabric.Point((center.left * 340) / 700, (center.top * 340) / 700)
      newCanvas.zoomToPoint(centerPoint, (340 / 700) * (1 + curPercentage / 33.33))
    } else if (window.innerWidth < 1024) {
      var centerPoint = new fabric.Point((center.left * 630) / 700, (center.top * 630) / 700)
      newCanvas.zoomToPoint(centerPoint, (630 / 700) * (1 + curPercentage / 33.33))
    } else {
      var centerPoint = new fabric.Point(center.left, center.top)
      newCanvas.zoomToPoint(centerPoint, 1 + curPercentage / 33.33)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curPercentage])

  const saveApparel = async () => {
    let newCanvas = canvas as fabric.Canvas
    if (newCanvas !== '') {
      setProcessingImage(true)
      newCanvas.discardActiveObject()
      newCanvas.item(2).selectable = false
      newCanvas.remove(newCanvas.item(1))

      setCurPercentage(0)
      var center = newCanvas.getCenter()
      if (window.innerWidth < 1024) {
        newCanvas.zoomToPoint(new fabric.Point(0, 0), 1)
      } else {
        var centerPoint = new fabric.Point(center.left, center.top)
        newCanvas.zoomToPoint(centerPoint, 1)
      }

      let imgDataString = newCanvas.toDataURL({
        format: 'png',
        quality: 1,
      })
      // let imgUrl = await uploadApparelSection(apparelList[selectedCard.id].name + '-' + cardSide, imgDataString)
      let newAsset = { ...snapshotAsset }
      newAsset[cardSide] = imgDataString
      newAsset[cardSide + '_raw'] = assetUrl
      setSnapshotAsset(newAsset)
      setProductDetail({ snapshotAssetUrl: newAsset, technique, color, side: cardSide, detailSide: embPlace })
      setProcessingImage(false)

      if (newCanvas !== '') {
        newCanvas.clear()
        newCanvas.renderAll()
      }
      setAssetUrl(null)
    }
  }

  const drawApparel = () => {
    let newCanvas = canvas as fabric.Canvas
    if (newCanvas == '') {
      newCanvas = new fabric.Canvas(canvasId)
    }
    newCanvas.clear()
    newCanvas.renderAll()

    if (snapshotAsset[cardSide].length > 0) return

    if (apparelList[selectedCard.id].id === 4 && technique === 'dtg' && (cardSide === 'left' || cardSide === 'right'))
      return
    let assetWidth, assetHeight, assetTop
    if (cardSide === 'front') {
      if (embPlace === 'center') {
        assetWidth = apparelList[selectedCard.id].location[technique][cardSide].width_center
        assetHeight = apparelList[selectedCard.id].location[technique][cardSide].height_center
        assetTop = apparelList[selectedCard.id].location[technique][cardSide].top
      } else if (embPlace === 'chest') {
        assetWidth = apparelList[selectedCard.id].location[technique][cardSide].width_chest
        assetHeight = apparelList[selectedCard.id].location[technique][cardSide].height_chest
        assetTop = apparelList[selectedCard.id].location[technique][cardSide].top_chest
      } else if (embPlace === 'right_chest') {
        assetWidth = apparelList[selectedCard.id].location[technique][cardSide].width_right_chest
        assetHeight = apparelList[selectedCard.id].location[technique][cardSide].height_right_chest
        assetTop = apparelList[selectedCard.id].location[technique][cardSide].top_chest
      } else {
        assetWidth = apparelList[selectedCard.id].location[technique][cardSide].width
        assetHeight = apparelList[selectedCard.id].location[technique][cardSide].height
        assetTop = apparelList[selectedCard.id].location[technique][cardSide].top
      }
    } else {
      assetWidth = apparelList[selectedCard.id].location[technique][cardSide].width
      assetHeight = apparelList[selectedCard.id].location[technique][cardSide].height
      assetTop = apparelList[selectedCard.id].location[technique][cardSide].top
    }
    let angle = apparelList[selectedCard.id].location[technique][cardSide].angle
    let left_chest = apparelList[selectedCard.id].location[technique][cardSide].left_chest
    let screenWidth = 700

    let assetLeft

    if (cardSide === 'front') {
      if (embPlace === 'center') {
        assetLeft = (screenWidth - assetWidth) / 2
      } else if (embPlace === 'chest' || embPlace === 'right_chest') {
        assetLeft = screenWidth * left_chest
      } else {
        assetLeft = apparelList[selectedCard.id].location[technique][cardSide].left
      }
    } else assetLeft = apparelList[selectedCard.id].location[technique][cardSide].left

    if (window.innerWidth < 640) {
      let ratio = 340 / 700
      newCanvas.zoomToPoint(new fabric.Point(0, 0), ratio)
    } else if (window.innerWidth < 1024) {
      let ratio = 630 / 700
      newCanvas.zoomToPoint(new fabric.Point(0, 0), ratio)
    }

    newCanvas.setDimensions({
      width: screenWidth,
      height: screenWidth,
    })

    var rect = new fabric.Rect({
      top: assetTop,
      left: assetLeft,
      width: assetWidth,
      height: assetHeight,
      stroke: 'rgba(0, 0, 0, 0.25)',
      strokeWidth: 1,
      fill: 'rgba(255, 255, 255, 0.05)',
      angle: angle,
      opacity: 1,
      absolutePositioned: true,
    })

    setTimeout(() => {
      new fabric.Image.fromURL(apparelList[selectedCard.id].apparel[cardSide][color], apparelImg => {
        const { width } = apparelImg.getOriginalSize()

        apparelImg.scale(screenWidth / 700, false)
        newCanvas.add(apparelImg)

        if (viewport === 'xs' || viewport === 'md' || viewport === 'sm') {
          apparelImg.set({
            scaleX: screenWidth / width,
            scaleY: screenWidth / width,
            top: 0,
            left: 0,
          })
        }

        newCanvas.item(0).selectable = false
        newCanvas.add(rect)
        newCanvas.item(1).selectable = false

        if (assetUrl) {
          setTimeout(() => {
            if (technique === 'dtg' || cardSide === 'back') {
              new fabric.Image.fromURL(
                assetUrl,
                overlayImg => {
                  const { width } = overlayImg.getOriginalSize()

                  var rectClippingPath = new fabric.Rect({
                    top: assetTop,
                    left: assetLeft,
                    width: assetWidth,
                    height: assetHeight,
                    stroke: 'rgba(26, 26, 26, 0.5)',
                    angle: angle,
                    absolutePositioned: true,
                  })
                  overlayImg.clipPath = rectClippingPath
                  overlayImg.scaleToWidth(assetWidth, false)
                  overlayImg.set({
                    scaleX: assetWidth / width,
                    scaleY: assetWidth / width,
                    top: assetTop,
                    left: assetLeft,
                    angle: angle,
                    globalCompositeOperation: color === 'white' ? 'multiply' : 'color-dodge',
                  })

                  newCanvas.add(overlayImg)
                  overlayImg.setControlsVisibility({
                    mt: false,
                    mb: false,
                    ml: false,
                    mr: false,
                  })
                  overlayImg.borderColor = color === 'white' ? '#202427' : '#95dbd5'
                  overlayImg.cornerColor = color === 'white' ? '#202427' : '#95dbd5'
                  newCanvas.setActiveObject(overlayImg)
                  newCanvas.renderAll()
                },
                { crossOrigin: 'Anonymous' }
              )
            } else if (technique === 'dtf') {
              new fabric.Image.fromURL(
                assetUrl,
                overlayImg => {
                  const { width } = overlayImg.getOriginalSize()

                  var rectClippingPath = new fabric.Rect({
                    top: assetTop,
                    left: assetLeft,
                    width: assetWidth,
                    height: assetHeight,
                    stroke: 'rgba(26, 26, 26, 0.5)',
                    angle: angle,
                    absolutePositioned: true,
                  })
                  overlayImg.clipPath = rectClippingPath
                  overlayImg.scaleToWidth(assetWidth, false)
                  overlayImg.set({
                    scaleX: assetWidth / width,
                    scaleY: assetWidth / width,
                    top: assetTop,
                    left: assetLeft,
                    angle: angle,
                    globalCompositeOperation: color === 'white' ? 'multiply' : 'color-dodge',
                  })

                  newCanvas.add(overlayImg)
                  overlayImg.setControlsVisibility({
                    mt: false,
                    mb: false,
                    ml: false,
                    mr: false,
                  })
                  overlayImg.borderColor = color === 'white' ? '#202427' : '#95dbd5'
                  overlayImg.cornerColor = color === 'white' ? '#202427' : '#95dbd5'
                  newCanvas.setActiveObject(overlayImg)
                  newCanvas.renderAll()
                },
                { crossOrigin: 'Anonymous' }
              )
            } else {
              resizeImage(assetUrl, 1000, 1000, function (dataUrl) {
                new fabric.Image.fromURL(
                  dataUrl,
                  overlayImg => {
                    const { width } = overlayImg.getOriginalSize()

                    var rectClippingPath = new fabric.Rect({
                      top: assetTop,
                      left: assetLeft,
                      width: assetWidth,
                      height: assetHeight,
                      stroke: 'rgba(26, 26, 26, 0.5)',
                      angle: angle,
                      absolutePositioned: true,
                    })
                    overlayImg.clipPath = rectClippingPath
                    overlayImg.scaleToWidth(assetWidth, false)
                    overlayImg.set({
                      scaleX: assetWidth / width,
                      scaleY: assetWidth / width,
                      top: assetTop,
                      left: assetLeft,
                      angle: angle,
                    })

                    // pattern image
                    new fabric.Image.fromURL('/images/merch-pattern.png', patternImage => {
                      overlayImg.filters.push(
                        new fabric.Image.filters.BlendImage({
                          image: patternImage,
                          mode: 'multiply',
                          alpha: 0.5,
                        })
                      )
                      overlayImg.applyFilters()
                      overlayImg.lockUniScaling = true
                      overlayImg.setControlsVisibility({
                        mt: false,
                        mb: false,
                        ml: false,
                        mr: false,
                      })
                      newCanvas.add(overlayImg)
                      newCanvas.setActiveObject(overlayImg)
                      newCanvas.renderAll()
                    })
                  },
                  { crossOrigin: 'Anonymous' }
                )
              })
            }
          }, 500)
        }
      })
    }, 500)

    setCanvas(newCanvas)
  }

  const calcClickedProgress = (e: any) => {
    let pros
    if (viewport === 'lg' || viewport === 'xl' || viewport === '2xl') {
      const clickPositionInPage = e.pageY
      const bar = document.getElementById('bar__progress')!
      const barStart = (bar.getBoundingClientRect().top || 0) + window.scrollY
      const barHeight = bar.offsetHeight
      let clickPositionInBar = clickPositionInPage - barStart
      pros = ((barHeight - clickPositionInBar) / barHeight) * 100
    } else {
      const clickPositionInPage = e.pageX
      const bar = document.getElementById('bar__progress')!
      const barStart = (bar.getBoundingClientRect().left || 0) + window.scrollX
      const barWidth = bar.offsetWidth
      const clickPositionInBar = clickPositionInPage - barStart
      pros = (clickPositionInBar / barWidth) * 100
    }

    if (pros < 0) pros = 0
    if (pros > 100) pros = 100

    setCurPercentage(pros)
  }

  const handleTimeDrag = (e: any) => {
    calcClickedProgress(e)

    const updateTimeOnMove = eMove => {
      calcClickedProgress(eMove)
    }

    document.addEventListener('mousemove', updateTimeOnMove)

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', updateTimeOnMove)
    })
  }

  return (
    <div className="w-full">
      {/************* Desktop ************/}
      <div className="w-full flex gap-[10px] xl:gap-[30px]">
        <div
          className={`w-full lg:mt-[60px] mt-[80px] max-w-[100%] min-w-[100%] lg:max-w-[50%] lg:min-w-[50%] xl:max-w-[58%] xl:min-w-[58%] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'g-container' : 'g-left-container'
          }`}
        >
          <div className="relative flex justify-center">
            <div className={styles.rightPanel}>
              <div className="w-full flex justify-center">
                <div className="w-[340px] h-[340px] md:w-[630px] md:h-[630px] lg:w-[550px] lg:h-[550px] xl:w-[700px] xl:h-[700px] overflow-hidden">
                  <canvas id={canvasId} className="ml-[-8px] md:ml-[0px]" />
                </div>
              </div>
              {snapshotAsset[cardSide].length > 0 ? (
                <div className="absolute w-[340px] h-[340px] md:w-[630px] md:h-[630px] xl:w-[700px] xl:h-[700px] flex justify-center">
                  <div className="absolute inset-0">
                    <img
                      src={snapshotAsset[cardSide]}
                      alt=""
                      className="w-[340px] h-[340px] md:w-[630px] md:h-[630px] xl:w-[700px] xl:h-[700px]"
                    />
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              {snapshotAsset[cardSide].length === 0 && !assetUrl && (
                <div className="absolute w-[340px] h-[340px] md:w-[630px] md:h-[630px] lg:w-[550px] lg:h-[550px] xl:w-[700px] xl:h-[700px] flex justify-center">
                  <div className="absolute inset-0">
                    <img
                      src={apparelList[selectedCard.id].apparel[cardSide][color]}
                      alt=""
                      className="w-[340px] h-[340px] md:w-[630px] md:h-[630px] lg:w-[550px] lg:h-[550px] xl:w-[700px] xl:h-[700px]"
                    />
                  </div>
                  <div className={`${styles.dropArea}`}>
                    <Dropzone
                      onDrop={acceptedFiles => {
                        if (acceptedFiles.length !== 0) {
                          setAssetUrl(URL.createObjectURL(acceptedFiles[0]))
                          setShowEmbPosModal(false)
                        }
                      }}
                      onDropRejected={rejectedFiles => {
                        setAlertData([
                          {
                            id: 0,
                            title: 'Upload Failed!',
                            description: `File size is too large, size is limited to 10Mb.`,
                            type: 'failure',
                          },
                        ])
                        setShowAlert(true)
                      }}
                      maxFiles={1}
                      accept={{ 'image/jpeg': [], 'image/png': [] }}
                      maxSize={10485760}
                    >
                      {({ getRootProps, getInputProps, open }) => (
                        <section>
                          <button onClick={open} style={{ display: 'none' }}>
                            open
                          </button>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className="flex flex-col justify-center items-center">
                              <div className="w-[90px] h-[90px] mt-[-20px] sm:mt-[0px">
                                <Lottie animationData={animationData} loop={true} />
                              </div>
                              {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                                <div className={styles.uploadText}>
                                  Upload your
                                  <br />
                                  design here
                                </div>
                              ) : (
                                <div className={styles.uploadText}>
                                  Upload or drop
                                  <br />
                                  your design here
                                </div>
                              )}
                            </div>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                </div>
              )}
            </div>
            {assetUrl &&
              snapshotAsset[cardSide].length === 0 &&
              (viewport === 'lg' ||
                viewport === 'xl' ||
                (viewport === '2xl' && (
                  <div className={styles.progressBar}>
                    <div>
                      <div className={styles.prosText}>300%</div>
                      <div className="w-full h-[460px] mt-[12px] pl-[15px]">
                        <div className={styles.bar}>
                          <div
                            id="bar__progress"
                            className={styles.bar__progress}
                            style={{
                              background: `linear-gradient(to top, var(--main-icon-color) ${curPercentage}%, rgba(var(--main-bg-color-rgb), 0.2) 0)`,
                            }}
                            onMouseDown={e => handleTimeDrag(e)}
                          >
                            <span className={styles.bar__progress__knob} style={{ top: `${100 - curPercentage}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className={`mt-[15px] ${styles.prosText}`}>{(curPercentage * 3).toFixed(0)}%</div>
                    </div>
                  </div>
                )))}
          </div>
        </div>

        <div
          className={`w-full lg:block hidden lg:max-w-[50%] lg:min-w-[50%] xl:max-w-[42%] xl:min-w-[42%] ${
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'g-container' : 'g-right-container'
          } ${styles.rightBG}`}
        >
          <div className="lg:mt-[60px] ml-[40px] 2xl:mt-[60px] 2xl:ml-[100px]">
            <div className={styles.studioDesinger}>Studio Designer</div>
            <div className={`${styles.garment} mt-[15px] lg:block hidden`}>
              You can place up to 4 different designs, but only 1 design (front or back) is included in the base price.
              Additional designs will include additional fees – please see{' '}
              <span onClick={() => setShowInfoModal(true)}>product extras and costs</span> for a breakdown of prices.
            </div>
            <div className={`${styles.garment} mt-[10px] lg:hidden block`}>
              You can place up to 4 different designs, but only 1 design (front or back) is included in the base price.
              <br />
              <br />
              Additional designs will include additional fees – please see{' '}
              <span onClick={() => setShowInfoModal(true)}>product extras and costs</span> for a breakdown of prices.
            </div>

            <div className="w-full mt-[20px]">
              <div className={styles.technique}>
                Technique
                <div
                  onMouseEnter={() => {
                    document.getElementById(alertId).style.display = 'block'
                  }}
                  onMouseLeave={() => {
                    document.getElementById(alertId).style.display = 'none'
                  }}
                >
                  <InfoIcon className="mt-[2px]" />
                </div>
                <TechniqueClipboardChip
                  title="Which technique should I choose?"
                  text="DTG is ideal for complex designs/artwork (i.e., large print areas, multiple colors, and gradients within the
      artwork). Embroidery is better suited to simpler, smaller designs, such as logos, and for those who might want
      to achieve a 3D effect with their branding."
                  identifier={alertId}
                />
              </div>
              <div className="w-full mt-[15px] flex gap-[15px]">
                {apparelList[selectedCard.id].location.hasOwnProperty('dtg') && (
                  <div
                    className={technique === 'dtg' ? styles.selectedBtn : styles.unselectedBtn}
                    onClick={() => {
                      if (isSaved()) {
                        setQuestionType('technique_dtg')
                        setShowQuestionModal(true)
                      } else {
                        setTechnique('dtg')
                      }
                    }}
                  >
                    Direct to Garment(DTG)
                  </div>
                )}
                {apparelList[selectedCard.id].location.hasOwnProperty('dtf') && (
                  <div
                    className={technique === 'dtf' ? styles.selectedBtn : styles.unselectedBtn}
                    onClick={() => {
                      if (isSaved()) {
                        setQuestionType('technique_dtf')
                        setShowQuestionModal(true)
                      } else {
                        setTechnique('dtf')
                      }
                    }}
                  >
                    Direct to Film(DTF)
                  </div>
                )}
                {apparelList[selectedCard.id].location.hasOwnProperty('emb') && (
                  <div
                    className={technique === 'emb' ? styles.selectedBtn : styles.unselectedBtn}
                    onClick={() => {
                      if (isSaved()) {
                        setQuestionType('technique_emb')
                        setShowQuestionModal(true)
                      } else {
                        setTechnique('emb')
                      }
                    }}
                  >
                    Embroidery
                  </div>
                )}
              </div>
            </div>

            <div className="w-full mt-[20px]">
              <div className={styles.technique}>Color</div>
              <div className="w-full mt-[15px] flex gap-[15px]">
                {colors.map((item, index) => (
                  <div
                    key={index}
                    className={`${
                      item === 'white'
                        ? styles.whiteColor
                        : item === 'black'
                        ? styles.blackColor
                        : item === 'blue'
                        ? styles.blueColor
                        : item === 'red'
                        ? styles.redColor
                        : item === 'gray'
                        ? styles.grayColor
                        : item === 'green'
                        ? styles.greenColor
                        : item === 'pink'
                        ? styles.pinkColor
                        : styles.purpleColor
                    } ${color === item && styles.selectedColor}`}
                    onClick={() => {
                      if (isSaved()) {
                        setQuestionType('color_' + item)
                        setShowQuestionModal(true)
                      } else {
                        setColor(item)
                      }
                    }}
                  ></div>
                ))}
              </div>
            </div>

            <div className={`${styles.technique} mt-[28px]`}>Placement</div>
            <div className="flex gap-[8px] xl:gap-[12px] mt-[12px]">
              {apparelList[selectedCard.id].card.hasOwnProperty('front') ? (
                <MerchDTGCard
                  selected={cardSide === 'front'}
                  image={
                    snapshotAsset['front'].length > 0
                      ? snapshotAsset['front']
                      : apparelList[selectedCard.id].card.front[color]
                  }
                  side="front"
                  type="DTG"
                  title={getCardLabel('front', selectedCard.id)}
                  placement={apparelList[selectedCard.id].location[technique].front}
                  technique={technique}
                  onSelect={type => {
                    setCardSide(type)
                    setShowEmbPosModal(true)
                  }}
                />
              ) : (
                <></>
              )}

              {apparelList[selectedCard.id].card.hasOwnProperty('back') ? (
                <MerchDTGCard
                  selected={cardSide === 'back'}
                  image={
                    snapshotAsset['back'].length > 0
                      ? snapshotAsset['back']
                      : apparelList[selectedCard.id].card.back[color]
                  }
                  side="back"
                  type="DTG"
                  title={getCardLabel('back', selectedCard.id)}
                  placement={apparelList[selectedCard.id].location[technique].front}
                  technique={technique}
                  onSelect={type => setCardSide(type)}
                />
              ) : (
                <></>
              )}

              {technique === 'dtg' && apparelList[selectedCard.id].id === 4 ? (
                <></>
              ) : apparelList[selectedCard.id].card.hasOwnProperty('right') ? (
                <MerchDTGCard
                  type={selectedCard.id}
                  selected={cardSide === 'right'}
                  image={
                    snapshotAsset['right'].length > 0
                      ? snapshotAsset['right']
                      : apparelList[selectedCard.id].card.right[color]
                  }
                  side="right"
                  title={getCardLabel('right', selectedCard.id)}
                  placement={apparelList[selectedCard.id].location[technique].front}
                  technique={technique}
                  onSelect={type => setCardSide(type)}
                />
              ) : (
                <></>
              )}
              {technique === 'dtg' && apparelList[selectedCard.id].id === 4 ? (
                <></>
              ) : apparelList[selectedCard.id].card.hasOwnProperty('left') ? (
                <MerchDTGCard
                  type={selectedCard.id}
                  selected={cardSide === 'left'}
                  image={
                    snapshotAsset['left'].length > 0
                      ? snapshotAsset['left']
                      : apparelList[selectedCard.id].card.left[color]
                  }
                  side="left"
                  title={getCardLabel('left', selectedCard.id)}
                  placement={apparelList[selectedCard.id].location[technique].front}
                  technique={technique}
                  onSelect={type => setCardSide(type)}
                />
              ) : (
                <></>
              )}
            </div>
            {showEmbPosModal ? (
              <div className={styles.embFrontContainer}>
                <div className="w-full flex justify-between">
                  <div className={styles.embFrontTitle}>
                    {technique === 'emb' ? 'Embroidery Placement' : 'Print Placement'}
                  </div>
                </div>
                <div className={styles.embFrontContent}>Which placement option would you like to use?</div>
                <div className="mt-[15px] flex gap-[16px] justify-end">
                  {apparelList[selectedCard.id].location[technique].front.hasOwnProperty('width_center') && (
                    <div
                      className={`${styles.embFrontBtn} ${embPlace === 'center' ? styles.enabled : styles.disabled}`}
                      onClick={() => {
                        setEmbPlace('center')
                        setShowEmbPosModal(false)
                      }}
                    >
                      Center Chest
                    </div>
                  )}
                  {apparelList[selectedCard.id].location[technique].front.hasOwnProperty('width_chest') && (
                    <div
                      className={`${styles.embFrontBtn} ${embPlace === 'chest' ? styles.enabled : styles.disabled}`}
                      onClick={() => {
                        setEmbPlace('chest')
                        setShowEmbPosModal(false)
                      }}
                    >
                      Left Chest
                    </div>
                  )}
                  {apparelList[selectedCard.id].location[technique].front.hasOwnProperty('width_right_chest') && (
                    <div
                      className={`${styles.embFrontBtn} ${
                        embPlace === 'right_chest' ? styles.enabled : styles.disabled
                      }`}
                      onClick={() => {
                        setEmbPlace('right_chest')
                        setShowEmbPosModal(false)
                      }}
                    >
                      Right Chest
                    </div>
                  )}
                  {(technique === 'dtg' || technique === 'dtf') &&
                    apparelList[selectedCard.id].location[technique].front.hasOwnProperty('width') && (
                      <div
                        className={`${styles.embFrontBtn} ${embPlace === 'front' ? styles.enabled : styles.disabled}`}
                        onClick={() => {
                          setEmbPlace('front')
                          setShowEmbPosModal(false)
                        }}
                      >
                        Full Front
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className={`w-full mt-[27px]`}>
                  <OutlineButton fullWidth height={50} fontSize={18} label="Clear" onClick={clearApparel} />
                </div>
                <div className="w-full mt-[18px]">
                  {processingImage ? (
                    <LoadingButton fullWidth height={50} />
                  ) : snapshotAsset[cardSide].length > 0 ? (
                    <div className="w-full flex flex-col gap-[8px] mt-[13px]">
                      <div className={styles.savedTitle}>Your design has been saved!</div>
                      <div className={styles.savedContent}>
                        {"Click next if you're finished, otherwise add another design."}
                      </div>
                    </div>
                  ) : (
                    <GradientButton
                      fullWidth
                      height={50}
                      fontSize={18}
                      label="Save"
                      onClick={() => saveApparel()}
                      disabled={assetUrl === null}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/************* Mobile ************/}

      <div className="w-full block lg:hidden g-container mt-[30px]">
        {assetUrl && snapshotAsset[cardSide].length === 0 && (
          <div className={styles.progressBarMobile}>
            <div className={styles.prosText}>{(curPercentage * 3).toFixed(0)}%</div>
            <div className="flex-1 h-[23px] mt-[9px] items-center">
              <div className={styles.bar} onMouseDown={e => handleTimeDrag(e)}>
                <div
                  id="bar__progress"
                  className={styles.bar__progress}
                  style={{
                    background: `linear-gradient(to right, var(--main-icon-color) ${curPercentage}%, rgba(var(--main-bg-color-rgb), 0.2) 0)`,
                  }}
                >
                  <span className={styles.bar__progress__knob} style={{ left: `${curPercentage - 2}%`, top: '-4px' }} />
                </div>
              </div>
            </div>
            <div className={`${styles.prosText}`}>300%</div>
          </div>
        )}
        <div>
          <div className="w-full mt-[15px]">
            <div className={styles.technique}>Technique</div>
            <div className="w-full mt-[10px] flex gap-[15px]">
              {apparelList[selectedCard.id].location.hasOwnProperty('dtg') && (
                <div
                  className={technique === 'dtg' ? styles.selectedBtn : styles.unselectedBtn}
                  onClick={() => {
                    if (isSaved()) {
                      setQuestionType('technique_dtg')
                      setShowQuestionModal(true)
                    } else {
                      setTechnique('dtg')
                    }
                  }}
                >
                  Direct to Garment(DTG)
                </div>
              )}
              {apparelList[selectedCard.id].location.hasOwnProperty('dtf') && (
                <div
                  className={technique === 'dtf' ? styles.selectedBtn : styles.unselectedBtn}
                  onClick={() => {
                    if (isSaved()) {
                      setQuestionType('technique_dtf')
                      setShowQuestionModal(true)
                    } else {
                      setTechnique('dtf')
                    }
                  }}
                >
                  Direct to Film(DTF)
                </div>
              )}
              {apparelList[selectedCard.id].location.hasOwnProperty('emb') && (
                <div
                  className={technique === 'emb' ? styles.selectedBtn : styles.unselectedBtn}
                  onClick={() => {
                    if (technique !== 'emb' && isSaved()) {
                      setQuestionType('technique_emb')
                      setShowQuestionModal(true)
                    } else {
                      setTechnique('emb')
                    }
                  }}
                >
                  Embroidery
                </div>
              )}
            </div>
          </div>
          <div className="w-full mt-[20px]">
            <div className={styles.technique}>Color</div>
            <div className="w-full mt-[10px] flex gap-[12px]">
              {colors.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    item === 'white'
                      ? styles.whiteColor
                      : item === 'black'
                      ? styles.blackColor
                      : item === 'blue'
                      ? styles.blueColor
                      : item === 'red'
                      ? styles.redColor
                      : item === 'gray'
                      ? styles.grayColor
                      : item === 'green'
                      ? styles.greenColor
                      : item === 'pink'
                      ? styles.pinkColor
                      : styles.purpleColor
                  } ${color === item && styles.selectedColor}`}
                  onClick={() => {
                    if (isSaved()) {
                      setQuestionType('color_' + item)
                      setShowQuestionModal(true)
                    } else {
                      setColor(item)
                    }
                  }}
                ></div>
              ))}
            </div>
          </div>

          <div className={`${styles.technique} mt-[28px]`}>Placement</div>
          <div className="w-full flex gap-[9px] sm:mt-[15px] lg:mt-[10px] mt-[10px] mb-[200px] lg:mb-[0px]">
            {apparelList[selectedCard.id].card.hasOwnProperty('front') ? (
              <MerchDTGCard
                selected={cardSide === 'front'}
                image={
                  snapshotAsset['front'].length > 0
                    ? snapshotAsset['front']
                    : apparelList[selectedCard.id].card.front[color]
                }
                side="front"
                type="DTG"
                title={getCardLabel('front', selectedCard.id)}
                technique={technique}
                placement={apparelList[selectedCard.id].location[technique].front}
                onSelect={type => {
                  setCardSide(type)
                  setShowEmbPosModal(true)
                }}
              />
            ) : (
              <></>
            )}
            {apparelList[selectedCard.id].card.hasOwnProperty('back') ? (
              <MerchDTGCard
                selected={cardSide === 'back'}
                image={
                  snapshotAsset['back'].length > 0
                    ? snapshotAsset['back']
                    : apparelList[selectedCard.id].card.back[color]
                }
                side="back"
                type="DTG"
                title={getCardLabel('back', selectedCard.id)}
                placement={apparelList[selectedCard.id].location[technique].front}
                technique={technique}
                onSelect={type => setCardSide(type)}
              />
            ) : (
              <></>
            )}
            {technique === 'dtg' && apparelList[selectedCard.id].id === 4 ? (
              <></>
            ) : apparelList[selectedCard.id].card.hasOwnProperty('right') ? (
              <MerchDTGCard
                type={selectedCard.id}
                selected={cardSide === 'right'}
                image={
                  snapshotAsset['right'].length > 0
                    ? snapshotAsset['right']
                    : apparelList[selectedCard.id].card.right[color]
                }
                side="right"
                title={getCardLabel('right', selectedCard.id)}
                placement={apparelList[selectedCard.id].location[technique].front}
                technique={technique}
                onSelect={type => setCardSide(type)}
              />
            ) : (
              <></>
            )}
            {technique === 'dtg' && apparelList[selectedCard.id].id === 4 ? (
              <></>
            ) : apparelList[selectedCard.id].card.hasOwnProperty('left') ? (
              <MerchDTGCard
                type={selectedCard.id}
                selected={cardSide === 'left'}
                image={
                  snapshotAsset['left'].length > 0
                    ? snapshotAsset['left']
                    : apparelList[selectedCard.id].card.left[color]
                }
                side="left"
                title={getCardLabel('left', selectedCard.id)}
                placement={apparelList[selectedCard.id].location[technique].front}
                technique={technique}
                onSelect={type => setCardSide(type)}
              />
            ) : (
              <></>
            )}
          </div>
          {/* **************Buttons desktop************** */}
          <div className="w-full lg:block hidden">
            {showEmbPosModal ? (
              <div className={styles.embFrontContainer}>
                <div className="w-full flex justify-between">
                  <div className={styles.embFrontTitle}>
                    {technique === 'emb' ? 'Embroidery Placement' : 'Print Placement'}
                  </div>
                </div>
                <div className={styles.embFrontContent}>Which placement option would you like to use?</div>
                <div className="mt-[15px] flex gap-[16px] justify-end">
                  {apparelList[selectedCard.id].location[technique].front.hasOwnProperty('width_center') && (
                    <div
                      className={`${styles.embFrontBtn} ${embPlace === 'center' ? styles.enabled : styles.disabled}`}
                      onClick={() => {
                        setEmbPlace('center')
                        setShowEmbPosModal(false)
                      }}
                    >
                      Center Chest
                    </div>
                  )}
                  {apparelList[selectedCard.id].location[technique].front.hasOwnProperty('width_chest') && (
                    <div
                      className={`${styles.embFrontBtn} ${embPlace === 'chest' ? styles.enabled : styles.disabled}`}
                      onClick={() => {
                        setEmbPlace('chest')
                        setShowEmbPosModal(false)
                      }}
                    >
                      Left Chest
                    </div>
                  )}
                  {apparelList[selectedCard.id].location[technique].front.hasOwnProperty('width_right_chest') && (
                    <div
                      className={`${styles.embFrontBtn} ${
                        embPlace === 'right_chest' ? styles.enabled : styles.disabled
                      }`}
                      onClick={() => {
                        setEmbPlace('right_chest')
                        setShowEmbPosModal(false)
                      }}
                    >
                      Right Chest
                    </div>
                  )}
                  {technique === 'dtg' && (
                    <div
                      className={`${styles.embFrontBtn} ${embPlace === 'front' ? styles.enabled : styles.disabled}`}
                      onClick={() => {
                        setEmbPlace('full')
                        setShowEmbPosModal(false)
                      }}
                    >
                      Full Front
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div
                  className={`w-full ${
                    technique === 'dtg' || technique === 'dtf'
                      ? viewport === 'xs'
                        ? 'mt-[20px]'
                        : viewport === 'sm'
                        ? 'mt-[30px]'
                        : viewport === 'lg'
                        ? 'mt-[44px]'
                        : 'mt-[30px]'
                      : 'mt-[27px]'
                  }`}
                >
                  <OutlineButton fullWidth height={50} fontSize={18} label="Clear" onClick={clearApparel} />
                </div>
                <div className="w-full mt-[18px]">
                  {processingImage ? (
                    <LoadingButton fullWidth height={50} />
                  ) : snapshotAsset[cardSide].length > 0 ? (
                    <div className="w-full flex flex-col gap-[8px] mt-[13px]">
                      <div className={styles.savedTitle}>Your design has been saved!</div>
                      <div className={styles.savedContent}>
                        {"Click next if you're finished, otherwise add another design."}
                      </div>
                    </div>
                  ) : (
                    <GradientButton
                      fullWidth
                      height={50}
                      fontSize={18}
                      label="Save"
                      onClick={() => saveApparel()}
                      disabled={assetUrl === null}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ************mobile*********** */}
          {/* {(assetUrl || snapshotAsset[cardSide].length > 0) && ( */}
          <div className={styles.buttonArea}>
            {showEmbPosModal ? (
              <div className={styles.embFrontContainer}>
                <div className="w-full flex justify-between">
                  <div className={styles.embFrontTitle}>
                    {technique === 'emb' ? 'Embroidery Placement' : 'Print Placement'}
                  </div>
                </div>
                <div className={styles.embFrontContent}>Which placement option would you like to use?</div>
                <div className="mt-[10px] flex gap-[10px] justify-end">
                  <div
                    className={`${styles.embFrontBtn} ${embPlace === 'center' ? styles.enabled : styles.disabled}`}
                    onClick={() => {
                      setEmbPlace('center')
                      setShowEmbPosModal(false)
                    }}
                  >
                    Center Chest
                  </div>
                  <div
                    className={`${styles.embFrontBtn} ${embPlace === 'chest' ? styles.enabled : styles.disabled}`}
                    onClick={() => {
                      setEmbPlace('chest')
                      setShowEmbPosModal(false)
                    }}
                  >
                    Left Chest
                  </div>
                  {(technique === 'dtg' || technique === 'dtf') && (
                    <div
                      className={`${styles.embFrontBtn} ${embPlace === 'front' ? styles.enabled : styles.disabled}`}
                      onClick={() => {
                        setEmbPlace('full')
                        setShowEmbPosModal(false)
                      }}
                    >
                      Full Front
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className={`w-full mt-[20px] px-[15px]`}>
                  <OutlineButton fullWidth height={50} fontSize={18} label="Clear" onClick={clearApparel} />
                </div>
                <div className="w-full mt-[12px] px-[15px]">
                  {processingImage ? (
                    <LoadingButton fullWidth height={50} />
                  ) : snapshotAsset[cardSide].length > 0 ? (
                    <div className="w-full flex flex-col gap-[8px] mt-[13px]">
                      <div className={styles.savedTitle}>Your design has been saved!</div>
                      <div className={styles.savedContent}>
                        {"Click next if you're finished, or add another design."}
                      </div>
                    </div>
                  ) : (
                    <GradientButton
                      fullWidth
                      height={50}
                      fontSize={18}
                      label="Save"
                      onClick={() => {
                        if (curPercentage > 0) setCurPercentage(0)

                        setTimeout(() => {
                          saveApparel()
                        }, 500)
                      }}
                      disabled={assetUrl === null}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          {/* )} */}
        </div>
      </div>
      <MerchShopInfoModal
        open={showInfoModal}
        close={status => {
          setShowInfoModal(false)
        }}
      />

      <MerchShopQuestionModal
        type={questionType}
        open={showQuestionModal}
        close={status => {
          setShowQuestionModal(false)
        }}
        onContinue={type => {
          setShowQuestionModal(false)
          let newTechnique = technique,
            newColor = color

          if (type === 'technique_dtg') newTechnique = 'dtg'
          else if (type === 'technique_dtf') newTechnique = 'dtf'
          else if (type === 'technique_emb') newTechnique = 'emb'
          else if (type === 'color_white') newColor = 'white'
          else if (type === 'color_black') newColor = 'black'

          setTechnique(newTechnique)
          setColor(newColor)

          setSnapshotAsset({ front: '', back: '', right: '', left: '' })
          setProductDetail({
            snapshotAssetUrl: { front: '', back: '', right: '', left: '' },
            technique: newTechnique,
            side: cardSide,
            detailSide: embPlace,
            color: newColor,
          })
          setAssetUrl(null)
          setCurPercentage(0)
          setShowEmbPosModal(false)
          let newCanvas = canvas as fabric.Canvas
          if (newCanvas == '') {
            newCanvas = new fabric.Canvas(canvasId)
          }
          newCanvas.clear()
          newCanvas.renderAll()
        }}
      />

      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  )
}

export default MerchDTGSection
