import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import Dropzone from 'react-dropzone'

// components
import CollectionStepper from 'components/Stepper/CollectionStepper'
import Select from 'components/Select'
import Radio from 'components/Radio'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import Button from 'components/Button'
import IconButton from 'components/Button/IconButton'
import GradientButton from 'components/Button/GradientButton'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'

// custom functions
import { useViewport } from 'utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import EditorGrayIcon from 'assets/icons/editor-gray.svg'
import FullScreenGrayIcon from 'assets/icons/full-screen-gray.svg'
import TrashGrayIcon from 'assets/icons/trash-gray.svg'
import ArrowDownGreenIcon from 'assets/icons/arrow-down-green.svg'
import InfoCircleLightGreenIcon from 'assets/icons/info-circle-light-green-20x20.svg'

// json
import CollectionDimensionList from 'assets/json/nft-dimension-list.json'

// styles
import styles from './index.module.scss'

const Step02CollectionSection = props => {
  const {
    currentStep,
    onChangeCurrentStep,
    dimension,
    onChangeDimension,
    collectionFiles,
    onChangeCollectionFiles,
    onRemoveCollectionFile,
    onChangeCollectionName,
    onChangeCollectionDescription,
    onChangeCroppedImage,
    readFilesAndUplaod,
  } = props

  const viewport = useViewport()

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

  // variables
  const [openImageEditorModal, setOpenImageEditorModal] = useState(false)
  const [disabledNextButton, setDisabledNextButton] = useState(true)
  const [showMore, setShowMore] = useState(false)
  const [subCollectionFiles, setSubCollectionFiles] = useState<any>([])
  const [selectedCollectionFile, setSelectedCollectionFile] = useState<any>()

  useEffect(() => {
    if (collectionFiles !== undefined && collectionFiles.length !== 0) {
      if (collectionFiles.length > 5) {
        setSubCollectionFiles(collectionFiles.slice(0, 5))
      } else {
        setSubCollectionFiles(collectionFiles)
      }
    } else {
      setSubCollectionFiles([])
    }
  }, [showMore, collectionFiles])

  const handleChangeCurrentStep = step => {
    handleFormValidate()
    onChangeCurrentStep(step)
  }

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
              <div className={`${styles.title} w-full`}>Artwork Preview</div>
              <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
                {/* banner image */}
                <div className="w-full flex justify-center">
                  <div
                    className={styles.imageArea}
                    style={{ width: artWidth + 24, height: artHeight + 24, padding: '12px' }}
                  >
                    {selectedCollectionFile !== undefined && (
                      <img
                        src={
                          selectedCollectionFile.croppedImage !== ''
                            ? selectedCollectionFile.croppedImage
                            : URL.createObjectURL(selectedCollectionFile.file)
                        }
                        alt=""
                        className="w-full h-full object-contain rounded-[6px]"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between mt-2 z-10" style={{ width: artWidth }}>
                <IconButton
                  icon={EditorGrayIcon}
                  onClick={() => setOpenImageEditorModal(true)}
                  backgroundColor="transparent"
                  width="32px"
                  height="32px"
                />
                <IconButton
                  icon={FullScreenGrayIcon}
                  onClick={() => {}}
                  backgroundColor="transparent"
                  width="32px"
                  height="32px"
                />
                <IconButton
                  icon={TrashGrayIcon}
                  onClick={() => {}}
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
                  <CollectionStepper currentStep={currentStep} />
                </div>
                <div className="w-full">
                  <div className={`${styles.subTitle} mt-10 flex items-center gap-2`}>
                    Dimensions of Artwork *
                    <Image src={InfoCircleLightGreenIcon} alt="" />
                  </div>
                  <div className="max-w-[370px] w-full mt-5">
                    <Select
                      data={CollectionDimensionList}
                      selected={dimension}
                      onChange={item => onChangeDimension(item)}
                    />
                  </div>
                  <div className={`${styles.subTitle} mt-10`}>Collection Files (max. 25) *</div>
                  <div className="mt-5">
                    <Dropzone onDrop={acceptedFiles => onChangeCollectionFiles(acceptedFiles)} maxFiles={25}>
                      {({ getRootProps, getInputProps }) => (
                        <section className={styles.dropzone}>
                          <div {...getRootProps()} className={styles.selectArea}>
                            <input {...getInputProps()} />
                            <p className={styles.subTitle}>Upload Here</p>
                            <p className={styles.text}>Supported File Formats .png .jpeg .mp4 .gif and .mp3</p>
                            <p className={styles.greenText}>Max File Size 30mb</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
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
                            src={item.croppedImage !== '' ? item.croppedImage : URL.createObjectURL(item.file)}
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
                          iconWidth="24px"
                          iconHeight="24px"
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
                            src={item.croppedImage !== '' ? item.croppedImage : URL.createObjectURL(item.file)}
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
                    width={viewport === '2xl' ? 124 : 117}
                    height={viewport === '2xl' ? 53 : 46}
                    label="Back"
                    onClick={() => handleChangeCurrentStep(currentStep - 1)}
                    backgroundColor="#378287"
                    color="#EFF0F6"
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
            <CollectionStepper currentStep={currentStep} />
          </div>
          <div className={`${styles.title} w-full`}>Artwork Preview</div>

          <div className="w-full flex flex-wrap justify-center mt-[22px]">
            {/* banner part */}
            <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
              {/* banner image */}
              <div className="w-full flex justify-center">
                <div
                  className={styles.imageArea}
                  style={{ width: artWidth + 12, height: artHeight + 12, padding: '6px' }}
                >
                  {selectedCollectionFile !== undefined && (
                    <img
                      src={
                        selectedCollectionFile.croppedImage !== ''
                          ? selectedCollectionFile.croppedImage
                          : URL.createObjectURL(selectedCollectionFile.file)
                      }
                      alt=""
                      className="w-full h-full object-contain rounded-[6px]"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className={`${styles.subTitle} mt-8`}>Banner *</div>
            <div className="mt-5">
              <Dropzone onDrop={acceptedFiles => onChangeCollectionFiles(acceptedFiles)} maxFiles={1}>
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
            <div className={`${styles.subTitle} mt-8 flex items-center gap-2`}>
              Dimensions of Artwork *
              <Image src={InfoCircleLightGreenIcon} alt="" />
            </div>
            <div className="max-w-[370px] w-full mt-5 pl-6">
              <Radio
                data={CollectionDimensionList}
                selected={dimension}
                onChange={item => onChangeDimension(item)}
                direction="rtl"
              />
            </div>
            <div className="w-full">
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
                        src={item.croppedImage !== '' ? item.croppedImage : URL.createObjectURL(item.file)}
                        alt=""
                        width={selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68}
                        height={selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68}
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
                      iconWidth="24px"
                      iconHeight="24px"
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
                        src={item.croppedImage !== '' ? item.croppedImage : URL.createObjectURL(item.file)}
                        alt=""
                        width={selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68}
                        height={selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 64 : 68}
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
      {selectedCollectionFile !== undefined && (
        <NftImageEditorModal
          open={openImageEditorModal}
          close={() => setOpenImageEditorModal(false)}
          nftImage={[selectedCollectionFile.file]}
          getCroppedImage={croppedImage => {
            onChangeCroppedImage(croppedImage, selectedCollectionFile.id)
            setOpenImageEditorModal(false)
          }}
          dimension={dimension}
        />
      )}
    </div>
  )
}

export default Step02CollectionSection
