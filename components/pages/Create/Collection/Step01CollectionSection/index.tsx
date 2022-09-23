import React, { useEffect, useState } from 'react'

// third party components
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { limit } from 'utils/strings'

// components
import Chip from 'components/Chip'
import CollectionStepper from 'components/Stepper/CollectionStepper'
import Select from 'components/Select'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'
import CheckboxGroup from 'components/Checkbox/CheckboxGroup'
import Radio from 'components/Radio'
import CategoryListModal from 'components/Modal/CategoryListModal'
// custom functions
import { useViewport } from 'utils'

// images and icons
import EditorGrayIcon from 'assets/icons/editor-gray.svg'
import FullScreenGrayIcon from 'assets/icons/full-screen-gray.svg'
import TrashGrayIcon from 'assets/icons/trash-gray.svg'

// json
import CollectionDimensionList from 'assets/json/nft-dimension-list.json'
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'
import IconButton from 'components/Button/IconButton'

const Step01CollectionSection = props => {
  const {
    currentStep,
    onChangeCurrentStep,
    collectionName,
    onChangeCollectionName,
    description,
    onChangeDescription,
    dimension,
    onChangeDimension,
    coverImage,
    onChangeCoverImage,
    categoryList,
    onChangeCategoryList,
  } = props
  const viewport = useViewport()

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
    handleFormValidate()
    onChangeCurrentStep(step)
  }
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
        switch (dimension.id) {
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
    switch (dimension.id) {
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
  }, [viewport, dimension, screenWidth])

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

  const [showCategoryList, setShowCategoryList] = useState(false)

  const handleSelectCategory = index => {
    let array = [...categoryList]
    let checkedCount = 0
    array.map(item => {
      if (item.checked === true) {
        checkedCount++
      }
    })

    if (checkedCount >= 3 && array[index].checked === false) return

    array[index].checked = !array[index].checked
    onChangeCategoryList(array)
  }

  const handleCancelCategory = () => {
    let array = [...categoryList]
    array.map(item => {
      item.checked = false
    })
    onChangeCategoryList(array)
  }

  useEffect(() => {
    let count = 0
    categoryList.map(item => {
      if (item.checked === true) count++
    })

    if (collectionName !== '' && description !== '' && count > 0 && count <= 3 && coverImage !== undefined) {
      setDisabledNextButton(false)
    } else {
      setDisabledNextButton(true)
    }
  }, [collectionName, description, coverImage, categoryList])

  // form validate
  const handleFormValidate = () => {
    let count = 0
    categoryList.map(item => {
      if (item.checked === true) count++
    })
    if (collectionName !== '' && description !== '' && count > 0 && count <= 3 && coverImage !== undefined) {
      setDisabledNextButton(false)
    } else {
      setDisabledNextButton(true)
    }
  }

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="w-full grid grid-cols-12 gap-0">
          {/* left part */}
          <div className="relative col-span-12 lg:col-span-6 g-left-container">
            <div className={styles.leftContainer}>
              <div className={`${styles.title} w-full`}>Preview Collection Cover</div>
              <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
                <FullScreen onChange={onFullScreenChange} handle={handleFullScreen} className="flex justify-center">
                  {fullScreenMode && coverImage !== undefined && (
                    <AvatarEditor
                      image={coverImage[0]}
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
                  {coverImage !== undefined && artWidth !== 0 && artHeight !== 0 ? (
                    <AvatarEditor
                      image={coverImage[0]}
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
                {coverImage !== undefined && (
                  <div className="w-full mt-4 flex justify-between" style={{ width: artWidth }}>
                    <IconButton icon={EditorGrayIcon} onClick={() => {}} backgroundColor="transparent" />
                    <IconButton
                      icon={FullScreenGrayIcon}
                      onClick={() => fullScreenToggler()}
                      backgroundColor="transparent"
                    />
                    <IconButton
                      icon={TrashGrayIcon}
                      onClick={() => onChangeCoverImage()}
                      backgroundColor="transparent"
                    />
                  </div>
                )}
              </div>
              <div className={`w-full flex break-all justify-center items-center mt-[35px] ${styles.collectionName}`}>
                {collectionName}
              </div>
              {description !== '' && (
                <div
                  className={`w-full flex break-all flex-wrap justify-start items-center mt-7 ${styles.descriptionArea}`}
                >
                  <div className={`${styles.descriptionTitle} w-full`}>Description</div>
                  <div className={styles.descriptionText}>{description}</div>
                </div>
              )}
              {categoryList.length !== 0 && (
                <div className="w-full flex flex-wrap justify-start items-center mt-[33px] gap-[10px]">
                  {categoryList.map((item, index) => item.checked === true && <Chip label={item.name} key={index} />)}
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
                    // onChange={step => handleChangeCurrentStep(step)}
                  />
                </div>
                {/* upload artwork part */}
                <div className="w-full">
                  <div className={`${styles.subTitle} mt-[75px]`}>Collection Name *</div>
                  <div className="max-w-[370px] w-full mt-5">
                    <Input
                      value={limit(collectionName, 20)}
                      placeholder="Give your art name"
                      label01="Max Characters 20"
                      label02={20 - collectionName.length === 20 ? '' : `${20 - collectionName.length} Characters left`}
                      onChange={value => onChangeCollectionName(limit(value, 20))}
                    />
                  </div>
                  <div className={`${styles.subTitle} mt-10`}>Description *</div>
                  <div className="w-full mt-5">
                    <Textarea
                      value={limit(description, 150)}
                      placeholder="Add a short description..."
                      label01="Max Characters 150"
                      label02={150 - description.length === 150 ? '' : `${150 - description.length} Characters left`}
                      onChange={value => onChangeDescription(value)}
                    />
                  </div>
                  <div className={`${styles.subTitle} mt-10`}>Collection Dimensions *</div>
                  <div className="max-w-[370px] w-full mt-5">
                    <Select
                      data={CollectionDimensionList}
                      selected={dimension}
                      onChange={item => onChangeDimension(item)}
                    />
                  </div>
                  <div className={`${styles.subTitle} mt-10`}>Cover Image *</div>
                  <div className="mt-5">
                    <Dropzone onDrop={acceptedFiles => onChangeCoverImage(acceptedFiles)} maxFiles={1}>
                      {({ getRootProps, getInputProps }) => (
                        <section className={styles.dropzone}>
                          <div {...getRootProps()} className={styles.selectArea}>
                            <input {...getInputProps()} />
                            <p className={styles.subTitle}>Upload Here</p>
                            <p className={styles.text}>Supported File Formats .png .jpeg .mp4, .mp3 and .gif</p>
                            <p className={styles.greenText}>Max File Size 30mb</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                  <div className={`${styles.subTitle} mt-10`}>Categories (max. 3) *</div>
                  <div className="w-full mt-5">
                    <CheckboxGroup categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
                  </div>
                </div>
                <div className="w-full h-32" />
                <div className="absolute bottom-0 w-full flex justify-between">
                  <div />
                  {disabledNextButton ? (
                    <Button
                      width={viewport === '2xl' ? 124 : 117}
                      height={viewport === '2xl' ? 53 : 46}
                      label="Next Step"
                      disabled={disabledNextButton}
                      backgroundColor="#888A8E"
                    />
                  ) : (
                    <GradientButton
                      width={viewport === '2xl' ? 124 : 117}
                      height={viewport === '2xl' ? 53 : 46}
                      label="Next Step"
                      onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
                    />
                  )}
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
              // onChange={step => handleChangeCurrentStep(step)}
            />
          </div>
          <div className={`${styles.title} w-full`}>Preview Collection Cover</div>

          <div className="w-full flex flex-wrap justify-center mt-[22px]">
            <FullScreen onChange={onFullScreenChange} handle={handleFullScreen} className="flex justify-center">
              {fullScreenMode && (
                <AvatarEditor
                  image={coverImage !== undefined && coverImage[0]}
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
              {coverImage !== undefined && artWidth !== 0 && artHeight !== 0 ? (
                <AvatarEditor
                  image={coverImage[0]}
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
            {coverImage !== undefined && (
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
                    onClick={() => onChangeCoverImage()}
                    backgroundColor="transparent"
                    width="32px"
                    height="32px"
                  />
                </div>
              </div>
            )}
          </div>
          {/* upload artwork part */}
          <div className="w-full">
            <div className={`${styles.subTitle} mt-5`}>Collection Name *</div>
            <div className="max-w-[370px] w-full mt-4">
              <Input
                value={limit(collectionName, 20)}
                placeholder="Give your art name"
                label01="Max Characters 20"
                label02={20 - collectionName.length === 20 ? '' : `${20 - collectionName.length} Characters left`}
                onChange={value => onChangeCollectionName(limit(value, 20))}
              />
            </div>
            <div className={`${styles.subTitle} mt-5`}>Description *</div>
            <div className="w-full mt-5">
              <Textarea
                value={limit(description, 150)}
                placeholder="Add a short description..."
                label01="Max Characters 150"
                label02={150 - description.length === 150 ? '' : `${150 - description.length} Characters left`}
                onChange={value => onChangeDescription(value)}
              />
            </div>
            <div className={`${styles.subTitle} mt-8`}>Collection Dimensions *</div>
            <div className="max-w-[370px] w-full mt-5 pl-6">
              <Radio
                data={CollectionDimensionList}
                selected={dimension}
                onChange={item => onChangeDimension(item)}
                direction="rtl"
              />
            </div>
            <div className={`${styles.subTitle} mt-10`}>Art *</div>
            <div className="mt-5">
              <Dropzone onDrop={acceptedFiles => onChangeCoverImage(acceptedFiles)} maxFiles={1}>
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
            <div className={`${styles.subTitle} mt-5`}>Categories *</div>
            <div className="w-full mt-4">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1">
                  <GradientButton
                    fullWidth
                    label="Choose Category"
                    onClick={() => setShowCategoryList(true)}
                    height="45px"
                  />
                </div>
              </div>
              {showCategoryList && (
                <CategoryListModal
                  data={CategoryList}
                  categoryList={categoryList}
                  onChange={index => handleSelectCategory(index)}
                  onClick={() => setShowCategoryList(!showCategoryList)}
                  onClickCancel={() => handleCancelCategory()}
                />
              )}
            </div>
          </div>

          <div className="w-full flex justify-between my-10">
            {/* button group part */}
            {disabledNextButton ? (
              <div className="w-full">
                <Button
                  fullWidth
                  label="Next Step"
                  disabled={disabledNextButton}
                  backgroundColor="#888A8E"
                  height="45px"
                />
              </div>
            ) : (
              <div className="w-full">
                <GradientButton
                  fullWidth
                  label="Next Step"
                  onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
                  height="45px"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Step01CollectionSection
