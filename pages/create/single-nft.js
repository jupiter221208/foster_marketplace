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
import Stepper from 'components/Stepper'
import Select from 'components/Select'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'
import IconButton from 'components/Button/IconButton'
import OutlineButton from 'components/Button/OutlineButton'
import CheckboxGroup from 'components/Checkbox/CheckboxGroup'
import Radio from 'components/Radio'
import LinkTextButton from 'components/Button/LinkTextButton'
import CategoryListModal from 'components/Modal/CategoryListModal'
import TweetMintButton from 'components/Button/TweetMintButton'
import MintOutlineButton from 'components/Button/MintOutlineButton'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import EditorGrayIcon from 'assets/icons/editor-gray.svg'
import FullScreenGrayIcon from 'assets/icons/full-screen-gray.svg'
import TrashGrayIcon from 'assets/icons/trash-gray.svg'
import TwitterBackgroundBlackIcon from 'assets/icons/twitter-background-black.svg'

// json
import NFTDimensionList from 'assets/json/nft-dimension-list.json'
import CategoryList from 'assets/json/category-list.json'

// styles
import styles from './single-nft.module.scss'

const SingleNft = props => {
  const { viewport } = props
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

  const handleChangeCurrentStep = step => {
    handleFormValidate(step)
    setCurrentStep(step)
  }
  // step 1
  const [selectedDimension, setSelectedDimension] = useState(NFTDimensionList[0])
  const [artWidth, setArtWidth] = useState(0)
  const [artHeight, setArtHeight] = useState(0)

  function limit(string = '', limit = 0) {
    return string.substring(0, limit)
  }

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

  const [nftArt, setNftArt] = useState()

  useEffect(() => {
    if (nftArt !== undefined) {
      setDisabledNextButton(false)
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
  const [nftName, setNftName] = useState('')
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
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        currentStep !== 4 ? (
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
                      />
                    )}
                  </FullScreen>
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
                  {nftArt !== undefined && (
                    <div className="w-full mt-4 flex justify-between" style={{ width: artWidth }}>
                      {currentStep === 1 ? (
                        <IconButton icon={EditorGrayIcon} onClick={() => {}} backgroundColor="transparent" />
                      ) : (
                        <>&nbsp;</>
                      )}
                      <IconButton
                        icon={FullScreenGrayIcon}
                        onClick={() => fullScreenToggler()}
                        backgroundColor="transparent"
                      />
                      {currentStep === 1 ? (
                        <IconButton icon={TrashGrayIcon} onClick={() => setNftArt()} backgroundColor="transparent" />
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
                      (item, index) => item.checked === true && <Chip label={item.label} key={index} />
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
                      onChange={step => handleChangeCurrentStep(step)}
                      viewport={viewport}
                    />
                  </div>
                  {/* upload artwork part */}
                  {currentStep === 1 && (
                    <div className="w-full">
                      <div className={`${styles.subTitle} mt-20`}>NFT Dimensions *</div>
                      <div className="max-w-[370px] w-full mt-5">
                        <Select
                          data={NFTDimensionList}
                          selected={selectedDimension}
                          onChange={item => setSelectedDimension(item)}
                        />
                      </div>
                      <div className={`${styles.subTitle} mt-10`}>Art *</div>
                      <div className="mt-5">
                        <Dropzone onDrop={acceptedFiles => setNftArt(acceptedFiles)} maxFiles={1}>
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
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="w-full">
                      <div className={`${styles.subTitle} mt-20`}>NFT Name *</div>
                      <div className="max-w-[370px] w-full mt-5">
                        <Input
                          value={limit(nftName, 100)}
                          placeholder="Give your art name"
                          label="Max Characters 100"
                          onChange={value => setNftName(value)}
                        />
                      </div>
                      <div className={`${styles.subTitle} mt-20`}>Description *</div>
                      <div className="w-full mt-5">
                        <Textarea
                          value={limit(description, 300)}
                          placeholder="Add a short description..."
                          label="Max Characters 300"
                          onChange={value => setDescription(value)}
                        />
                      </div>
                      <div className={`${styles.subTitle} mt-20`}>Categories (max. 3) *</div>
                      <div className="w-full mt-5">
                        <CheckboxGroup categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
                      </div>
                    </div>
                  )}
                  {currentStep === 3 && (
                    <div className="w-full">
                      <div className={`${styles.subTitle} mt-20`}>Royalties *</div>
                      <div className="max-w-[370px] w-full mt-5">
                        <Input
                          value={royalties}
                          placeholder="Insert a royalty percentage"
                          label="From 1 to 20%"
                          type="number"
                          onChange={value => setRoyalties(value)}
                        />
                      </div>
                      {console.log(parseInt(royalties))}
                      <div className="w-full mt-16">
                        {royalties === '' || parseInt(royalties) < 1 || parseInt(royalties) > 20 ? (
                          <Button
                            width={viewport === '2xl' ? 124 : 117}
                            height={viewport === '2xl' ? 53 : 46}
                            label="Mint NFT"
                            disabled={disabledNextButton}
                            backgroundColor="#888A8E"
                          />
                        ) : (
                          <GradientButton
                            width={viewport === '2xl' ? 124 : 117}
                            label="Mint NFT"
                            onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
                          />
                        )}
                      </div>
                    </div>
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
        ) : (
          <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
            <div className={styles.topLeftEllipse}>
              <Image src={EllipseGreen} alt="" objectFit="cover" />
            </div>
            <div className="w-full flex justify-center items-center z-10">
              <div className="max-w-[392px] rounded-[16px] overflow-hidden mt-[82px]">
                <AvatarEditor
                  image={nftArt !== undefined && nftArt[0]}
                  width={screenWidth > 400 ? 360 : screenWidth - 72}
                  height={screenWidth > 400 ? 360 : screenWidth - 72}
                  border={16}
                  borderRadius={12}
                  color={[255, 255, 255, 0.5]} // RGBA
                  scale={1}
                  rotate={0}
                />
              </div>
            </div>
            <div className="max-w-[568px] mt-[62px] mb-[130px] flex flex-wrap justify-center z-10">
              <div className={styles.mintTitle}>Congratulations!</div>
              <div className={styles.mintText}>Your NFT has been minted successfully!</div>
              <div className="w-full flex justify-between gap-[30px] mt-[60px]">
                <div className="w-full">
                  <TweetMintButton
                    icon={TwitterBackgroundBlackIcon}
                    fullWidth
                    label="Tweet your Mint"
                    color="#202427"
                    backgroundColor="#378287"
                    onClick={() => {}}
                    direction="rtl"
                  />
                </div>
                <div className="w-full">
                  <MintOutlineButton
                    fullWidth
                    label="Mint another NFT"
                    backgroundColor="#63D6CD"
                    onClick={() => setCurrentStep(1)}
                    borderColor="#5AC3BA"
                  />
                </div>
              </div>
              <div className="mt-[44px]">
                <LinkTextButton label="View on Solscan" link="/" />
              </div>
            </div>
          </div>
        )
      ) : currentStep !== 4 ? (
        // mobile part
        <div className="g-container mt-[26px] mb-[47px]">
          {/* stepper part */}
          <div className="w-full">
            <Stepper currentStep={currentStep} onChange={step => handleChangeCurrentStep(step)} viewport={viewport} />
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
            <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }}>
              {nftArt !== undefined && artWidth !== 0 && artHeight !== 0 ? (
                <AvatarEditor
                  image={nftArt[0]}
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
                  <IconButton
                    icon={FullScreenGrayIcon}
                    onClick={() => fullScreenToggler()}
                    backgroundColor="transparent"
                    width="32px"
                    height="32px"
                  />
                  <IconButton
                    icon={TrashGrayIcon}
                    onClick={() => setNftArt()}
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
            <div className="w-full">
              <div className={`${styles.subTitle} mt-20`}>NFT Dimensions *</div>
              <div className="max-w-[370px] w-full mt-5 pl-6">
                <Radio
                  data={NFTDimensionList}
                  selected={selectedDimension}
                  onChange={item => setSelectedDimension(item)}
                  direction="rtl"
                />
              </div>
              <div className={`${styles.subTitle} mt-10`}>Art *</div>
              <div className="mt-5">
                <Dropzone onDrop={acceptedFiles => setNftArt(acceptedFiles)} maxFiles={1}>
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
            </div>
          )}

          {currentStep === 2 && (
            <div className="w-full">
              <div className={`${styles.subTitle} mt-5`}>NFT Name *</div>
              <div className="max-w-[370px] w-full mt-4">
                <Input
                  value={limit(nftName, 100)}
                  placeholder="Give your art name"
                  label="Max Characters 100"
                  onChange={value => setNftName(value)}
                />
              </div>
              <div className={`${styles.subTitle} mt-5`}>Description *</div>
              <div className="w-full mt-5">
                <Textarea
                  value={limit(description, 300)}
                  placeholder="Add a short description..."
                  label="Max Characters 300"
                  onChange={value => setDescription(value)}
                />
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
          )}

          {currentStep === 3 && (
            <div className="w-full">
              <div className={`${styles.subTitle} mt-5`}>Royalties *</div>
              <div className="max-w-[370px] w-full mt-4">
                <Input
                  value={royalties}
                  placeholder="Insert a royalty percentage"
                  label="From 1 to 20%"
                  type="tel"
                  onChange={value => setRoyalties(value)}
                />
              </div>
              <div className="w-full mt-10">
                {royalties === '' ? (
                  <Button label="Mint NFT" fullWidth disabled={disabledNextButton} backgroundColor="#888A8E" />
                ) : (
                  <GradientButton
                    label="Mint NFT"
                    onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
                    fullWidth
                  />
                )}
              </div>
            </div>
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
                    onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
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
                        onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
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
      ) : (
        // congratelations part
        <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
          <div className="w-full flex justify-center items-center z-10 mt-10">
            <div className="max-w-[237px] z-10">
              <div className="w-full rounded-[16px] overflow-hidden">
                {nftArt !== undefined ? (
                  <AvatarEditor
                    image={nftArt[0]}
                    width={225}
                    height={225}
                    border={6}
                    borderRadius={12}
                    color={[77, 92, 94, 1]} // RGBA
                    scale={1}
                    rotate={0}
                  />
                ) : (
                  <div className={styles.artArea} />
                )}
              </div>
            </div>
          </div>
          <div className="w-full mt-[60px] mb-[90px] flex flex-wrap justify-center z-10">
            <div className={styles.mintTitle}>Congratulations!</div>
            <div className={styles.mintText}>Your NFT has been minted successfully!</div>
            <div className="w-full flex flex-wrap justify-center gap-[30px] mt-[60px]">
              <div className="w-[221px]">
                <GradientButton
                  icon={TwitterBackgroundBlackIcon}
                  fullWidth
                  label="Tweet your Mint"
                  color="#202427"
                  backgroundColor="#378287"
                  height="45px"
                  onClick={() => {}}
                  direction="rtl"
                />
              </div>
              <div className="w-[221px]">
                <OutlineButton
                  fullWidth
                  label="Mint another NFT"
                  backgroundColor="#63D6CD"
                  height="45px"
                  onClick={() => setCurrentStep(1)}
                  borderColor="#5AC3BA"
                />
              </div>
            </div>
            <div className="mt-[33px]">
              <LinkTextButton label="View on Solscan" link="/" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SingleNft

SingleNft.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
