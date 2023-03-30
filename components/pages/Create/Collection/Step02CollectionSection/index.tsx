import React, { useEffect, useState, useRef } from 'react'

// next components
import NextImage from 'next/image'

// third party components
import Dropzone from 'react-dropzone'

// components
import Alert from 'components/Alert'
import MintAudioPlayer from 'components/MediaPlayer/MintAudioPlayer'
import DimensionMenu from 'components/Menu/DimensionMenu'
import CollectionStepper from 'components/Stepper/CollectionStepper'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import Button from 'components/Button'
import IconButton from 'components/Button/IconButton'
import GradientButton from 'components/Button/GradientButton'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'

// custom functions
import { useViewport } from 'utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'
import EllipseGreenLight from 'assets/icons/ellipse-green-light.svg'
import TrashGrayIcon from 'assets/icons/trash-gray.svg'
import TrashGrayLightIcon from 'assets/icons/trash-gray-light.svg'

// json
import NFTDimensionList from 'assets/json/nft-dimension-list.json'

// styles
import styles from './index.module.scss'
import { useSelector } from 'react-redux'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'

const Step02CollectionSection = props => {
  const {
    currentStep,
    coverCroppedImage,
    onChangeCurrentStep,
    collectionFiles,
    onChangeCollectionFiles,
    onRemoveCollectionFile,
    onChangeCollectionName,
    onChangeCollectionDescription,
    onChangeCroppedImage,
  } = props

  const viewport = useViewport()
  const dropzoneNftEl = useRef(null)

  // alert variables
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])

  const handleShowAlert = error => {
    if (error === 'file-invalid-type') {
      setAlertData([
        {
          id: 0,
          title: 'File Format Not Supported',
          description: `Supported file formats .png, .jpeg, .mp3, .mp4 and .gif`,
          type: 'error',
        },
      ])
    } else if (error === 'file-too-large') {
      setAlertData([
        {
          id: 0,
          title: 'Max File Size Exceeded',
          description: `Oops! It looks like your file exceeded the max file size of 30mb`,
          type: 'error',
        },
      ])
    } else {
      setAlertData([
        {
          id: 0,
          title: 'Unknown Error',
          description: `Unknown Error`,
          type: 'error',
        },
      ])
    }
    setShowAlert(true)
  }

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

  useEffect(() => {
    let width = 0
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
        // width = screenWidth - 32 - 8
        width = screenWidth
        break
    }
    if (width > 672) {
      setArtWidth(672)
    } else {
      setArtWidth(width)
    }
  }, [viewport, screenWidth])

  // variables
  const [openImageEditorModal, setOpenImageEditorModal] = useState(false)
  const [disabledNextButton, setDisabledNextButton] = useState(true)
  // const [showMore, setShowMore] = useState(false)
  // const [collectionFilesCount, setCollectionFilesCount] = useState(0)
  // const [subCollectionFiles, setSubCollectionFiles] = useState<any>([])
  const [selectedCollectionFile, setSelectedCollectionFile] = useState<any>()

  useEffect(() => {
    if (
      selectedCollectionFile !== undefined &&
      selectedCollectionFile.type === 'audio' &&
      selectedCollectionFile.croppedImage === undefined
    )
      onChangeCroppedImage(coverCroppedImage, selectedCollectionFile.id)
  }, [selectedCollectionFile])

  const imageProcess = src => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve({ width: img.width, height: img.height })
      img.onerror = reject
    })
  }

  const handleSelectedCollectionFile = (item: any) => {
    if (item.type !== 'image/gif' && item.type.split('/')[0] === 'image') {
      imageProcess(URL.createObjectURL(item.file)).then((result: any) => {
        let dimensionArray = JSON.parse(JSON.stringify(NFTDimensionList))
        dimensionArray[0].value = [result.width, result.height]
        item.dimensionList = dimensionArray
        item.selectedDimension = dimensionArray[0]
        setSelectedCollectionFile(item)
      })
    } else {
      setSelectedCollectionFile(item)
    }
  }

  const handleChangeDimension = (item: any) => {
    setSelectedCollectionFile({ ...selectedCollectionFile, selectedDimension: item })
    setOpenImageEditorModal(true)
  }

  const handleChangeCurrentStep = step => {
    handleFormValidate()
    onChangeCurrentStep(step)
  }

  useEffect(() => {
    let count = 0
    collectionFiles.forEach((item, index) => {
      if (item.croppedImage !== '' && item.name !== '') {
        count++
      }
    })
    if (count === collectionFiles.length && collectionFiles.length !== 0) {
      setDisabledNextButton(false)
    } else {
      if (collectionFiles.length === 0) {
        setSelectedCollectionFile(undefined)
      }
      setDisabledNextButton(true)
    }
  }, [collectionFiles])

  // form validate
  const handleFormValidate = () => {}

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="relative w-full grid grid-cols-12 gap-0">
          {/* left part */}
          <div className={styles.topLeftEllipse}>
            {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
          </div>
          <div className="col-span-12 lg:col-span-6 g-left-container">
            <div className={styles.leftContainer}>
              <div className={`${styles.title} w-full`}>Artwork Preview</div>
              <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
                {/* banner image */}
                <div className="w-full flex justify-center z-10">
                  <div className={styles.imageArea} style={{ width: artWidth, height: artWidth }}>
                    <div className="absolute inset-0 flex justify-center items-center">
                      {selectedCollectionFile !== undefined && (
                        <img
                          src={
                            selectedCollectionFile.croppedImage !== ''
                              ? selectedCollectionFile.croppedImage
                              : URL.createObjectURL(selectedCollectionFile.file)
                          }
                          alt=""
                          className="w-full h-full object-cover z-0"
                        />
                      )}
                    </div>
                    {selectedCollectionFile !== undefined && selectedCollectionFile.type !== 'audio' && (
                      <div className={styles.blurImage} />
                    )}
                    {selectedCollectionFile !== undefined && selectedCollectionFile.type === 'video' ? (
                      <video controls className="w-full h-full z-10" id="video">
                        <source
                          src={URL.createObjectURL(selectedCollectionFile.file)}
                          type={selectedCollectionFile.file.type}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : selectedCollectionFile !== undefined && selectedCollectionFile.type === 'audio' ? (
                      <MintAudioPlayer src={URL.createObjectURL(selectedCollectionFile.file)} />
                    ) : (
                      selectedCollectionFile !== undefined && (
                        <img
                          src={
                            selectedCollectionFile.croppedImage !== ''
                              ? selectedCollectionFile.croppedImage
                              : URL.createObjectURL(selectedCollectionFile.file)
                          }
                          alt=""
                          className="w-full h-full object-contain z-10"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
              {collectionFiles.length !== 0 && (
                <div className="w-full flex justify-between mt-2 z-10" style={{ width: artWidth }}>
                  {selectedCollectionFile !== undefined &&
                  selectedCollectionFile.type === 'image' &&
                  selectedCollectionFile.dimensionList !== undefined ? (
                    <DimensionMenu
                      dimensionList={selectedCollectionFile.dimensionList}
                      selectedDimension={selectedCollectionFile.selectedDimension}
                      onSelect={item => handleChangeDimension(item)}
                    />
                  ) : (
                    <>&nbsp;</>
                  )}
                  {selectedCollectionFile !== undefined && (
                    // <IconButton
                    //   icon={lightMode ? TrashGrayLightIcon : TrashGrayIcon}
                    //   onClick={() => {
                    //     onRemoveCollectionFile(selectedCollectionFile)
                    //     setSelectedCollectionFile(undefined)
                    //   }}
                    //   backgroundColor="transparent"
                    // />
                    <IconButtonWithSVG
                      icon={
                        <svg
                          id="Group_52015"
                          data-name="Group 52015"
                          xmlns="http://www.w3.org/2000/svg"
                          width="46"
                          height="46"
                          viewBox="0 0 46 46"
                        >
                          <g
                            id="Icon_feather-trash-2"
                            data-name="Icon feather-trash-2"
                            transform="translate(12.378 10.643)"
                          >
                            <path
                              id="Path_105833"
                              data-name="Path 105833"
                              d="M4.5,9H26.743"
                              transform="translate(-4.5 -4.057)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_105834"
                              data-name="Path 105834"
                              d="M24.8,7.943v17.3a2.471,2.471,0,0,1-2.471,2.471H9.971A2.471,2.471,0,0,1,7.5,25.243V7.943m3.707,0V5.471A2.471,2.471,0,0,1,13.679,3h4.943a2.471,2.471,0,0,1,2.471,2.471V7.943"
                              transform="translate(-5.029 -3)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_105835"
                              data-name="Path 105835"
                              d="M15,16.5v7.414"
                              transform="translate(-6.35 -5.378)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_105836"
                              data-name="Path 105836"
                              d="M21,16.5v7.414"
                              transform="translate(-7.407 -5.378)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                          </g>
                          <rect id="Rectangle_21074" data-name="Rectangle 21074" width="46" height="46" fill="none" />
                        </svg>
                      }
                      onClick={() => {
                        onRemoveCollectionFile(selectedCollectionFile)
                        setSelectedCollectionFile(undefined)
                      }}
                      backgroundColor="transparent"
                    />
                  )}
                </div>
              )}

              <div className="w-full flex justify-center mt-[90px]">
                <div className={styles.grayText}>
                  {selectedCollectionFile !== undefined ? selectedCollectionFile.id + 1 : 0}/{collectionFiles.length}
                  &nbsp;uploaded files
                </div>
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
                  <div className={`${styles.subTitle} mt-[76px]`}>Collection Files (max. 25) *</div>
                  <div className="mt-5">
                    <Dropzone
                      onDropAccepted={acceptedFiles => {
                        acceptedFiles.length !== 0 ? onChangeCollectionFiles(acceptedFiles) : handleShowAlert('unknown')
                      }}
                      onDropRejected={rejectedFiles => {
                        handleShowAlert(rejectedFiles[0]?.errors[0]?.code)
                      }}
                      accept={{
                        'image/jpeg': [],
                        'image/png': [],
                        'image/gif': [],
                        'video/mp4': [],
                        'audio/mpeg': [],
                        'audio/wav': [],
                      }}
                      maxFiles={25}
                      maxSize={31457280}
                    >
                      {({ getRootProps, getInputProps, open }) => (
                        <section className={styles.dropzone}>
                          <button onClick={open} ref={dropzoneNftEl} style={{ display: 'none' }}>
                            open
                          </button>
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

                  {/* {!showMore && */}
                  {collectionFiles.length !== 0 &&
                    collectionFiles.map((item, index) => (
                      <div
                        className="w-full flex justify-between items-center gap-4 mt-10 cursor-pointer"
                        key={index}
                        onClick={() => handleSelectedCollectionFile(item)}
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
                          {item.type === 'video' ? (
                            <video loop autoPlay className="w-full h-full" id="video">
                              <source src={URL.createObjectURL(item.file)} type={item.file.type} />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <NextImage
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
                          )}
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
                          <div className={styles.fileName}>{item.file?.name}</div>
                        </div>
                        <div className="flex-1 block h-[120px]">
                          <div
                            className={
                              selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                                ? styles.greenText
                                : styles.text
                            }
                          >
                            Description
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
                        {/* <IconButton
                          icon={TrashGrayIcon}
                          onClick={() => onRemoveCollectionFile(item)}
                          backgroundColor="transparent"
                          iconWidth={24}
                          iconHeight={24}
                        /> */}
                        <IconButtonWithSVG
                          icon={
                            <svg
                              id="Group_52015"
                              data-name="Group 52015"
                              xmlns="http://www.w3.org/2000/svg"
                              width="46"
                              height="46"
                              viewBox="0 0 46 46"
                            >
                              <g
                                id="Icon_feather-trash-2"
                                data-name="Icon feather-trash-2"
                                transform="translate(12.378 10.643)"
                              >
                                <path
                                  id="Path_105833"
                                  data-name="Path 105833"
                                  d="M4.5,9H26.743"
                                  transform="translate(-4.5 -4.057)"
                                  fill="none"
                                  stroke="var(--trash-icon-color)"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                                <path
                                  id="Path_105834"
                                  data-name="Path 105834"
                                  d="M24.8,7.943v17.3a2.471,2.471,0,0,1-2.471,2.471H9.971A2.471,2.471,0,0,1,7.5,25.243V7.943m3.707,0V5.471A2.471,2.471,0,0,1,13.679,3h4.943a2.471,2.471,0,0,1,2.471,2.471V7.943"
                                  transform="translate(-5.029 -3)"
                                  fill="none"
                                  stroke="var(--trash-icon-color)"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                                <path
                                  id="Path_105835"
                                  data-name="Path 105835"
                                  d="M15,16.5v7.414"
                                  transform="translate(-6.35 -5.378)"
                                  fill="none"
                                  stroke="var(--trash-icon-color)"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                                <path
                                  id="Path_105836"
                                  data-name="Path 105836"
                                  d="M21,16.5v7.414"
                                  transform="translate(-7.407 -5.378)"
                                  fill="none"
                                  stroke="var(--trash-icon-color)"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                />
                              </g>
                              <rect
                                id="Rectangle_21074"
                                data-name="Rectangle 21074"
                                width="46"
                                height="46"
                                fill="none"
                              />
                            </svg>
                          }
                          onClick={() => onRemoveCollectionFile(item)}
                          backgroundColor="transparent"
                          iconWidth={24}
                          iconHeight={24}
                        />
                      </div>
                    ))}

                  {collectionFiles.length > 0 && (
                    <div
                      className="flex mt-[20px]"
                      onClick={() => {
                        dropzoneNftEl.current.click()
                      }}
                    >
                      <section className={styles.dropzone}>
                        <div className={styles.selectArea}>
                          <p className={styles.subTitle}>Add More</p>
                          <p className={`${styles.text} mt-1`}>
                            Forgot to select all the collection items? If so, click in this box to upload more items
                          </p>
                        </div>
                      </section>
                    </div>
                  )}
                </div>
                <div className="w-full h-32" />
                <div className="absolute bottom-0 w-full flex justify-end">
                  {disabledNextButton ? (
                    <Button
                      width={viewport === '2xl' ? 184 : 175}
                      height={viewport === '2xl' ? 53 : 46}
                      label="Next Step"
                      disabled={disabledNextButton}
                      backgroundColor="#888A8E"
                    />
                  ) : (
                    <GradientButton
                      width={viewport === '2xl' ? 184 : 175}
                      height={viewport === '2xl' ? 53 : 46}
                      label="Next Step"
                      disabled={disabledNextButton}
                      gradientDirection="bottom"
                      onClick={() => handleChangeCurrentStep(currentStep + 1)}
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
            <CollectionStepper currentStep={currentStep} />
          </div>

          <div className="w-full flex flex-wrap justify-center mt-[22px]">
            {/* banner part */}
            <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
              {/* banner image */}
              <div className="w-full flex justify-center">
                <div
                  className={styles.imageArea}
                  style={{ width: artWidth, height: artWidth, marginLeft: '-16px', marginRight: '-16px' }}
                >
                  <div className="absolute inset-0 flex justify-center items-center">
                    {selectedCollectionFile !== undefined && (
                      <img
                        src={
                          selectedCollectionFile.croppedImage !== ''
                            ? selectedCollectionFile.croppedImage
                            : URL.createObjectURL(selectedCollectionFile.file)
                        }
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  {selectedCollectionFile !== undefined && selectedCollectionFile.type === 'video' ? (
                    <video controls className="w-full h-full z-10" id="video">
                      <source
                        src={URL.createObjectURL(selectedCollectionFile.file)}
                        type={selectedCollectionFile.file.type}
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedCollectionFile !== undefined && selectedCollectionFile.type === 'audio' ? (
                    <div className="z-10">
                      <MintAudioPlayer src={URL.createObjectURL(selectedCollectionFile.file)} />
                    </div>
                  ) : (
                    selectedCollectionFile !== undefined && (
                      <img
                        src={
                          selectedCollectionFile.croppedImage !== ''
                            ? selectedCollectionFile.croppedImage
                            : URL.createObjectURL(selectedCollectionFile.file)
                        }
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    )
                  )}
                </div>
              </div>
              {collectionFiles.length !== 0 && (
                <div className="w-full flex justify-between mt-2 z-10" style={{ width: artWidth }}>
                  {selectedCollectionFile !== undefined &&
                  selectedCollectionFile.type === 'image' &&
                  selectedCollectionFile.dimensionList !== undefined ? (
                    <DimensionMenu
                      dimensionList={selectedCollectionFile.dimensionList}
                      selectedDimension={selectedCollectionFile.selectedDimension}
                      onSelect={item => handleChangeDimension(item)}
                    />
                  ) : (
                    <>&nbsp;</>
                  )}
                  {selectedCollectionFile !== undefined && (
                    // <IconButton
                    //   icon={lightMode ? TrashGrayLightIcon : TrashGrayIcon}
                    //   onClick={() => {
                    //     onRemoveCollectionFile(selectedCollectionFile)
                    //     setSelectedCollectionFile(undefined)
                    //   }}
                    //   backgroundColor="transparent"
                    //   width="24px"
                    //   height="24px"
                    // />
                    <IconButtonWithSVG
                      icon={
                        <svg
                          id="Group_52015"
                          data-name="Group 52015"
                          xmlns="http://www.w3.org/2000/svg"
                          width="46"
                          height="46"
                          viewBox="0 0 46 46"
                        >
                          <g
                            id="Icon_feather-trash-2"
                            data-name="Icon feather-trash-2"
                            transform="translate(12.378 10.643)"
                          >
                            <path
                              id="Path_105833"
                              data-name="Path 105833"
                              d="M4.5,9H26.743"
                              transform="translate(-4.5 -4.057)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_105834"
                              data-name="Path 105834"
                              d="M24.8,7.943v17.3a2.471,2.471,0,0,1-2.471,2.471H9.971A2.471,2.471,0,0,1,7.5,25.243V7.943m3.707,0V5.471A2.471,2.471,0,0,1,13.679,3h4.943a2.471,2.471,0,0,1,2.471,2.471V7.943"
                              transform="translate(-5.029 -3)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_105835"
                              data-name="Path 105835"
                              d="M15,16.5v7.414"
                              transform="translate(-6.35 -5.378)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_105836"
                              data-name="Path 105836"
                              d="M21,16.5v7.414"
                              transform="translate(-7.407 -5.378)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                          </g>
                          <rect id="Rectangle_21074" data-name="Rectangle 21074" width="46" height="46" fill="none" />
                        </svg>
                      }
                      onClick={() => {
                        onRemoveCollectionFile(selectedCollectionFile)
                        setSelectedCollectionFile(undefined)
                      }}
                      backgroundColor="transparent"
                      iconWidth={24}
                      iconHeight={24}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <div className={`${styles.subTitle} mt-[46px]`}>Collection Files (max. 25) *</div>
            <div className="mt-5">
              <Dropzone
                onDrop={acceptedFiles => {
                  acceptedFiles.length !== 0 ? onChangeCollectionFiles(acceptedFiles) : handleShowAlert('uknown')
                }}
                onDropRejected={rejectedFiles => {
                  handleShowAlert(rejectedFiles[0]?.errors[0]?.code)
                }}
                accept={{
                  'image/jpeg': [],
                  'image/png': [],
                  'image/gif': [],
                  'video/mp4': [],
                  'audio/mpeg': [],
                  'audio/wav': [],
                }}
                maxFiles={25}
                maxSize={31457280}
              >
                {({ getRootProps, getInputProps, open }) => (
                  <section className={styles.dropzone}>
                    <button onClick={open} ref={dropzoneNftEl} style={{ display: 'none' }}>
                      open
                    </button>
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
          <div className="w-full">
            {/* {!showMore && */}
            {collectionFiles.length !== 0 &&
              collectionFiles.map((item, index) => (
                <div
                  className="w-full flex flex-wrap justify-between items-center gap-4 mt-10 cursor-pointer"
                  key={index}
                  onClick={() => handleSelectedCollectionFile(item)}
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={
                          selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                            ? styles.selectedImage
                            : styles.nonSelectedImage
                        }
                      >
                        {item.type === 'video' ? (
                          <video loop autoPlay className="w-full h-full" id="video">
                            <source src={URL.createObjectURL(item.file)} type={item.file.type} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <NextImage
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
                        )}
                      </div>
                      <div className={styles.fileName}>{item.file?.name}</div>
                    </div>
                    {/* <IconButton
                      icon={lightMode ? TrashGrayLightIcon : TrashGrayIcon}
                      onClick={() => onRemoveCollectionFile(item)}
                      backgroundColor="transparent"
                      iconWidth={24}
                      iconHeight={24}
                    /> */}

                    <IconButtonWithSVG
                      icon={
                        <svg
                          id="Group_52015"
                          data-name="Group 52015"
                          xmlns="http://www.w3.org/2000/svg"
                          width="46"
                          height="46"
                          viewBox="0 0 46 46"
                        >
                          <g
                            id="Icon_feather-trash-2"
                            data-name="Icon feather-trash-2"
                            transform="translate(12.378 10.643)"
                          >
                            <path
                              id="Path_105833"
                              data-name="Path 105833"
                              d="M4.5,9H26.743"
                              transform="translate(-4.5 -4.057)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_105834"
                              data-name="Path 105834"
                              d="M24.8,7.943v17.3a2.471,2.471,0,0,1-2.471,2.471H9.971A2.471,2.471,0,0,1,7.5,25.243V7.943m3.707,0V5.471A2.471,2.471,0,0,1,13.679,3h4.943a2.471,2.471,0,0,1,2.471,2.471V7.943"
                              transform="translate(-5.029 -3)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_105835"
                              data-name="Path 105835"
                              d="M15,16.5v7.414"
                              transform="translate(-6.35 -5.378)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_105836"
                              data-name="Path 105836"
                              d="M21,16.5v7.414"
                              transform="translate(-7.407 -5.378)"
                              fill="none"
                              stroke="var(--trash-icon-color)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                          </g>
                          <rect id="Rectangle_21074" data-name="Rectangle 21074" width="46" height="46" fill="none" />
                        </svg>
                      }
                      onClick={() => onRemoveCollectionFile(item)}
                      backgroundColor="transparent"
                      iconWidth={24}
                      iconHeight={24}
                    />
                  </div>

                  <div className="w-full block">
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
                        backgroundColor={'var(--input-bg)'}
                        label=""
                        fullWidth
                        onChange={value => onChangeCollectionName(item, value)}
                        height="46px"
                      />
                    </div>
                  </div>
                  <div className="w-full block h-[120px]">
                    <div
                      className={
                        selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                          ? styles.greenText
                          : styles.text
                      }
                    >
                      Description
                    </div>
                    <div>
                      <Textarea
                        value={item.description}
                        placeholder="Add a short description..."
                        backgroundColor={'var(--input-bg)'}
                        fullWidth
                        onChange={value => onChangeCollectionDescription(item, value)}
                        height="90px"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {collectionFiles.length > 0 && (
            <div
              className="flex mt-[20px]"
              onClick={() => {
                dropzoneNftEl.current.click()
              }}
            >
              <section className={styles.dropzone}>
                <div className={styles.selectArea}>
                  <p className={styles.subTitle}>Add More</p>
                  <p className={styles.text}>Forgot to select all the collection items?</p>
                  <p className={styles.text}>If so, click in this box to upload more items</p>
                </div>
              </section>
            </div>
          )}
          <div className="w-full flex justify-end my-10">
            <div className="w-[161px]">
              {disabledNextButton ? (
                <Button
                  label="Next Step"
                  height={viewport === '2xl' ? 53 : 46}
                  fullWidth
                  disabled={disabledNextButton}
                  backgroundColor={'#888A8E'}
                />
              ) : (
                <GradientButton
                  height={viewport === '2xl' ? 53 : 46}
                  label="Next Step"
                  fullWidth
                  disabled={disabledNextButton}
                  gradientDirection="bottom"
                  backgroundColor01={'var(--mint-btn-bg-1)'}
                  backgroundColor02={'var(--mint-btn-bg-2)'}
                  color={'var(--mint-btn-color)'}
                  onClick={() => handleChangeCurrentStep(currentStep + 1)}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {selectedCollectionFile !== undefined && selectedCollectionFile.type === 'image' && openImageEditorModal && (
        <NftImageEditorModal
          open={openImageEditorModal}
          close={() => setOpenImageEditorModal(false)}
          nftImage={[selectedCollectionFile.file]}
          getCroppedImage={croppedImage => {
            setSelectedCollectionFile({ ...selectedCollectionFile, croppedImage: croppedImage })
            onChangeCroppedImage(croppedImage, selectedCollectionFile.id)
            setOpenImageEditorModal(false)
          }}
          dimension={selectedCollectionFile.selectedDimension}
        />
      )}
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  )
}

export default Step02CollectionSection
