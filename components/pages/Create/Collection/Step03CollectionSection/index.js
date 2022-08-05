import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'

// components
import Chip from 'components/Chip'
import CollectionStepper from 'components/Stepper/CollectionStepper'
import Input from 'components/Input'
import Button from 'components/Button'
import IconButton from 'components/Button/IconButton'
import GradientButton from 'components/Button/GradientButton'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import EditorGrayIcon from 'assets/icons/editor-gray.svg'
import FullScreenGrayIcon from 'assets/icons/full-screen-gray.svg'
import TrashGrayIcon from 'assets/icons/trash-gray.svg'

// json
import CollectionDimensionList from 'assets/json/nft-dimension-list.json'
import CategoryList from 'assets/json/category-list.json'

// styles
import styles from './index.module.scss'

const Step03CollectionSection = props => {
  const { viewport, currentStep, onChangeCurrentStep, coverImage } = props

  const [screenWidth, setScreenWidth] = useState(1920)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  const [artWidth, setArtWidth] = useState(0)
  const [artHeight, setArtHeight] = useState(0)

  useEffect(() => {
    console.log('=====')
    let width = 0
    let ratio = 194 / 758
    switch (viewport) {
      case '2xl':
        width = screenWidth / 2 - 150 - 80 - 32
        break
      case 'xl':
        width = screenWidth / 2 - 120 - 80 - 32
        break
      case 'lg':
        width = screenWidth / 2 - 100 - 50 - 32
        break
      default:
        width = screenWidth - 60
        break
    }

    if (width > 487) {
      setArtWidth(487)
      setArtHeight(487 * ratio)
    } else {
      setArtWidth(width)
      setArtHeight(width * ratio)
    }
  }, [viewport, screenWidth])

  // variables
  const [disabledNextButton, setDisabledNextButton] = useState(true)

  const handleChangeCurrentStep = step => {
    handleFormValidate(step)
    onChangeCurrentStep(step)
  }

  const [banner, setBanner] = useState()

  useEffect(() => {
    if (banner !== undefined) {
      setDisabledNextButton(false)
    }
  }, [banner])

  const [royalties, setRoyalties] = useState('')

  // form validate
  const handleFormValidate = () => {}

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="relative w-full grid grid-cols-12 gap-0">
          {/* left part */}
          <div className={styles.topLeftEllipse}>
            <Image src={EllipseGreen} alt="" objectFit="cover" />
          </div>
          <div className="col-span-12 lg:col-span-6 g-left-container">
            <div className={styles.leftContainer}>
              <div className={`${styles.title} w-full`}>Preview Collection</div>
              <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
                {/* banner image */}
                <div className={styles.bannerImageArea}>
                  {banner !== undefined ? (
                    <Image
                      src={URL.createObjectURL(banner[0])}
                      alt=""
                      width={758}
                      height={194}
                      layout="responsive"
                      objectFit="cover"
                      className="rounded-[20px]"
                    />
                  ) : (
                    <div style={{ width: artWidth, height: artHeight }} />
                  )}
                  <div className="absolute left-0 -bottom-[100px] w-full flex justify-center">
                    <div className={styles.coverImageArea}>
                      <Image
                        src={URL.createObjectURL(coverImage[0])}
                        alt=""
                        width={150}
                        height={150}
                        layout="responsive"
                        objectFit="cover"
                        className="rounded-[6px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-end gap-8 mt-2">
                <IconButton
                  icon={EditorGrayIcon}
                  onClick={() => {}}
                  backgroundColor="transparent"
                  width="32px"
                  height="32px"
                />
                <IconButton
                  icon={TrashGrayIcon}
                  onClick={() => onChangeCollectionFiles([])}
                  backgroundColor="transparent"
                  width="32px"
                  height="32px"
                />
              </div>
            </div>
          </div>
          {/* right part */}
          <div className="col-span-12 lg:col-span-6 g-right-container z-0">
            <div className={styles.rightContainer}>
              <div className="w-full relative">
                <div className="w-full">
                  <CollectionStepper
                    currentStep={currentStep}
                    onChange={step => handleChangeCurrentStep(step)}
                    viewport={viewport}
                  />
                </div>
                <div className="w-full">
                  <div className={`${styles.subTitle} mt-10`}>Cover *</div>
                  <div className="mt-5">
                    <Dropzone onDrop={acceptedFiles => setBanner(acceptedFiles)}>
                      {({ getRootProps, getInputProps }) => (
                        <section className={styles.dropzone}>
                          <div {...getRootProps()} className={styles.selectArea}>
                            <input {...getInputProps()} />
                            <p className={styles.subTitle}>Upload Here</p>
                            <p className={styles.text}>Supported File Formats .png .jpeg .mp4 and .gif</p>
                            <p className={styles.greenText}>Max File Size 30mb</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                  <div className={`${styles.subTitle} mt-20`}>Royalties *</div>
                  <div className="max-w-[370px] w-full mt-5">
                    <Input
                      value={royalties}
                      placeholder="Insert a royalty percentage"
                      label="From 1 to 20%"
                      onChange={value => setRoyalties(value)}
                    />
                  </div>
                  <div className="w-full mt-16">
                    {royalties === '' ? (
                      <Button label="Mint Collection" disabled={disabledNextButton} backgroundColor="#888A8E" />
                    ) : (
                      <GradientButton
                        label="Mint Collection"
                        onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
                      />
                    )}
                  </div>
                </div>
                <div className="w-full h-32" />
                <div className="absolute bottom-0 w-full flex justify-between">
                  <Button
                    label="Back"
                    onClick={() => handleChangeCurrentStep(currentStep - 1)}
                    backgroundColor="#378287"
                    color="#EFF0F6"
                    height="53px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // mobile part
        <div className="g-container mt-[26px] mb-[47px]">
          {/* CollectionStepper part */}
          <div className="w-full">
            <CollectionStepper
              currentStep={currentStep}
              onChange={step => handleChangeCurrentStep(step)}
              viewport={viewport}
            />
          </div>
          <div className={`${styles.title} w-full`}>Preview Collection</div>

          <div className="w-full flex flex-wrap justify-center mt-[22px]">{/* banner part */}</div>

          <div className="w-full">
            <div className={`${styles.subTitle} mt-10`}>Cover *</div>
            <div className="mt-5">
              <Dropzone onDrop={acceptedFiles => setBanner(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <section className={styles.dropzone}>
                    <div {...getRootProps()} className={styles.selectArea}>
                      <input {...getInputProps()} />
                      <p className={styles.subTitle}>Upload Here</p>
                      <p className={styles.text}>
                        Supported File Formats
                        <br />
                        .png .jpeg .mp4 and .gif
                      </p>
                      <p className={styles.greenText}>Max File Size 30mb</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
            <div className={`${styles.subTitle} mt-5`}>Royalties *</div>
            <div className="max-w-[370px] w-full mt-4">
              <Input
                value={royalties}
                placeholder="Insert a royalty percentage"
                label="From 1 to 20%"
                onChange={value => setRoyalties(value)}
              />
            </div>
            <div className="w-full mt-10">
              {royalties === '' ? (
                <Button label="Mint Collection" fullWidth disabled={disabledNextButton} backgroundColor="#888A8E" />
              ) : (
                <GradientButton
                  label="Mint Collection"
                  onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
                  fullWidth
                />
              )}
            </div>
          </div>

          <div className="w-full flex justify-between my-10">
            <div className="w-[161px]">
              <Button
                label="Back"
                onClick={() => handleChangeCurrentStep(currentStep - 1)}
                fullWidth
                height="45px"
                backgroundColor="#378287"
                color="#EFF0F6"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step03CollectionSection
