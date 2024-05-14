import React, { useState, useEffect } from 'react'
import { fabric } from 'fabric'
import Dropzone from 'react-dropzone'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// json
import apparelList from 'assets/json/merch-shop/merch-apparel-list.json'

// resources
import EditMerchAssetIcon from 'assets/icons/edit-merch-asset.svg?component'

// styles
import styles from './index.module.scss'
import MerchDTGCard from './MerchDTGCard'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

const MerchDTGSection = props => {
  const { selectedCard } = props
  const [canvas, setCanvas] = useState('')
  const [color, setColor] = useState('white')
  const [technique, setTechnique] = useState('dtg')
  const [cardSide, setCardSide] = useState('front')
  const [isDrawing, setIsDrawing] = useState(false)
  const [assetUrl, setAssetUrl] = useState<any>(null)

  const canvasId = 'canvas-mobile'

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

    let baseWidth = 700
    let assetWidth = apparelList[selectedCard.id].location.width
    let assetHeight = apparelList[selectedCard.id].location.height
    let assetTop = apparelList[selectedCard.id].location.top
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
                  left: (baseWidth - assetWidth) / 2,
                  width: assetWidth,
                  height: assetHeight,
                  fill: 'rgba(26, 26, 26, 0.5)',
                  angle: 0,
                  absolutePositioned: true,
                })
                img.clipPath = rectClippingPath
                img.scaleToWidth(assetWidth, false)
                img.set({
                  scaleX: assetWidth / width,
                  scaleY: assetWidth / width,
                  top: assetTop,
                  left: (baseWidth - assetWidth) / 2,
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
      <div className={styles.createDesign}>
        Create Design <span>*</span>
      </div>
      <div className={styles.garment}>
        Select the garments and colors you would like to make available for this apparel design.
      </div>
      <div className="w-full flex gap-[30px] mt-[45px]">
        <div className={styles.leftPanel}>
          <div className={styles.studioDesinger}>Studio Desinger</div>
          <div className="w-full mt-[39px]">
            <div className={styles.technique}>Technique</div>
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
          </div>
          <div className="flex justify-between mt-[45px]">
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
              <div
                style={{
                  width: apparelList[selectedCard.id].location.width,
                  height: apparelList[selectedCard.id].location.height,
                  marginTop: apparelList[selectedCard.id].location.top,
                }}
                className={`${styles.dropArea}`}
              >
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
                        <div className="flex flex-col items-center gap-[16px]">
                          <EditMerchAssetIcon alt="" />
                          <div className={styles.upload}>Upload Here</div>
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
    </div>
  )
}

export default MerchDTGSection
