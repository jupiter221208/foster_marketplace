import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'
import Image from 'next/image'

// third party components
import AvatarEditor from 'react-avatar-editor'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'

import Step01SingleNFTSection from 'components/pages/Create/SingleNFT/Step01SingleNFTSection'
import Step02SingleNFTSection from 'components/pages/Create/SingleNFT/Step02SingleNFTSection'
import Step03SingleNFTSection from 'components/pages/Create/SingleNFT/Step03SingleNFTSection'
import SuccessMintSingleNFTSection from 'components/pages/Create/SingleNFT/SuccessMintSingleNFTSection'

import Chip from 'components/Chip'
import Stepper from 'components/Stepper'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'
import IconButton from 'components/Button/IconButton'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'

// custom functions
import { useViewport } from 'utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import EditorGrayIcon from 'assets/icons/editor-gray.svg'
import FullScreenGrayIcon from 'assets/icons/full-screen-gray.svg'
import TrashGrayIcon from 'assets/icons/trash-gray.svg'

// json
import NFTDimensionList from 'assets/json/nft-dimension-list.json'
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './single-nft.module.scss'

const SingleNft = () => {
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
  const [currentStep, setCurrentStep] = useState(1)
  const [disabledNextButton, setDisabledNextButton] = useState(true)

  const [openNftImageEditorModal, setOpenNftImageEditorModal] = useState(false)
  // Range
  const [zoom, setZoom] = useState([1])

  // nft art editor
  const [avatarEditorReference, setAvatarEditorReference] = useState()
  const [croppedNftArt, setCroppedNftArt] = useState()
  const setAvatarEditorRef = (editor: any) => {
    if (editor) {
      setAvatarEditorReference(editor)
      const img = editor.getImageScaledToCanvas().toDataURL()
      setCroppedNftArt(img)
    }
  }

  const handleChangeCurrentStep = step => {
    setAvatarEditorRef(avatarEditorReference)
    handleFormValidate(step)
    setCurrentStep(step)
  }

  // step 1
  const [selectedDimension, setSelectedDimension] = useState(NFTDimensionList[0])
  const [NFTType, setNFTType] = useState('image')
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

  const [nftArt, setNftArt] = useState<any>()

  useEffect(() => {
    if (nftArt !== undefined) {
      setNFTType(nftArt[0].type.split('/')[0])
      setDisabledNextButton(false)
      setOpenNftImageEditorModal(true)
    }
  }, [nftArt])

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
  const [nftName, setNftName] = useState<any>('')
  const [description, setDescription] = useState<any>('')
  const [categoryList, setCategoryList] = useState<any[]>([])
  const [showCategoryList, setShowCategoryList] = useState<boolean>(false)

  useEffect(() => {
    let array: any[] = []
    CategoryList.map(item => {
      let object: any = item
      object.checked = false
      array.push(object)
    })
    setCategoryList(array)
  }, [])

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

    if (nftName !== '' && description !== '' && count !== 0) {
      setDisabledNextButton(false)
    } else {
      setDisabledNextButton(true)
    }
  }, [nftName, description, categoryList])

  // step 3
  const [royalties, setRoyalties] = useState('')

  // form validate
  const handleFormValidate = step => {
    switch (step) {
      case 1:
        if (nftArt !== undefined) {
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

        if (nftName !== '' && description !== '' && count !== 0) {
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
    <div className="w-full flex justify-center">
      <Head>
        <title>Foster Marketplace</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl'
        ? currentStep !== 4 && (
            <div className="w-full grid grid-cols-12 gap-0">
              {/* left part */}
              <div className="relative col-span-12 lg:col-span-6 g-left-container">
                <div className={styles.topLeftEllipse}>
                  <Image src={EllipseGreen} alt="" objectFit="cover" />
                </div>
                <div className={styles.leftContainer}>
                  <div className={`${styles.title} w-full`}>Preview Art</div>
                  <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
                    <FullScreen onChange={onFullScreenChange} handle={handleFullScreen} className="flex justify-center">
                      {fullScreenMode && (
                        <AvatarEditor
                          image={nftArt !== undefined && nftArt[0]}
                          width={screenHeight - 36}
                          height={screenHeight - 36}
                          border={16}
                          borderRadius={12}
                          color={[77, 92, 94, 1]} // RGBA
                          scale={1}
                          rotate={0}
                          ref={ref => setAvatarEditorRef(ref)}
                        />
                      )}
                    </FullScreen>
                    {NFTType === 'image' && (
                      <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }}>
                        {nftArt !== undefined && artWidth !== 0 && artHeight !== 0 ? (
                          <AvatarEditor
                            image={nftArt[0]}
                            width={artWidth - 32}
                            height={artHeight - 32}
                            border={16}
                            borderRadius={16}
                            color={[77, 92, 94, 1]} // RGBA
                            scale={1}
                            rotate={0}
                            ref={ref => setAvatarEditorRef(ref)}
                          />
                        ) : (
                          <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }} />
                        )}
                      </div>
                    )}
                    <div>
                      <img src={croppedNftArt} alt="" />
                    </div>
                    {NFTType === 'video' && (
                      <div className="w-full h-full">
                        <video controls className="w-full">
                          <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}

                    {NFTType === 'audio' && (
                      <div className="w-full my-20">
                        <audio controls className="w-full">
                          <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                          Your browser does not support the video tag.
                        </audio>
                      </div>
                    )}

                    {nftArt !== undefined && (
                      <div className="w-full mt-4 flex justify-between" style={{ width: artWidth }}>
                        {currentStep === 1 ? (
                          <IconButton
                            icon={EditorGrayIcon}
                            onClick={() => setAvatarEditorRef(avatarEditorReference)}
                            backgroundColor="transparent"
                          />
                        ) : (
                          <>&nbsp;</>
                        )}
                        {NFTType === 'image' && (
                          <IconButton
                            icon={FullScreenGrayIcon}
                            onClick={() => fullScreenToggler()}
                            backgroundColor="transparent"
                          />
                        )}
                        {currentStep === 1 ? (
                          <IconButton
                            icon={TrashGrayIcon}
                            onClick={() => {
                              setNftArt(null)
                              setNFTType('image')
                            }}
                            backgroundColor="transparent"
                          />
                        ) : (
                          <>&nbsp;</>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`w-full break-all flex justify-center items-center mt-[35px] ${styles.nftName}`}>
                    {nftName}
                  </div>
                  {description !== '' && (
                    <div className={`w-full flex flex-wrap justify-start items-center mt-7 ${styles.descriptionArea}`}>
                      <div className={`${styles.descriptionTitle} w-full`}>Description</div>
                      <div className={styles.descriptionText}>{description}</div>
                    </div>
                  )}
                  {categoryList.length !== 0 && (
                    <div className="w-full flex flex-wrap justify-start items-center mt-[33px] gap-[10px]">
                      {categoryList.map(
                        (item, index) => item.checked === true && <Chip label={item.name} key={index} />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* right part */}
              <div className="col-span-12 lg:col-span-6 g-right-container z-0">
                <div className={styles.rightContainer}>
                  <div className="w-full relative">
                    <div className="w-full">
                      <Stepper
                        currentStep={currentStep}
                        // onChange={step => handleChangeCurrentStep(step)}
                      />
                    </div>
                    {/* upload artwork part */}
                    {currentStep === 1 && (
                      <Step01SingleNFTSection
                        selectedDimension={selectedDimension}
                        setSelectedDimension={item => setSelectedDimension(item)}
                        setNftArt={item => setNftArt(item)}
                      />
                    )}
                    {currentStep === 2 && (
                      <Step02SingleNFTSection
                        nftName={nftName}
                        setNftName={value => setNftName(value)}
                        description={description}
                        setDescription={value => setDescription(value)}
                        categoryList={categoryList}
                        showCategoryList={showCategoryList}
                        setShowCategoryList={value => setShowCategoryList(value)}
                        handleSelectCategory={index => handleSelectCategory(index)}
                        handleCancelCategory={() => handleCancelCategory()}
                      />
                    )}
                    {currentStep === 3 && (
                      <Step03SingleNFTSection
                        royalties={royalties}
                        setRoyalties={value => setRoyalties(value)}
                        disabledNextButton={disabledNextButton}
                        handleChangeCurrentStep={() =>
                          handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)
                        }
                      />
                    )}
                    <div className="w-full h-32" />
                    <div className="absolute bottom-0 w-full flex justify-between">
                      {currentStep !== 1 ? (
                        <Button
                          label="Back"
                          onClick={() => handleChangeCurrentStep(currentStep - 1)}
                          backgroundColor="#378287"
                          color="#EFF0F6"
                          width={viewport === '2xl' ? 124 : 117}
                          height={viewport === '2xl' ? 53 : 46}
                        />
                      ) : (
                        <div />
                      )}
                      {currentStep < 3 &&
                        (disabledNextButton ? (
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
                            label="Next Step"
                            onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        : currentStep !== 4 && (
            // mobile part
            <div className="g-container mt-[26px] mb-[47px]">
              {/* stepper part */}
              <div className="w-full">
                <Stepper
                  currentStep={currentStep}
                  // onChange={step => handleChangeCurrentStep(step)}
                />
              </div>
              <div className={`${styles.title} w-full`}>Preview Art</div>

              <div className="w-full flex flex-wrap justify-center mt-[22px]">
                <FullScreen onChange={onFullScreenChange} handle={handleFullScreen} className="flex justify-center">
                  {fullScreenMode && (
                    <AvatarEditor
                      image={nftArt !== undefined && nftArt[0]}
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
                {NFTType === 'image' && (
                  <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }}>
                    {nftArt !== undefined && artWidth !== 0 && artHeight !== 0 ? (
                      <AvatarEditor
                        image={nftArt[0]}
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
                )}
                {NFTType === 'video' && (
                  <div className="w-full h-full">
                    <video controls className="w-full">
                      <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {NFTType === 'audio' && (
                  <div className="w-full my-20">
                    <audio controls className="w-full">
                      <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                      Your browser does not support the video tag.
                    </audio>
                  </div>
                )}
                {nftArt !== undefined && (
                  <div className="w-full mt-4 flex justify-center">
                    <div className="flex justify-between" style={{ width: artWidth }}>
                      <IconButton
                        icon={EditorGrayIcon}
                        onClick={() => {}}
                        backgroundColor="transparent"
                        width="32px"
                        height="32px"
                      />
                      {NFTType === 'image' && (
                        <IconButton
                          icon={FullScreenGrayIcon}
                          onClick={() => fullScreenToggler()}
                          backgroundColor="transparent"
                          width="32px"
                          height="32px"
                        />
                      )}
                      <IconButton
                        icon={TrashGrayIcon}
                        onClick={() => {
                          setNftArt(null)
                          setNFTType('image')
                        }}
                        backgroundColor="transparent"
                        width="32px"
                        height="32px"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* upload artwork part */}
              {currentStep === 1 && (
                <Step01SingleNFTSection
                  selectedDimension={selectedDimension}
                  setSelectedDimension={item => setSelectedDimension(item)}
                  setNftArt={item => setNftArt(item)}
                />
              )}

              {currentStep === 2 && (
                <Step02SingleNFTSection
                  nftName={nftName}
                  setNftName={value => setNftName(value)}
                  description={description}
                  categoryList={categoryList}
                  setDescription={value => setDescription(value)}
                  showCategoryList={showCategoryList}
                  setShowCategoryList={value => setShowCategoryList(value)}
                  handleSelectCategory={index => handleSelectCategory(index)}
                  handleCancelCategory={() => handleCancelCategory()}
                />
              )}

              {currentStep === 3 && (
                <Step03SingleNFTSection
                  royalties={royalties}
                  setRoyalties={value => setRoyalties(value)}
                  disabledNextButton={disabledNextButton}
                  handleChangeCurrentStep={() =>
                    handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)
                  }
                />
              )}

              <div className="w-full flex justify-between my-10">
                {/* button group part */}
                {currentStep === 1 &&
                  (disabledNextButton ? (
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
                        onClick={() => handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)}
                        height="45px"
                      />
                    </div>
                  ))}
                {currentStep === 2 && (
                  <div className="w-full grid grid-cols-2 gap-5">
                    <div className="col-span-1">
                      <Button
                        label="Back"
                        onClick={() => handleChangeCurrentStep(currentStep - 1)}
                        fullWidth
                        height="45px"
                        backgroundColor="#378287"
                        color="#EFF0F6"
                      />
                    </div>
                    <div className="col-span-1">
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
                            onClick={() => handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)}
                            height="45px"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
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
                )}
              </div>
            </div>
          )}
      {currentStep === 4 && (
        <SuccessMintSingleNFTSection
          NFTType={NFTType}
          nftArt={croppedNftArt}
          artWidth={artWidth}
          artHeight={artHeight}
        />
      )}
      <NftImageEditorModal
        open={openNftImageEditorModal}
        close={() => setOpenNftImageEditorModal(false)}
        nftImage={nftArt}
      />
    </div>
  )
}

export default SingleNft

SingleNft.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
