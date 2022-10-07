import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import Dropzone from 'react-dropzone'

// components
import CollectionStepper from 'components/Stepper/CollectionStepper'
import Button from 'components/Button'
import IconButton from 'components/Button/IconButton'
import GradientButton from 'components/Button/GradientButton'
import CollectionFilesModal from 'components/Modal/CollectionFilesModal'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'

// custom functions
import { useViewport } from 'utils'

// images and icons
import ArrowDownGreenIcon from 'assets/icons/arrow-down-green.svg'
import TrashGrayIcon from 'assets/icons/trash-gray.svg'
import EllipseGreen from 'assets/icons/ellipse-green.svg'


// styles
import styles from './index.module.scss'

const Step03CollectionSection = props => {
  const {
    currentStep,
    onChangeCurrentStep,
    dimension,
    coverImage,
    collectionFiles,
    banner,
    onChangeCollectionFiles,
    onRemoveCollectionFile,
    onChangeCollectionName,
    onChangeCollectionDescription,
    readFilesAndUplaod,
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
    onChangeCurrentStep(step)
  }
  // step 1
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

  useEffect(() => {
    if (collectionFiles.length !== 0) {
      let count = 0
      collectionFiles.map((item, index) => {
        if (item.name === '' || item.description === '') {
          count++
        }
      })

      if (count === 0) {
        setDisabledNextButton(false)
      } else {
        setDisabledNextButton(true)
      }
    }
  }, [collectionFiles])

  const [showMore, setShowMore] = useState(false)
  const [subCollectionFiles, setSubCollectionFiles] = useState<any>([])

  const [selectedCollectionFile, setSelectedCollectionFile] = useState<any>()

  useEffect(() => {
    if (collectionFiles.length !== 0) {
      setSelectedCollectionFile(collectionFiles[0])
    }
  }, [collectionFiles])

  useEffect(() => {
    if (collectionFiles.length !== 0) {
      setSubCollectionFiles(collectionFiles.slice(0, 5))
    }
  }, [showMore, collectionFiles])

  useEffect(() => {
    if (subCollectionFiles !== undefined && subCollectionFiles.length !== 0) {
      setSelectedCollectionFile(subCollectionFiles[0])
    }
  }, [subCollectionFiles])

  const [showCollectionFiles, setShowCollectionFiles] = useState(true)

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
              <div className={`w-full flex justify-center items-center mt-[195px] mb-5 ${styles.subTitle}`}>
                {collectionFiles.length} uploaded files
              </div>
              <div className={styles.uploadedImageArea}>
                {collectionFiles.map((item, index) => (
                  <div key={index} className="w-[100px] h-[100px]">
                    <Image
                      src={URL.createObjectURL(item.file)}
                      alt=""
                      width={100}
                      height={100}
                      layout="responsive"
                      objectFit="cover"
                      className="rounded-[12px]"
                    />
                  </div>
                ))}
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
                    // onChange={step => handleChangeCurrentStep(step)}
                  />
                </div>
                <div className="w-full">
                  <div className={`${styles.subTitle} mt-10`}>Collection Files (max. 25) *</div>
                  <div className="mt-5">
                    <Dropzone onDrop={acceptedFiles => onChangeCollectionFiles(acceptedFiles)} maxFiles={25}>
                      {({ getRootProps, getInputProps }) => (
                        <section className={styles.dropzone}>
                          <div {...getRootProps()} className={styles.selectArea}>
                            <input {...getInputProps()} />
                            <p className={styles.subTitle}>Upload Here</p>
                            <p className={styles.text}>Supported File Formats .png .jpeg .mp4 .mp3 and .mov</p>
                            <p className={styles.greenText}>Max File Size 30mb</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                </div>
                <div className="w-full mt-[70px]">
                  {!showMore &&
                    subCollectionFiles !== undefined &&
                    subCollectionFiles.length !== 0 &&
                    subCollectionFiles.map((item, index) => (
                      <div
                        className="w-full flex justify-between items-center gap-4 mt-10 cursor-pointer"
                        key={index}
                        onClick={() => setSelectedCollectionFile(item)}
                      >
                        <div
                          className={
                            selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                              ? styles.greenText
                              : styles.text
                          }
                        >
                          {index + 1}
                        </div>
                        <div
                          className={
                            selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                              ? styles.selectedImage
                              : styles.nonSelectedImage
                          }
                        >
                          <Image
                            src={URL.createObjectURL(item.file)}
                            alt=""
                            width={
                              selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68
                            }
                            height={
                              selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68
                            }
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>
                        <div className="flex-1 block h-[120px]">
                          <div
                            className={
                              selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                                ? styles.greenText
                                : styles.text
                            }
                          >
                            NFT Name *
                          </div>
                          <div>
                            <Input
                              value={item.name}
                              placeholder="Give your art name"
                              label=""
                              fullWidth
                              onChange={value => onChangeCollectionName(item, value)}
                              height="46px"
                            />
                          </div>
                        </div>
                        <div className="flex-1 block h-[120px]">
                          <div
                            className={
                              selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                                ? styles.greenText
                                : styles.text
                            }
                          >
                            Description *
                          </div>
                          <div>
                            <Textarea
                              value={item.description}
                              placeholder="Add a short description..."
                              fullWidth
                              onChange={value => onChangeCollectionDescription(item, value)}
                              height="90px"
                            />
                          </div>
                        </div>
                        <IconButton
                          icon={TrashGrayIcon}
                          onClick={() => onRemoveCollectionFile(item)}
                          backgroundColor="transparent"
                        />
                      </div>
                    ))}
                  {!showMore && subCollectionFiles !== undefined && subCollectionFiles.length !== 0 && (
                    <div className="w-full flex justify-center">
                      <IconButton
                        icon={ArrowDownGreenIcon}
                        onClick={() => setShowMore(true)}
                        backgroundColor="transparent"
                        width="32px"
                        height="32px"
                      />
                    </div>
                  )}

                  {showMore &&
                    collectionFiles.length !== 0 &&
                    collectionFiles.map((item, index) => (
                      <div
                        className="w-full flex justify-between items-center gap-4 mt-10 cursor-pointer"
                        key={index}
                        onClick={() => setSelectedCollectionFile(item)}
                      >
                        <div
                          className={
                            selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                              ? styles.greenText
                              : styles.text
                          }
                        >
                          {index + 1}
                        </div>
                        <div
                          className={
                            selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                              ? styles.selectedImage
                              : styles.nonSelectedImage
                          }
                        >
                          <Image
                            src={URL.createObjectURL(item.file)}
                            alt=""
                            width={
                              selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68
                            }
                            height={
                              selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68
                            }
                            objectFit="cover"
                            className="rounded-lg"
                          />
                        </div>
                        <div className="flex-1 block h-[120px]">
                          <div
                            className={
                              selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                                ? styles.greenText
                                : styles.text
                            }
                          >
                            NFT Name *
                          </div>
                          <div>
                            <Input
                              value={item.name}
                              placeholder="Give your art name"
                              label=""
                              fullWidth
                              onChange={value => onChangeCollectionName(item, value)}
                              height="46px"
                            />
                          </div>
                        </div>
                        <div className="flex-1 block h-[120px]">
                          <div
                            className={
                              selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                                ? styles.greenText
                                : styles.text
                            }
                          >
                            Description *
                          </div>
                          <div>
                            <Textarea
                              value={item.description}
                              placeholder="Add a short description..."
                              fullWidth
                              onChange={value => onChangeCollectionDescription(item, value)}
                              height="90px"
                            />
                          </div>
                        </div>
                        <IconButton
                          icon={TrashGrayIcon}
                          onClick={() => onRemoveCollectionFile(item)}
                          backgroundColor="transparent"
                        />
                      </div>
                    ))}
                </div>
                <div className="w-full h-32" />
                <div className="absolute bottom-0 w-full flex justify-between">
                  <Button
                    label="Back"
                    onClick={() => handleChangeCurrentStep(currentStep - 1)}
                    backgroundColor="#378287"
                    color="#EFF0F6"
                    width={viewport === '2xl' ? 124 : 117}
                    height={viewport === '2xl' ? 53 : 46}
                  />
                  {disabledNextButton ? (
                    <Button
                      width={viewport === '2xl' ? 124 : 117}
                      height={viewport === '2xl' ? 53 : 46}
                      label="Upload"
                      disabled={disabledNextButton}
                      backgroundColor="#888A8E"
                    />
                  ) : (
                    <GradientButton
                      width={viewport === '2xl' ? 124 : 117}
                      height={viewport === '2xl' ? 53 : 46}
                      label="Upload"
                      onClick={() => readFilesAndUplaod()}
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
          <div className={`${styles.title} w-full`}>Preview Collection</div>

          <div className="w-full flex flex-wrap justify-center mt-[22px]">
            {/* banner part */}
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
                <div className="absolute left-0 -bottom-[50px] w-full flex justify-center">
                  <div className={styles.coverImageArea}>
                    <Image
                      src={URL.createObjectURL(coverImage[0])}
                      alt=""
                      width={86}
                      height={86}
                      layout="responsive"
                      objectFit="cover"
                      className="rounded-[6px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className={`${styles.subTitle} mt-20`}>Collection Files *</div>
              <div className="w-full grid grid-cols-2 mt-4">
                <div className="col-span-1">
                  <GradientButton
                    fullWidth
                    label="See All Files"
                    onClick={() => setShowCollectionFiles(true)}
                    height="45px"
                  />
                </div>
              </div>
              {showCollectionFiles && (
                <CollectionFilesModal
                  data={collectionFiles}
                  onClick={() => setShowCollectionFiles(!showCollectionFiles)}
                />
              )}
            <div className={`${styles.subTitle} mt-10`}>Collection Files (max. 25) *</div>
            <div className="mt-5">
              <Dropzone onDrop={acceptedFiles => onChangeCollectionFiles(acceptedFiles)} maxFiles={25}>
                {({ getRootProps, getInputProps }) => (
                  <section className={styles.dropzone}>
                    <div {...getRootProps()} className={styles.selectArea}>
                      <input {...getInputProps()} />
                      <p className={styles.subTitle}>Upload Here</p>
                      <p className={styles.text}>
                        Supported File Formats
                        <br />
                        .png .jpeg .mp4 and .mov
                      </p>
                      <p className={styles.greenText}>Max File Size 30mb</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
            <div className="w-full mt-[70px]">
              {!showMore &&
                subCollectionFiles !== undefined &&
                subCollectionFiles.length !== 0 &&
                subCollectionFiles.map((item, index) => (
                  <div
                    className="w-full flex flex-wrap justify-between items-center gap-4 mt-10 cursor-pointer"
                    key={index}
                    onClick={() => setSelectedCollectionFile(item)}
                  >
                    <div className="w-full flex justify-between items-center">
                      <div
                        className={
                          selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                            ? styles.greenText
                            : styles.text
                        }
                      >
                        {index + 1}
                      </div>
                      <div
                        className={
                          selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                            ? styles.selectedImage
                            : styles.nonSelectedImage
                        }
                      >
                        <Image
                          src={URL.createObjectURL(item.file)}
                          alt=""
                          width={
                            selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68
                          }
                          height={
                            selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68
                          }
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <IconButton
                        icon={TrashGrayIcon}
                        onClick={() => onRemoveCollectionFile(item)}
                        backgroundColor="transparent"
                      />
                    </div>
                    <div className="w-full">
                      <div
                        className={
                          selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                            ? styles.greenText
                            : styles.text
                        }
                      >
                        NFT Name *
                      </div>
                      <div>
                        <Input
                          value={item.name}
                          placeholder="Give your art name"
                          label=""
                          fullWidth
                          onChange={value => onChangeCollectionName(item, value)}
                          height="46px"
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <div
                        className={
                          selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                            ? styles.greenText
                            : styles.text
                        }
                      >
                        Description *
                      </div>
                      <div>
                        <Textarea
                          value={item.description}
                          placeholder="Add a short description..."
                          fullWidth
                          onChange={value => onChangeCollectionDescription(item, value)}
                          height="90px"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              {!showMore && subCollectionFiles !== undefined && subCollectionFiles.length !== 0 && (
                <div className="w-full flex justify-center">
                  <IconButton
                    icon={ArrowDownGreenIcon}
                    onClick={() => setShowMore(true)}
                    backgroundColor="transparent"
                    width="32px"
                    height="32px"
                  />
                </div>
              )}
              {showMore &&
                collectionFiles.length !== 0 &&
                collectionFiles.map((item, index) => (
                  <div
                    className="w-full flex flex-wrap justify-between items-center gap-4 mt-10 cursor-pointer"
                    key={index}
                    onClick={() => setSelectedCollectionFile(item)}
                  >
                    <div className="w-full flex justify-between items-center">
                      <div
                        className={
                          selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                            ? styles.greenText
                            : styles.text
                        }
                      >
                        {index + 1}
                      </div>
                      <div
                        className={
                          selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                            ? styles.selectedImage
                            : styles.nonSelectedImage
                        }
                      >
                        <Image
                          src={URL.createObjectURL(item.file)}
                          alt=""
                          width={
                            selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68
                          }
                          height={
                            selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68
                          }
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <IconButton
                        icon={TrashGrayIcon}
                        onClick={() => onRemoveCollectionFile(item)}
                        backgroundColor="transparent"
                      />
                    </div>
                    <div className="w-full">
                      <div
                        className={
                          selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                            ? styles.greenText
                            : styles.text
                        }
                      >
                        NFT Name *
                      </div>
                      <div>
                        <Input
                          value={item.name}
                          placeholder="Give your art name"
                          label=""
                          fullWidth
                          onChange={value => onChangeCollectionName(item, value)}
                          height="46px"
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <div
                        className={
                          selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                            ? styles.greenText
                            : styles.text
                        }
                      >
                        Description *
                      </div>
                      <div>
                        <Textarea
                          value={item.description}
                          placeholder="Add a short description..."
                          fullWidth
                          onChange={value => onChangeCollectionDescription(item, value)}
                          height="90px"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="w-full flex justify-between my-10">
            {/* button group part */}
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
                      label="Upload"
                      disabled={disabledNextButton}
                      backgroundColor="#888A8E"
                      height="45px"
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <GradientButton
                      fullWidth
                      label="Upload"
                      onClick={() => readFilesAndUplaod()}
                      height="45px"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step03CollectionSection
