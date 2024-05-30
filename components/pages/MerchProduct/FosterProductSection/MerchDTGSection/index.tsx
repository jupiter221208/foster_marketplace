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

// json
import apparelList from 'assets/json/merch-shop/merch-apparel-list.json'
import animationData from 'assets/lottery/upload-file.json'

//resources
import InfoIcon from 'assets/icons/info-green-small.svg?component'

// styles
import styles from './index.module.scss'
import MerchShopInfoModal from 'components/Modal/MerchShopInfoModal'
import { dataURLtoFile } from 'utils/helpers'
import uploadFileToS3 from 'apis/aws'
import LoadingButton from 'components/Button/LoadingButton'
import MerchShopQuestionModal from 'components/Modal/MerchShopQuestionModal'
import { useViewport } from 'utils'

const MerchDTGSection = props => {
  const { selectedCard, productDetail, setProductDetail } = props
  const viewport = useViewport()
  const [canvas, setCanvas] = useState('')
  const [color, setColor] = useState('white')
  const [technique, setTechnique] = useState('dtg')
  const [cardSide, setCardSide] = useState('front')
  const [embPlace, setEmbPlace] = useState('left')
  const [assetUrl, setAssetUrl] = useState<any>(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showEmbPosModal, setShowEmbPosModal] = useState(false)
  const [snapshotAsset, setSnapshotAsset] = useState({ front: '', back: '', right: '', left: '' })
  const [processingImage, setProcessingImage] = useState(false)
  const [questionType, setQuestionType] = useState('')
  const [showQuestionModal, setShowQuestionModal] = useState(false)

  const canvasId = 'canvas-mobile'
  const alertId = 'alert-tech'

  useEffect(() => {
    if (productDetail?.snapshotAssetUrl) {
      setTechnique(productDetail?.technique)
      setColor(productDetail?.color)
      setTimeout(() => {
        setSnapshotAsset(productDetail?.snapshotAssetUrl)
      }, 1000)
    }
  }, [productDetail])

  useEffect(() => {
    document.getElementById(alertId).style.display = 'none'
  }, [])

  useEffect(() => {
    if (assetUrl) {
      drawApparel()
      return
    } else {
      let newCanvas = canvas as fabric.Canvas
      if (newCanvas == '') {
        newCanvas = new fabric.Canvas(canvasId)
      }
      newCanvas.clear()
      newCanvas.renderAll()
    }
  }, [cardSide, assetUrl, color, selectedCard, technique, embPlace])

  useEffect(() => {
    setSnapshotAsset({ front: '', back: '', right: '', left: '' })
    setProductDetail({ snapshotAssetUrl: { front: '', back: '', right: '', left: '' }, technique, color })
    setAssetUrl(null)
  }, [selectedCard, color, technique])

  useEffect(() => {
    if (technique === 'emb') {
      if (cardSide === 'front') setShowEmbPosModal(true)
      else setShowEmbPosModal(false)
    } else {
      setShowEmbPosModal(false)
    }
  }, [technique, cardSide])

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

  const uploadApparelSection = async (name: string, imgDataString: string) => {
    let timestamp = new Date().getTime()
    let filename = name + timestamp + '.png'
    var imgFile = dataURLtoFile(imgDataString, filename)
    const { url } = await uploadFileToS3(imgFile, filename)
    return url
  }

  const saveApparel = async () => {
    let newCanvas = canvas as fabric.Canvas
    if (newCanvas !== '') {
      setProcessingImage(true)
      newCanvas.discardActiveObject()
      newCanvas.item(2).selectable = false
      newCanvas.remove(newCanvas.item(1))
      newCanvas.setZoom(1)
      let imgDataString = newCanvas.toDataURL({
        format: 'png',
        quality: 1,
      })
      // let imgUrl = await uploadApparelSection(apparelList[selectedCard.id].name + '-' + cardSide, imgDataString)
      let newAsset = { ...snapshotAsset }
      newAsset[cardSide] = imgDataString
      setSnapshotAsset(newAsset)
      setProductDetail({ snapshotAssetUrl: newAsset, technique, color })
      setProcessingImage(false)

      if (newCanvas !== '') {
        newCanvas.clear()
        newCanvas.renderAll()
      }
      setAssetUrl(null)
    }
  }

  const clearApparel = () => {
    let newAsset = { ...snapshotAsset }
    newAsset[cardSide] = ''
    setSnapshotAsset(newAsset)
    setProductDetail({ snapshotAssetUrl: newAsset, technique, color })

    let newCanvas = canvas as fabric.Canvas
    if (newCanvas == '') {
      newCanvas = new fabric.Canvas(canvasId)
    } else {
      newCanvas.clear()
      newCanvas.renderAll()
    }
    setAssetUrl(null)
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

    let assetWidth = apparelList[selectedCard.id].location[technique][cardSide].width
    let assetHeight = apparelList[selectedCard.id].location[technique][cardSide].height
    let assetTop = apparelList[selectedCard.id].location[technique][cardSide].top
    let angle = apparelList[selectedCard.id].location[technique][cardSide].angle
    let screenWidth = 700

    let assetLeft

    if (technique === 'dtg') {
      assetLeft = apparelList[selectedCard.id].location[technique][cardSide].left
    } else {
      if (cardSide === 'front') {
        if (embPlace === 'center') {
          assetLeft = (screenWidth - assetWidth) / 2
        } else {
          assetLeft = screenWidth * 0.56
        }
      } else assetLeft = apparelList[selectedCard.id].location[technique][cardSide].left
    }

    if (window.innerWidth < 640) {
      newCanvas.setZoom(375 / 700)
      // screenWidth = 375
      // assetWidth = (assetWidth * screenWidth) / 700
      // assetHeight = (assetHeight * screenWidth) / 700
      // assetTop = (assetTop * screenWidth) / 700
      // assetLeft = (assetLeft * screenWidth) / 700
    } else if (window.innerWidth < 1024) {
      newCanvas.setZoom(630 / 700)
      // screenWidth = 630
      // assetWidth = (assetWidth * screenWidth) / 700
      // assetHeight = (assetHeight * screenWidth) / 700
      // assetTop = (assetTop * screenWidth) / 700
      // assetLeft = (assetLeft * screenWidth) / 700
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

                  overlayImg.scaleToWidth(assetWidth, false)
                  overlayImg.set({
                    scaleX: assetWidth / width,
                    scaleY: assetWidth / width,
                    top: assetTop,
                    left: assetLeft,
                    angle: angle,
                    globalCompositeOperation: color === 'white' ? 'multiply' : 'color-dodge',
                  })

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

                  overlayImg.setControlsVisibility({
                    mt: false,
                    mb: false,
                    ml: false,
                    mr: false,
                  })
                  newCanvas.setActiveObject(overlayImg)
                  newCanvas.add(overlayImg)
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

  return (
    <div className="w-full">
      <div className={styles.createDesign}>Create Design</div>
      <div className={`${styles.garment} mt-[10px] lg:block hidden`}>
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
      {/************* Desktop ************/}
      <div className="w-full flex gap-[10px] xl:gap-[30px] mt-[45px]">
        <div className={`${styles.leftPanel} lg:block hidden`}>
          <div className={styles.studioDesinger}>Studio Designer</div>
          <div className={`${styles.garment} mt-[15px]`}>
            Select the printing technique and fabric color. Add your design, generate mockups, and showcase this merch
            in your studio store.
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
              <TechniqueClipboardChip identifier={alertId} />
            </div>
            <div className="w-full mt-[15px] flex gap-[15px]">
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
                Direct to Garment
              </div>
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
            </div>
          </div>
          <div className="w-full mt-[20px]">
            <div className={styles.technique}>Color</div>
            <div className="w-full mt-[15px] flex gap-[15px]">
              <div
                className={`${styles.whiteColor} ${color === 'white' && styles.selectedColor}`}
                onClick={() => {
                  if (isSaved()) {
                    setQuestionType('color_white')
                    setShowQuestionModal(true)
                  } else {
                    setColor('white')
                  }
                }}
              ></div>
              <div
                className={`${styles.blackColor} ${color === 'black' && styles.selectedColor}`}
                onClick={() => {
                  if (isSaved()) {
                    setQuestionType('color_black')
                    setShowQuestionModal(true)
                  } else {
                    setColor('black')
                  }
                }}
              ></div>
            </div>
          </div>

          <div className={`${styles.technique} mt-[28px]`}>Placement</div>
          <div className="flex gap-[8px] xl:gap-[12px] mt-[12px]">
            <MerchDTGCard
              selected={cardSide === 'front'}
              image={
                snapshotAsset['front'].length > 0
                  ? snapshotAsset['front']
                  : apparelList[selectedCard.id].apparel.front[color]
              }
              side="front"
              type="DTG"
              technique={technique}
              onSelect={type => {
                setCardSide(type)
                if (technique === 'emb') setShowEmbPosModal(true)
              }}
            />
            <MerchDTGCard
              selected={cardSide === 'back'}
              image={
                snapshotAsset['back'].length > 0
                  ? snapshotAsset['back']
                  : apparelList[selectedCard.id].apparel.back[color]
              }
              side="back"
              type="DTG"
              label="+$5.95"
              technique={technique}
              onSelect={type => setCardSide(type)}
            />
            {technique === 'dtg' && apparelList[selectedCard.id].id === 4 ? (
              <></>
            ) : (
              <MerchDTGCard
                type={selectedCard.id}
                selected={cardSide === 'right'}
                image={
                  snapshotAsset['right'].length > 0
                    ? snapshotAsset['right']
                    : apparelList[selectedCard.id].apparel.right[color]
                }
                side="right"
                label="+$2.49"
                technique={technique}
                onSelect={type => setCardSide(type)}
              />
            )}
            {technique === 'dtg' && apparelList[selectedCard.id].id === 4 ? (
              <></>
            ) : (
              <MerchDTGCard
                type={selectedCard.id}
                selected={cardSide === 'left'}
                image={
                  snapshotAsset['left'].length > 0
                    ? snapshotAsset['left']
                    : apparelList[selectedCard.id].apparel.left[color]
                }
                side="left"
                label="+$2.49"
                technique={technique}
                onSelect={type => setCardSide(type)}
              />
            )}
          </div>
          {showEmbPosModal ? (
            <div className={styles.embFrontContainer}>
              <div className="w-full flex justify-between">
                <div className={styles.embFrontTitle}>Embroidery Placement</div>
                {/* <div className="mt-[-8px]" onClick={() => setShowEmbPosModal(false)}>
                  <CloseIcon alt="" />
                </div> */}
              </div>
              <div className={styles.embFrontContent}>Which placement option would you like to use?</div>
              <div className="mt-[15px] flex gap-[16px] justify-end">
                <div
                  className={`${styles.embFrontBtn} ${embPlace === 'left' ? styles.enabled : styles.disabled}`}
                  onClick={() => {
                    setEmbPlace('left')
                    setShowEmbPosModal(false)
                  }}
                >
                  Left Chest
                </div>
                <div
                  className={`${styles.embFrontBtn} ${embPlace === 'center' ? styles.enabled : styles.disabled}`}
                  onClick={() => {
                    setEmbPlace('center')
                    setShowEmbPosModal(false)
                  }}
                >
                  Center Chest
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className={`w-full ${technique === 'dtg' ? 'mt-[44px]' : 'mt-[27px]'}`}>
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
                    backgroundColor01="var(--main-icon-color)"
                    backgroundColor02="var(--main-icon-color)"
                    color="var(--background-main-color)"
                    label="Save"
                    onClick={() => saveApparel()}
                    disabled={assetUrl === null}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex justify-center">
          <div className={styles.rightPanel}>
            <div className="w-[375px] h-[375px] md:w-[630px] md:h-[630px] lg:w-[550px] lg:h-[550px] xl:w-[700px] xl:h-[700px] overflow-hidden">
              <canvas id={canvasId} className="ml-[-8px] md:ml-[0px]" />
            </div>

            {snapshotAsset[cardSide].length > 0 ? (
              <div className="absolute w-[375px] h-[375px] md:w-[630px] md:h-[630px] xl:w-[700px] xl:h-[700px] flex justify-center">
                <div className="absolute inset-0">
                  <img
                    src={snapshotAsset[cardSide]}
                    alt=""
                    className="w-[375px] h-[375px] md:w-[630px] md:h-[630px] xl:w-[700px] xl:h-[700px]"
                  />
                </div>
              </div>
            ) : (
              !assetUrl && (
                <div className="absolute w-[375px] h-[375px] md:w-[630px] md:h-[630px] lg:w-[550px] lg:h-[550px] xl:w-[700px] xl:h-[700px] flex justify-center">
                  <div className="absolute inset-0">
                    <img
                      src={apparelList[selectedCard.id].apparel[cardSide][color]}
                      alt=""
                      className="w-[375px] h-[375px] md:w-[630px] md:h-[630px] lg:w-[550px] lg:h-[550px] xl:w-[700px] xl:h-[700px]"
                    />
                  </div>
                  <div className={`${styles.dropArea}`}>
                    <Dropzone
                      onDrop={acceptedFiles => {
                        acceptedFiles.length !== 0 && setAssetUrl(URL.createObjectURL(acceptedFiles[0]))
                      }}
                      onDropRejected={rejectedFiles => {}}
                      maxFiles={1}
                      accept={{ 'image/jpeg': [], 'image/png': [] }}
                      maxSize={31457280}
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
              )
            )}

            {/* <div className={styles.infoLabel}>
            <div>
              <div className="flex gap-[3px]">
                <div className={styles.printQulity}>Print quality:</div>
                <div className={styles.printDPI}>Good / 481 DPI</div>
              </div>
              <div className="flex gap-[15px] mt-[15px]">
                <div className="flex gap-[3px]">
                  <div className={styles.printQulity}>Width</div>
                  <div className={styles.printText}>{apparelList[selectedCard.id].apparel.width}</div>
                </div>
                <div className="flex gap-[3px]">
                  <div className={styles.printQulity}>Height</div>
                  <div className={styles.printText}>{apparelList[selectedCard.id].apparel.height}</div>
                </div>
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </div>
      {/************* Mobile ************/}
      <div className="w-full bloack lg:hidden mt-[15px]">
        <div>
          <div className="w-full mt-[15px]">
            <div className={styles.technique}>Technique</div>
            <div className="w-full mt-[10px] flex gap-[15px]">
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
                Direct to Garment
              </div>
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
            </div>
          </div>
          <div className="w-full mt-[20px]">
            <div className={styles.technique}>Color</div>
            <div className="w-full mt-[10px] flex gap-[12px]">
              <div
                className={`${styles.whiteColor} ${color === 'white' && styles.selectedColor}`}
                onClick={() => {
                  if (isSaved()) {
                    setQuestionType('color_white')
                    setShowQuestionModal(true)
                  } else {
                    setColor('white')
                  }
                }}
              ></div>
              <div
                className={`${styles.blackColor} ${color === 'black' && styles.selectedColor}`}
                onClick={() => {
                  if (isSaved()) {
                    setQuestionType('color_black')
                    setShowQuestionModal(true)
                  } else {
                    setColor('black')
                  }
                }}
              ></div>
            </div>
          </div>

          <div className={`${styles.technique} mt-[28px]`}>Placement</div>
          <div className="w-full flex gap-[9px] sm:mt-[15px] lg:mt-[10px] mt-[10px] mb-[200px] lg:mb-[0px]">
            <MerchDTGCard
              selected={cardSide === 'front'}
              image={
                snapshotAsset['front'].length > 0
                  ? snapshotAsset['front']
                  : apparelList[selectedCard.id].apparel.front[color]
              }
              side="front"
              type="DTG"
              technique={technique}
              onSelect={type => {
                setCardSide(type)
                if (technique === 'emb') setShowEmbPosModal(true)
              }}
            />
            <MerchDTGCard
              selected={cardSide === 'back'}
              image={
                snapshotAsset['back'].length > 0
                  ? snapshotAsset['back']
                  : apparelList[selectedCard.id].apparel.back[color]
              }
              side="back"
              type="DTG"
              label="+$5.95"
              technique={technique}
              onSelect={type => setCardSide(type)}
            />
            {technique === 'dtg' && apparelList[selectedCard.id].id === 4 ? (
              <></>
            ) : (
              <MerchDTGCard
                type={selectedCard.id}
                selected={cardSide === 'right'}
                image={
                  snapshotAsset['right'].length > 0
                    ? snapshotAsset['right']
                    : apparelList[selectedCard.id].apparel.right[color]
                }
                side="right"
                label="+$2.49"
                technique={technique}
                onSelect={type => setCardSide(type)}
              />
            )}
            {technique === 'dtg' && apparelList[selectedCard.id].id === 4 ? (
              <></>
            ) : (
              <MerchDTGCard
                type={selectedCard.id}
                selected={cardSide === 'left'}
                image={
                  snapshotAsset['left'].length > 0
                    ? snapshotAsset['left']
                    : apparelList[selectedCard.id].apparel.left[color]
                }
                side="left"
                label="+$2.49"
                technique={technique}
                onSelect={type => setCardSide(type)}
              />
            )}
          </div>
          {/* **************Buttons desktop************** */}
          <div className="w-full lg:block hidden">
            {showEmbPosModal ? (
              <div className={styles.embFrontContainer}>
                <div className="w-full flex justify-between">
                  <div className={styles.embFrontTitle}>Embroidery Placement</div>
                </div>
                <div className={styles.embFrontContent}>Which placement option would you like to use?</div>
                <div className="mt-[15px] flex gap-[16px] justify-end">
                  <div
                    className={`${styles.embFrontBtn} ${embPlace === 'left' ? styles.enabled : styles.disabled}`}
                    onClick={() => {
                      setEmbPlace('left')
                      setShowEmbPosModal(false)
                    }}
                  >
                    Left Chest
                  </div>
                  <div
                    className={`${styles.embFrontBtn} ${embPlace === 'center' ? styles.enabled : styles.disabled}`}
                    onClick={() => {
                      setEmbPlace('center')
                      setShowEmbPosModal(false)
                    }}
                  >
                    Center Chest
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div
                  className={`w-full ${
                    technique === 'dtg'
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
                      backgroundColor01="var(--main-icon-color)"
                      backgroundColor02="var(--main-icon-color)"
                      color="var(--background-main-color)"
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
          {(assetUrl || snapshotAsset[cardSide].length > 0) && (
            <div className={styles.buttonArea}>
              {showEmbPosModal ? (
                <div className={styles.embFrontContainer}>
                  <div className="w-full flex justify-between">
                    <div className={styles.embFrontTitle}>Embroidery Placement</div>
                  </div>
                  <div className={styles.embFrontContent}>Which placement option would you like to use?</div>
                  <div className="mt-[15px] flex gap-[16px] justify-end">
                    <div
                      className={`${styles.embFrontBtn} ${embPlace === 'left' ? styles.enabled : styles.disabled}`}
                      onClick={() => {
                        setEmbPlace('left')
                        setShowEmbPosModal(false)
                      }}
                    >
                      Left Chest
                    </div>
                    <div
                      className={`${styles.embFrontBtn} ${embPlace === 'center' ? styles.enabled : styles.disabled}`}
                      onClick={() => {
                        setEmbPlace('center')
                        setShowEmbPosModal(false)
                      }}
                    >
                      Center Chest
                    </div>
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
                        backgroundColor01="var(--main-icon-color)"
                        backgroundColor02="var(--main-icon-color)"
                        color="var(--background-main-color)"
                        label="Save"
                        onClick={() => saveApparel()}
                        disabled={assetUrl === null}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
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
          if (type === 'technique_dtg') setTechnique('dtg')
          else if (type === 'technique_emb') setTechnique('emb')
          else if (type === 'color_white') setColor('white')
          else if (type === 'color_black') setColor('black')
        }}
      />
    </div>
  )
}

export default MerchDTGSection
