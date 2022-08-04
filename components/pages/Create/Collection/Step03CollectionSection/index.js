import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'
import Image from 'next/image'

// third party components
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import Chip from 'components/Chip'
import CollectionStepper from 'components/Stepper/CollectionStepper'
import Select from 'components/Select'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'
import Checkbox from 'components/Checkbox'
import Radio from 'components/Radio'
import CategoryListModal from 'components/Modal/CategoryListModal'
import SuccessMintCollectionSection from 'components/pages/Create/Collection/SuccessMintCollectionSection'

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
import IconButton from 'components/Button/IconButton'

const Step03CollectionSection = props => {
  const { viewport, currentStep, onChangeCurrentStep } = props
  const [screenWidth, setScreenWidth] = useState(1920)
  const [screenHeight, setScreenHeight] = useState(1080)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    setScreenHeight(window.innerHeight)
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
      setScreenHeight(window.innerHeight)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  // variables
  const [disabledNextButton, setDisabledNextButton] = useState(true)

  const handleChangeCurrentStep = step => {
    handleFormValidate(step)
    onChangeCurrentStep(step)
  }
  // step 1
  const [selectedDimension, setSelectedDimension] = useState(CollectionDimensionList[0])
  const [artWidth, setArtWidth] = useState(0)
  const [artHeight, setArtHeight] = useState(0)

  useEffect(() => {
    let width = 0
    let ratio = 1920 / 1920
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
        switch (selectedDimension.id) {
          case 0:
            width = screenWidth - 140
            break
          case 1:
            width = screenWidth - 60
            break
          case 2:
            width = screenWidth - 80
            break
          case 3:
            width = screenWidth - 225
            break
          case 4:
            width = screenWidth - 180
            break
        }
        break
    }
    switch (selectedDimension.id) {
      case 0:
        ratio = 1920 / 1920
        if (width > 672) {
          setArtWidth(672)
          setArtHeight(672 * ratio)
        } else {
          setArtWidth(width)
          setArtHeight(width * ratio)
        }
        break
      case 1:
        ratio = 1080 / 1920
        if (width > 636) {
          setArtWidth(636)
          setArtHeight(636 * ratio)
        } else {
          setArtWidth(width)
          setArtHeight(width * ratio)
        }
        break
      case 2:
        ratio = 1440 / 1920
        if (width > 636) {
          setArtWidth(636)
          setArtHeight(636 * ratio)
        } else {
          setArtWidth(width)
          setArtHeight(width * ratio)
        }
        break
      case 3:
        ratio = 1920 / 1080
        if (width > 366) {
          setArtWidth(366)
          setArtHeight(366 * ratio)
        } else {
          setArtWidth(width)
          setArtHeight(width * ratio)
        }
        break
      case 4:
        ratio = 1920 / 1440
        if (width > 487) {
          setArtWidth(487)
          setArtHeight(487 * ratio)
        } else {
          setArtWidth(width)
          setArtHeight(width * ratio)
        }
        break
    }
  }, [viewport, selectedDimension, screenWidth])

  const [collectionArt, setCollectionArt] = useState()

  useEffect(() => {
    if (collectionArt !== undefined) {
      setDisabledNextButton(false)
    }
  }, [collectionArt])

  const handleFullScreen = useFullScreenHandle()
  const [fullScreenMode, setFullScreenMode] = useState(false)

  const fullScreenToggler = () => {
    if (!fullScreenMode) {
      handleFullScreen.enter()
    }
  }

  const onFullScreenChange = (state, handle) => {
    setFullScreenMode(state)
  }

  // step 2
  const [collectionName, setCollectionName] = useState('')
  const [description, setDescription] = useState('')
  const [categoryList, setCategoryList] = useState([])
  const [showCategoryList, setShowCategoryList] = useState(false)

  useEffect(() => {
    let array = []
    CategoryList.map(item => {
      let object = item
      object.checked = false
      array.push(object)
    })
    setCategoryList(array)
  }, [])

  const handleSelectCategory = index => {
    let array = [...categoryList]
    array[index].checked = !array[index].checked
    setCategoryList(array)
  }

  const handleCancelCategory = () => {
    let array = [...categoryList]
    array.map(item => {
      item.checked = false
    })
    setCategoryList(categoryList => [...categoryList, array])
    setShowCategoryList(false)
  }

  useEffect(() => {
    let count = 0
    categoryList.map(item => {
      if (item.checked === true) count++
    })

    if (collectionName !== '' && description !== '' && count !== 0) {
      setDisabledNextButton(false)
    } else {
      setDisabledNextButton(true)
    }
  }, [collectionName, description, categoryList])

  // step 3
  const [royalties, setRoyalties] = useState('')

  // form validate
  const handleFormValidate = step => {
    switch (step) {
      case 1:
        if (collectionArt !== undefined) {
          setDisabledNextButton(false)
        } else {
          setDisabledNextButton(true)
        }
        break
      case 2:
        let count = 0
        categoryList.map(item => {
          if (item.checked === true) count++
        })

        if (collectionName !== '' && description !== '' && count !== 0) {
          setDisabledNextButton(false)
        } else {
          setDisabledNextButton(true)
        }
        break
      case 3:
        setDisabledNextButton(true)
        break
      default:
        break
    }
  }

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
                <FullScreen onChange={onFullScreenChange} handle={handleFullScreen} className="flex justify-center">
                  {fullScreenMode && (
                    <AvatarEditor
                      image={collectionArt !== undefined && collectionArt[0]}
                      width={screenHeight - 36}
                      height={screenHeight - 36}
                      border={16}
                      borderRadius={12}
                      color={[77, 92, 94, 1]} // RGBA
                      scale={1}
                      rotate={0}
                    />
                  )}
                </FullScreen>
                <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }}>
                  {collectionArt !== undefined && artWidth !== 0 && artHeight !== 0 ? (
                    <AvatarEditor
                      image={collectionArt[0]}
                      width={artWidth - 32}
                      height={artHeight - 32}
                      border={16}
                      borderRadius={16}
                      color={[77, 92, 94, 1]} // RGBA
                      scale={1}
                      rotate={0}
                    />
                  ) : (
                    <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }} />
                  )}
                </div>
                {collectionArt !== undefined && (
                  <div className="w-full mt-4 flex justify-between" style={{ width: artWidth }}>
                    <IconButton icon={EditorGrayIcon} onClick={() => {}} backgroundColor="transparent" />
                    <IconButton
                      icon={FullScreenGrayIcon}
                      onClick={() => fullScreenToggler()}
                      backgroundColor="transparent"
                    />
                    <IconButton icon={TrashGrayIcon} onClick={() => setCollectionArt()} backgroundColor="transparent" />
                  </div>
                )}
              </div>
              <div className={`w-full flex justify-center items-center mt-[35px] ${styles.collectionName}`}>
                {collectionName}
              </div>
              {description !== '' && (
                <div className={`w-full flex flex-wrap justify-start items-center mt-7 ${styles.descriptionArea}`}>
                  <div className={`${styles.descriptionTitle} w-full`}>Description</div>
                  <div className={styles.descriptionText}>{description}</div>
                </div>
              )}
              {categoryList.length !== 0 && (
                <div className="w-full flex flex-wrap justify-start items-center mt-[33px] gap-[10px]">
                  {categoryList.map((item, index) => item.checked === true && <Chip label={item.label} key={index} />)}
                </div>
              )}
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
                    <Dropzone onDrop={acceptedFiles => setCollectionArt(acceptedFiles)}>
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
                  />
                  <GradientButton
                    label="Next Step"
                    onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
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

          <div className="w-full flex flex-wrap justify-center mt-[22px]">
            <FullScreen onChange={onFullScreenChange} handle={handleFullScreen} className="flex justify-center">
              {fullScreenMode && (
                <AvatarEditor
                  image={collectionArt !== undefined && collectionArt[0]}
                  width={screenHeight - 36}
                  height={screenHeight - 36}
                  border={6}
                  borderRadius={12}
                  color={[77, 92, 94, 1]} // RGBA
                  scale={1}
                  rotate={0}
                />
              )}
            </FullScreen>
            <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }}>
              {collectionArt !== undefined && artWidth !== 0 && artHeight !== 0 ? (
                <AvatarEditor
                  image={collectionArt[0]}
                  width={artWidth - 16}
                  height={artHeight - 16}
                  border={8}
                  borderRadius={8}
                  color={[77, 92, 94, 1]} // RGBA
                  scale={1}
                  rotate={0}
                />
              ) : (
                <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }} />
              )}
            </div>
            {collectionArt !== undefined && (
              <div className="w-full mt-4 flex justify-center">
                <div className="flex justify-between" style={{ width: artWidth }}>
                  <IconButton
                    icon={EditorGrayIcon}
                    onClick={() => {}}
                    backgroundColor="transparent"
                    width="32px"
                    height="32px"
                  />
                  <IconButton
                    icon={FullScreenGrayIcon}
                    onClick={() => fullScreenToggler()}
                    backgroundColor="transparent"
                    width="32px"
                    height="32px"
                  />
                  <IconButton
                    icon={TrashGrayIcon}
                    onClick={() => setCollectionArt()}
                    backgroundColor="transparent"
                    width="32px"
                    height="32px"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="w-full">
            <div className={`${styles.subTitle} mt-10`}>Cover *</div>
            <div className="mt-5">
              <Dropzone onDrop={acceptedFiles => setCollectionArt(acceptedFiles)}>
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
