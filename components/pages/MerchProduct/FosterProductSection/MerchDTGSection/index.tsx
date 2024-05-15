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

const MerchDTGSection = props => {
  const { selectedCard } = props
  const [canvas, setCanvas] = useState('')
  const [color, setColor] = useState('white')
  const [technique, setTechnique] = useState('dtg')
  const [cardSide, setCardSide] = useState('front')
  const [isDrawing, setIsDrawing] = useState(false)
  const [assetUrl, setAssetUrl] = useState<any>(null)
  const [showInfoModal, setShowInfoModal] = useState(false)

  const canvasId = 'canvas-mobile'
  const alertId = 'alert-tech'
  useEffect(() => {
    document.getElementById(alertId).style.display = 'none'
  }, [])

  useEffect(() => {
    if (assetUrl) {
      drawApparel()
      return
    }
  }, [cardSide, assetUrl, color, selectedCard])

  const drawApparel = () => {
    if (isDrawing) return

    let newCanvas = canvas as fabric.Canvas
    if (newCanvas == '') {
      newCanvas = new fabric.Canvas(canvasId)
    } else {
      newCanvas.clear()
      newCanvas.renderAll()
    }

    let assetWidth = apparelList[selectedCard.id].location[technique][cardSide].width
    let assetHeight = apparelList[selectedCard.id].location[technique][cardSide].height
    let assetTop = apparelList[selectedCard.id].location[technique][cardSide].top
    let assetLeft = apparelList[selectedCard.id].location[technique][cardSide].left
    let angle = apparelList[selectedCard.id].location[technique][cardSide].angle
    let screenWidth = 700

    newCanvas.setDimensions({
      width: screenWidth,
      height: screenWidth,
    })

    if (!apparelList[selectedCard.id].apparel.hasOwnProperty(cardSide)) return

    setTimeout(() => {
      new fabric.Image.fromURL(apparelList[selectedCard.id].apparel[cardSide][color], img => {
        img.scale(screenWidth / 700, false)
        newCanvas.add(img)

        newCanvas.item(0).selectable = false
        if (assetUrl) {
          setTimeout(() => {
            new fabric.Image.fromURL(
              assetUrl,
              img => {
                const { width } = img.getOriginalSize()

                var rectClippingPath = new fabric.Rect({
                  top: assetTop,
                  left: assetLeft,
                  width: assetWidth,
                  height: assetHeight,
                  stroke: 'rgba(26, 26, 26, 0.5)',
                  angle: angle,
                  absolutePositioned: true,
                })
                img.clipPath = rectClippingPath
                img.scaleToWidth(assetWidth, false)
                img.set({
                  scaleX: assetWidth / width,
                  scaleY: assetWidth / width,
                  top: assetTop,
                  left: assetLeft,
                  angle: angle,
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
              },
              { crossOrigin: 'Anonymous' }
            )
          }, 500)
        }
      })
    }, 500)

    setCanvas(newCanvas)
  }

  return (
    <div className="w-full">
      <div className={styles.createDesign}>Create Design</div>
      <div className={styles.garment}>
        Select the printing technique and fabric color. Add your design, generate mockups, and showcase this merch in
        your studio store. You can place up to 4 different designs, but only 1 design (front or back) is included in the
        base price. Additional designs will include additional fees – please see&nbsp;
        <span onClick={() => setShowInfoModal(true)}>product extras and costs</span> for a breakdown of prices.
      </div>
      <div className="w-full flex gap-[30px] mt-[45px]">
        <div className={styles.leftPanel}>
          <div className={styles.studioDesinger}>Studio Designer</div>
          <div className="w-full mt-[39px]">
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
                onClick={() => setTechnique('dtg')}
              >
                Direct to Garment (DTG)
              </div>
              <div
                className={technique === 'emb' ? styles.selectedBtn : styles.unselectedBtn}
                onClick={() => setTechnique('emb')}
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
                onClick={() => setColor('white')}
              ></div>
              <div
                className={`${styles.blackColor} ${color === 'black' && styles.selectedColor}`}
                onClick={() => setColor('black')}
              ></div>
            </div>
          </div>
          <div className={styles.border} />
          <div className="flex justify-between mt-[45px]">
            <MerchDTGCard
              selected={cardSide === 'front'}
              image={apparelList[selectedCard.id].apparel.front[color]}
              side="front"
              type="DTG"
              onSelect={type => setCardSide(type)}
            />
            <MerchDTGCard
              selected={cardSide === 'back'}
              image={apparelList[selectedCard.id].apparel.back[color]}
              side="back"
              type="DTG"
              label="+$5.95"
              onSelect={type => setCardSide(type)}
            />
            {apparelList[selectedCard.id].apparel.hasOwnProperty('right') && (
              <MerchDTGCard
                selected={cardSide === 'right'}
                image={apparelList[selectedCard.id].apparel.right[color]}
                side="right"
                label="+$2.49"
                onSelect={type => setCardSide(type)}
              />
            )}
            {apparelList[selectedCard.id].apparel.hasOwnProperty('left') && (
              <MerchDTGCard
                selected={cardSide === 'left'}
                image={apparelList[selectedCard.id].apparel.left[color]}
                side="left"
                label="+$2.49"
                onSelect={type => setCardSide(type)}
              />
            )}
          </div>
          <div className="w-full mt-[45px]">
            <OutlineButton
              fullWidth
              height={50}
              fontSize={18}
              label="Clear"
              onClick={() => {
                let newCanvas = canvas as fabric.Canvas
                if (newCanvas == '') {
                  newCanvas = new fabric.Canvas(canvasId)
                } else {
                  newCanvas.clear()
                  newCanvas.renderAll()
                }
                setAssetUrl(null)
              }}
            />
          </div>
          <div className="w-full mt-[15px]">
            <GradientButton
              fullWidth
              height={50}
              fontSize={18}
              backgroundColor01="var(--main-icon-color)"
              backgroundColor02="var(--main-icon-color)"
              color="var(--background-main-color)"
              label="Save"
            />
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className="w-[700px] h-[700px]">
            <canvas id={canvasId} />
          </div>
          {!assetUrl && (
            <div className="absolute w-[700px] h-[700px] flex justify-center">
              <div className="absolute inset-0">
                <img
                  src={apparelList[selectedCard.id].apparel[cardSide][color]}
                  alt=""
                  className="w-[700px] h-[700px]"
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
                          <div className="w-[90px] h-[90px]">
                            <Lottie animationData={animationData} loop={true} />
                          </div>
                          <div className={styles.uploadText}>
                            Upload or drop
                            <br />
                            your design here
                          </div>
                        </div>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </div>
          )}
          <div className={styles.infoLabel}>
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
          </div>
        </div>
      </div>
      <MerchShopInfoModal
        open={showInfoModal}
        close={status => {
          setShowInfoModal(false)
        }}
      />
    </div>
  )
}

export default MerchDTGSection
