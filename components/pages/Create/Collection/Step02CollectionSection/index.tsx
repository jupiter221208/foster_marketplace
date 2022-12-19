import React, { useEffect, useState } from 'react'

// next components
import NextImage from 'next/image'

// third party components
import Dropzone from 'react-dropzone'

// components
import Alert from 'components/Alert'
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
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import TrashGrayIcon from 'assets/icons/trash-gray.svg'
import ArrowDownGreenIcon from 'assets/icons/arrow-down-green.svg'
import AudioPlayer from 'assets/images/audio-player.png'

// json
import NFTDimensionList from 'assets/json/nft-dimension-list.json'

// styles
import styles from './index.module.scss'

const Step02CollectionSection = props => {
  const {
    currentStep,
    onChangeCurrentStep,
    collectionFiles,
    onChangeCollectionFiles,
    onRemoveCollectionFile,
    onChangeCollectionName,
    onChangeCollectionDescription,
    onChangeCroppedImage,
  } = props

  const viewport = useViewport()

  // alert variables
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])

  const handleShowAlert = () => {
    setAlertData([
      {
        id: 0,
        title: 'Max File Size Exceeded',
        description: `Oops! It looks like your file exceeded the max file size of 30mb`,
        type: 'error',
      },
    ])
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
  const [showMore, setShowMore] = useState(false)
  const [subCollectionFiles, setSubCollectionFiles] = useState<any>([])
  const [selectedCollectionFile, setSelectedCollectionFile] = useState<any>()

  useEffect(() => {
    if (
      selectedCollectionFile !== undefined &&
      selectedCollectionFile.type === 'audio' &&
      selectedCollectionFile.croppedImage === undefined
    )
      onChangeCroppedImage(AudioPlayer.src, selectedCollectionFile.id)
  }, [selectedCollectionFile])

  const imageProcess = src => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve({ width: img.width, height: img.height })
      img.onerror = reject
    })
  }

  const handleSelectedCollectioinFile = (item: any) => {
    setSelectedCollectionFile(undefined)
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

  useEffect(() => {
    if (collectionFiles !== undefined && collectionFiles.length !== 0) {
      if (collectionFiles.length > 5) {
        setSubCollectionFiles(collectionFiles.slice(0, 5))
        setShowMore(true)
      } else {
        setShowMore(false)
        setSubCollectionFiles(collectionFiles)
      }
    } else {
      setSubCollectionFiles([])
    }
  }, [collectionFiles])

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
    if (count === collectionFiles.length) {
      setDisabledNextButton(false)
    } else {
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
            <NextImage src={EllipseGreen} alt="" objectFit="cover" />
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
                          className="min-w-full min-h-full object-cover"
                        />
                      )}
                    </div>
                    <div className={styles.blurImage} />
                    {selectedCollectionFile !== undefined && selectedCollectionFile.type === 'video' ? (
                      <video controls className="w-full h-full z-10" id="video">
                        <source
                          src={URL.createObjectURL(selectedCollectionFile.file)}
                          type={selectedCollectionFile.file.type}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      selectedCollectionFile !== undefined && (
                        <img
                          src={
                            selectedCollectionFile.croppedImage !== ''
                              ? selectedCollectionFile.croppedImage
                              : URL.createObjectURL(selectedCollectionFile.file)
                          }
                          alt=""
                          className="w-full h-full object-contain rounded-[6px] z-10"
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
                    <IconButton
                      icon={TrashGrayIcon}
                      onClick={() => {
                        onRemoveCollectionFile(selectedCollectionFile)
                        setSelectedCollectionFile(undefined)
                      }}
                      backgroundColor="transparent"
                    />
                  )}
                </div>
              )}

              {selectedCollectionFile !== undefined && selectedCollectionFile.type === 'audio' && (
                <div className="w-full mt-[14px]">
                  <audio controls className="w-full">
                    <source
                      src={URL.createObjectURL(selectedCollectionFile.file)}
                      type={selectedCollectionFile.file.type}
                    />
                    Your browser does not support the video tag.
                  </audio>
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
                      onDrop={acceptedFiles => {
                        acceptedFiles.length !== 0 ? onChangeCollectionFiles(acceptedFiles) : handleShowAlert()
                      }}
                      maxFiles={25}
                      maxSize={31457280}
                    >
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
                  {showMore &&
                    subCollectionFiles !== undefined &&
                    subCollectionFiles.length !== 0 &&
                    subCollectionFiles.map((item, index) => (
                      <div
                        className="w-full flex justify-between items-center gap-4 mt-10 cursor-pointer"
                        key={index}
                        onClick={() => handleSelectedCollectioinFile(item)}
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
                        <IconButton
                          icon={TrashGrayIcon}
                          onClick={() => onRemoveCollectionFile(item)}
                          backgroundColor="transparent"
                          iconWidth={24}
                          iconHeight={24}
                        />
                      </div>
                    ))}
                  {showMore && subCollectionFiles !== undefined && subCollectionFiles.length !== 0 && (
                    <div className="w-full flex justify-center">
                      <IconButton
                        icon={ArrowDownGreenIcon}
                        onClick={() => setShowMore(false)}
                        backgroundColor="transparent"
                        iconWidth={64}
                        iconHeight={64}
                      />
                    </div>
                  )}

                  {!showMore &&
                    collectionFiles.length !== 0 &&
                    collectionFiles.map((item, index) => (
                      <div
                        className="w-full flex justify-between items-center gap-4 mt-10 cursor-pointer"
                        key={index}
                        onClick={() => handleSelectedCollectioinFile(item)}
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
                        <IconButton
                          icon={TrashGrayIcon}
                          onClick={() => onRemoveCollectionFile(item)}
                          backgroundColor="transparent"
                          iconWidth={24}
                          iconHeight={24}
                        />
                      </div>
                    ))}
                </div>
                <div className="w-full h-32" />
                <div className="absolute bottom-0 w-full flex justify-between">
                  <Button
                    label="Back"
                    onClick={() => handleChangeCurrentStep(currentStep - 1)}
                    width={viewport === '2xl' ? 184 : 175}
                    height={viewport === '2xl' ? 53 : 46}
                    backgroundColor="#378287"
                    color="#EFF0F6"
                  />
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
                      color="#202427"
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
          {/* <div className={`${styles.title} w-full`}>Artwork Preview</div> */}

          <div className="w-full flex flex-wrap justify-center mt-[22px]">
            {/* banner part */}
            <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
              {/* banner image */}
              <div className="w-full flex justify-center">
                <div
                  className={styles.imageArea}
                  style={{ width: artWidth, height: artWidth, marginLeft: '-16px', marginRight: '-16px' }}
                >
                  {selectedCollectionFile !== undefined && selectedCollectionFile.type === 'video' ? (
                    <video controls className="w-full h-full z-10" id="video">
                      <source
                        src={URL.createObjectURL(selectedCollectionFile.file)}
                        type={selectedCollectionFile.file.type}
                      />
                      Your browser does not support the video tag.
                    </video>
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
                    <IconButton
                      icon={TrashGrayIcon}
                      onClick={() => {
                        onRemoveCollectionFile(selectedCollectionFile)
                        setSelectedCollectionFile(undefined)
                      }}
                      backgroundColor="transparent"
                      width="32px"
                      height="32px"
                    />
                  )}
                </div>
              )}
            </div>

            {selectedCollectionFile !== undefined && selectedCollectionFile.type === 'audio' && (
              <div className="w-full mt-[14px]">
                <audio controls className="w-full">
                  <source
                    src={URL.createObjectURL(selectedCollectionFile.file)}
                    type={selectedCollectionFile.file.type}
                  />
                  Your browser does not support the video tag.
                </audio>
              </div>
            )}
          </div>

          <div className="w-full">
            <div className={`${styles.subTitle} mt-[46px]`}>Collection Files (max. 25) *</div>
            <div className="mt-5">
              <Dropzone
                onDrop={acceptedFiles => {
                  acceptedFiles.length !== 0 ? onChangeCollectionFiles(acceptedFiles) : handleShowAlert()
                }}
                maxFiles={25}
                maxSize={31457280}
              >
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
          <div className="w-full">
            {showMore &&
              subCollectionFiles !== undefined &&
              subCollectionFiles.length !== 0 &&
              subCollectionFiles.map((item, index) => (
                <div
                  className="w-full flex flex-wrap gap-4 mt-10 cursor-pointer"
                  key={index}
                  onClick={() => handleSelectedCollectioinFile(item)}
                >
                  <div className="w-full flex justify-between items-center">
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
                    <IconButton
                      icon={TrashGrayIcon}
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
                        fullWidth
                        onChange={value => onChangeCollectionDescription(item, value)}
                        height="90px"
                      />
                    </div>
                  </div>
                </div>
              ))}
            {showMore && subCollectionFiles !== undefined && subCollectionFiles.length !== 0 && (
              <div className="w-full flex justify-center">
                <IconButton
                  icon={ArrowDownGreenIcon}
                  onClick={() => setShowMore(false)}
                  backgroundColor="transparent"
                  iconWidth={32}
                  iconHeight={32}
                />
              </div>
            )}

            {!showMore &&
              collectionFiles.length !== 0 &&
              collectionFiles.map((item, index) => (
                <div
                  className="w-full flex flex-wrap justify-between items-center gap-4 mt-10 cursor-pointer"
                  key={index}
                  onClick={() => handleSelectedCollectioinFile(item)}
                >
                  <div className="w-full flex justify-between items-center">
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
                    <IconButton
                      icon={TrashGrayIcon}
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
                        fullWidth
                        onChange={value => onChangeCollectionDescription(item, value)}
                        height="90px"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
            <div className="w-[161px]">
              {disabledNextButton ? (
                <Button
                  label="Next Step"
                  height={viewport === '2xl' ? 53 : 46}
                  fullWidth
                  disabled={disabledNextButton}
                  backgroundColor="#888A8E"
                />
              ) : (
                <GradientButton
                  height={viewport === '2xl' ? 53 : 46}
                  label="Next Step"
                  fullWidth
                  disabled={disabledNextButton}
                  gradientDirection="bottom"
                  color="#202427"
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
            handleSelectedCollectioinFile({ ...selectedCollectionFile, croppedImage: croppedImage })
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
