import React, { useEffect, useState, useRef } from 'react'

// next components
import NextImage from 'next/image'

// third party components
import Dropzone from 'react-dropzone'

// components
import Alert from 'components/Alert'
import MintAudioPlayer from 'components/MediaPlayer/MintAudioPlayer'
import DimensionMenu from 'components/Menu/DimensionMenu'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'

// Icons
import ImageIcon from 'assets/icons/image-icon.svg?component'
import ShareIcon from 'assets/icons/share-icon.svg?component'
import TrashBinSmall from 'assets/icons/trash-bin-18x18.svg?component'

// custom functions
import { useViewport } from 'utils'

// json
import NFTDimensionList from 'assets/json/nft-dimension-list.json'
import MaxNumberList from 'assets/json/single-nft/max-number-list.json'
import EditionList from 'assets/json/collections/edition-type.json'

// styles
import styles from './index.module.scss'
import ModelViewer from 'components/ModelViewer'
import { limit } from 'utils/strings'
import { validDigits } from 'utils/helpers'
import ProductionListMenu from 'components/ProductionListMenu'
import { useRouter } from 'next/router'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

const Step02CollectionSection = props => {
  const {
    currentStep,
    coverImageProcessing,
    coverCroppedImage,
    onChangeCurrentStep,
    collectionFiles,
    addCoverImageToFile,
    onChangeCollectionFiles,
    onRemoveCollectionFile,
    onChangeCollectionName,
    onChangeCollectionDescription,
    onChangeEditionType,
    onChangeCroppedImage,
    onChangeMaxNum,
    onChangeMaxSupply,
    onChangeSupply,
    disabledNextButton,
    setDisabledNextButton,
    onNext,
  } = props

  const viewport = useViewport()
  const dropzoneNftEl = useRef(null)
  const router = useRouter()

  // alert variables
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [addMoreClicked, setAddMoreClicked] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

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
        width = screenWidth / 2 - 150
        break
      case 'xl':
        width = screenWidth / 2 - 120
        break
      case 'lg':
        width = screenWidth / 2 - 100
        break
      default:
        // width = screenWidth - 32 - 8
        width = screenWidth
        break
    }
    if (width > 760) {
      setArtWidth(760)
    } else {
      setArtWidth(width)
    }
  }, [viewport, screenWidth])

  // variables
  const [openImageEditorModal, setOpenImageEditorModal] = useState(false)
  const [selectedCollectionFile, setSelectedCollectionFile] = useState<any>()

  useEffect(() => {
    if (
      selectedCollectionFile !== undefined &&
      selectedCollectionFile.type === 'audio' &&
      selectedCollectionFile.croppedImage === undefined
    )
      onChangeCroppedImage(coverCroppedImage, selectedCollectionFile.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (item.type === 'vr') {
        if (item.nftCoverImage !== null && item.name !== '') count++
      } else if (item.croppedImage !== '' && item.name !== '') {
        count++
      }
    })
    if (count === collectionFiles.length && collectionFiles.length !== 0) {
      let isMaxSupply = true
      collectionFiles.map(item => {
        if (item.editionType.id === 0) {
          if (item.maxSupply === undefined || item.maxSupply === null) {
            isMaxSupply = false
            return
          }
        }
      })
      if (isMaxSupply) setDisabledNextButton(false)
      else setDisabledNextButton(true)
    } else {
      if (collectionFiles.length === 0) {
        setSelectedCollectionFile(undefined)
      }
      setDisabledNextButton(true)
    }
    if (collectionFiles.length > 0 && addMoreClicked === true) {
      handleSelectedCollectionFile(collectionFiles[collectionFiles.length - 1])
      setAddMoreClicked(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionFiles])

  // form validate
  const handleFormValidate = () => {}

  const [takeSnapshotStatus, setTakeSnapshotStatus] = useState(false)
  const [openCoverImageEditorModal, setOpenCoverImageEditorModal] = useState(false)

  return (
    <div className="w-full flex justify-center">
      {selectedCollectionFile && selectedCollectionFile.nftCoverImage && selectedCollectionFile.type === 'vr' && (
        <NftImageEditorModal
          open={openCoverImageEditorModal}
          close={() => setOpenCoverImageEditorModal(false)}
          nftImage={[selectedCollectionFile.nftCoverImage]}
          getCroppedImage={croppedImage => {
            addCoverImageToFile(selectedCollectionFile, croppedImage)
            setOpenCoverImageEditorModal(false)
          }}
          dimension={{ value: [1920, 1920] }}
        />
      )}
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="relative w-full flex min-h-screen">
          {/* left part */}
          <div className="flex-[50%] g-left-container">
            <div className={styles.leftContainer}>
              <div className="w-full flex flex-wrap justify-center z-10 max-w-max">
                {/* banner image */}
                <div className="w-full flex justify-start z-10">
                  <div className={styles.imageArea} style={{ width: artWidth, height: (artWidth * 65) / 76 }}>
                    {selectedCollectionFile !== undefined && selectedCollectionFile.type !== 'vr' && (
                      <div className="absolute inset-0 flex justify-center items-center">
                        <img
                          src={
                            selectedCollectionFile.croppedImage !== ''
                              ? selectedCollectionFile.croppedImage
                              : URL.createObjectURL(selectedCollectionFile.file)
                          }
                          alt=""
                          className="w-full h-full object-cover z-0"
                        />
                        <div className={styles.blurView}>
                          {selectedCollectionFile !== undefined && selectedCollectionFile.type === 'audio' && (
                            <div className="w-full h-full max-w-[450px] max-h-[450px] rounded-[30px]">
                              <div className={styles.coverImageArea}>
                                <div className={styles.coverImageContent}>
                                  <img
                                    src={
                                      selectedCollectionFile.croppedImage !== ''
                                        ? selectedCollectionFile.croppedImage
                                        : URL.createObjectURL(selectedCollectionFile.file)
                                    }
                                    alt=""
                                    className="w-full h-full object-cover z-0 rounded-[30px]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedCollectionFile !== undefined && selectedCollectionFile.type === 'video' ? (
                      <video controls className="w-full h-full z-10" id="video">
                        <source
                          src={URL.createObjectURL(selectedCollectionFile.file)}
                          type={selectedCollectionFile.file.type}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : selectedCollectionFile !== undefined && selectedCollectionFile.type === 'vr' ? (
                      selectedCollectionFile.url && (
                        <ModelViewer
                          path={selectedCollectionFile.url}
                          preserveDrawingBuffer
                          getSnapshot={{
                            onSnapshot: image => {
                              addCoverImageToFile(selectedCollectionFile, URL.createObjectURL(image))
                              setTakeSnapshotStatus(false)
                            },
                            status: takeSnapshotStatus,
                          }}
                        />
                      )
                    ) : selectedCollectionFile !== undefined && selectedCollectionFile.type === 'audio' ? (
                      <MintAudioPlayer src={URL.createObjectURL(selectedCollectionFile.file)} type="collection" />
                    ) : (
                      selectedCollectionFile !== undefined &&
                      selectedCollectionFile.type !== 'vr' && (
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

              <div className="w-full flex justify-between mt-2 z-10" style={{ width: artWidth }}>
                {collectionFiles.length !== 0 ? (
                  selectedCollectionFile !== undefined &&
                  selectedCollectionFile.type === 'image' &&
                  selectedCollectionFile.dimensionList !== undefined ? (
                    <DimensionMenu
                      dimensionList={selectedCollectionFile.dimensionList}
                      selectedDimension={selectedCollectionFile.selectedDimension}
                      onSelect={item => handleChangeDimension(item)}
                    />
                  ) : (
                    <> </>
                  )
                ) : (
                  <div className={styles.preview}>Preview will display here</div>
                )}
              </div>
            </div>
          </div>
          {/* right part */}
          <div className="flex-[50%] g-right-container z-0 relative">
            <div className={styles.rightContainer}>
              <div className="w-full relative">
                <div className="w-full">
                  <div className={`${styles.subTitle} lg:mt-[54px]`}>
                    Upload Art (max 20 files) <span>*</span>
                  </div>
                  <div className="mt-5">
                    <Dropzone
                      onDropAccepted={acceptedFiles => {
                        setAddMoreClicked(true)
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
                        'model/gltf-binary': ['.glb'],
                      }}
                      maxFiles={25}
                      maxSize={104857600}
                    >
                      {({ getRootProps, getInputProps, open }) => (
                        <section className={styles.dropzone}>
                          <button onClick={open} ref={dropzoneNftEl} style={{ display: 'none' }}>
                            open
                          </button>
                          <div {...getRootProps()} className={styles.selectArea}>
                            <input {...getInputProps()} />
                            <p className={styles.subTitle}>Upload Here</p>
                            <p className={styles.text}>Supported File Formats .png .jpeg .mp4 .gif .mp3 .glb</p>
                            <p className={styles.greenText}>Max File Size 100mb</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>

                  {/* {!showMore && */}
                  {collectionFiles.length !== 0 &&
                    collectionFiles.map((item, index) => (
                      <div
                        className="my-10 gap-4 cursor-pointer"
                        key={index}
                        onClick={() => handleSelectedCollectionFile(item)}
                      >
                        <div className="w-full flex justify-between">
                          <div className="flex">
                            <div
                              className={`mt-5 mr-4 ${
                                selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                                  ? styles.greenText
                                  : styles.text
                              }`}
                            >
                              {index + 1}
                            </div>

                            <div
                              className={
                                selectedCollectionFile !== undefined &&
                                selectedCollectionFile.file.path === item.file.path
                                  ? styles.selectedImage
                                  : styles.nonSelectedImage
                              }
                            >
                              {item.type === 'video' ? (
                                <video loop autoPlay className="w-full h-full" id="video">
                                  <source src={URL.createObjectURL(item.file)} type={item.file.type} />
                                  Your browser does not support the video tag.
                                </video>
                              ) : item.type === 'vr' && !item.nftCoverImage ? (
                                <p className={styles.tapToView}>Click to Preview</p>
                              ) : (
                                <NextImage
                                  src={
                                    item.type === 'vr' && item.nftCoverImage
                                      ? item.nftCoverImage
                                      : item.croppedImage !== ''
                                      ? item.croppedImage
                                      : URL.createObjectURL(item.file)
                                  }
                                  alt=""
                                  width={
                                    selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                                      ? 76
                                      : 76
                                  }
                                  height={
                                    selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id
                                      ? 76
                                      : 76
                                  }
                                  objectFit="cover"
                                  className="rounded-lg"
                                />
                              )}
                            </div>
                          </div>
                          <div onClick={() => onRemoveCollectionFile(item)}>
                            <TrashBinSmall />
                          </div>
                        </div>

                        <div className="w-full mt-[15px]">
                          <div className="flex-1 block h-[120px]">
                            <div className={`mb-2 ${styles.subTitle}`}>
                              NFT Name <span>*</span>
                            </div>
                            <div>
                              <Input
                                value={limit(item.name, 32)}
                                placeholder="Give your art a name"
                                label01={item.file?.name}
                                label02={32 - item.name.length === 32 ? '' : `${32 - item.name.length} Characters left`}
                                fullWidth
                                onChange={value => onChangeCollectionName(item, limit(value, 32))}
                                height="46px"
                              />
                            </div>
                          </div>
                          <div className="flex-1 block">
                            <div className={`mb-2 ${styles.subTitle}`}>
                              Description <span>*</span>
                            </div>
                            <div>
                              <Textarea
                                value={item.description}
                                placeholder="Add a short description..."
                                fullWidth
                                onChange={value => onChangeCollectionDescription(item, value)}
                                height={90}
                                // maxHeight="110px"
                              />
                            </div>
                          </div>

                          {item.type === 'vr' && (
                            <div className="mt-[15px]">
                              <div className={styles.coverImgMsg}>
                                Cover Photo <span>*</span>
                                <p>
                                  Pick the best angle to take a snapshot or upload an image to use as the cover photo.
                                </p>
                              </div>
                              <div className={styles.coverBtnBox}>
                                <button
                                  disabled={item.nftCoverImage !== null}
                                  onClick={() => setTakeSnapshotStatus(true)}
                                >
                                  <ImageIcon /> Take Snapshot
                                </button>
                                <button disabled={item.nftCoverImage !== null}>
                                  <label htmlFor="fileInput">
                                    <ShareIcon /> Upload Photo
                                  </label>
                                </button>
                                <input
                                  type="file"
                                  accept="image/*"
                                  id="fileInput"
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => {
                                    const file = e.target.files[0]
                                    if (file && file.type.startsWith('image/')) {
                                      addCoverImageToFile(selectedCollectionFile, file)
                                      setOpenCoverImageEditorModal(true)
                                    } else {
                                      alert('Please select an image file.')
                                    }
                                  }}
                                />
                              </div>

                              {item.nftCoverImage && (
                                <div
                                  className={styles.glbNftImageSection}
                                  onMouseEnter={() => setShowDelete(true)}
                                  onMouseLeave={() => setShowDelete(false)}
                                >
                                  <img className="w-full aspect-square" src={item.nftCoverImage} alt="" />
                                  {showDelete && (
                                    <div className={styles.deleteArea}>
                                      <div
                                        onClick={() => {
                                          setShowDelete(false)
                                          addCoverImageToFile(selectedCollectionFile, null)
                                        }}
                                      >
                                        Delete
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Editins */}
                          <div className="mb-[30px] mt-[15px]">
                            <div className={styles.subTitle}>
                              Edition type <span>*</span>
                            </div>
                            <div className="mt-[15px]">
                              <ProductionListMenu
                                label={item.editionType.label}
                                data={EditionList}
                                selectedItem={item.editionType}
                                setSelectedItem={data => {
                                  onChangeEditionType(item, data)
                                }}
                              />
                            </div>
                            {item.editionType.id === 0 && (
                              <div className="mt-[30px]">
                                <div className={styles.maxSupplyTitle}>
                                  Max Supply <span>*</span>
                                </div>
                                <div className={styles.editionDescription}>
                                  The max number of copies that will be created
                                </div>
                                <div className="flex flex-wrap gap-[20px] mt-[16px] lg:mt-[25px]">
                                  {MaxNumberList.map((number, index) => (
                                    <div
                                      key={index}
                                      className={`${
                                        item.maxNum?.id === number.id ? styles.selectSupply : styles.noneSupply
                                      }`}
                                      onClick={() => {
                                        onChangeMaxNum(item, number)
                                        onChangeMaxSupply(item, number.value)
                                        onChangeSupply(item, 0)
                                      }}
                                    >
                                      {number.label}
                                    </div>
                                  ))}
                                </div>
                                {item.maxNum && item.maxNum['id'] === 3 && (
                                  <div className="max-w-[450px] mt-[45px]">
                                    <div className={styles.maxTitle}>
                                      Custom Supply <span>*</span>
                                    </div>
                                    <div className="mt-[15px]">
                                      <Input
                                        value={item.supply}
                                        onChange={value => {
                                          let digits = validDigits(value)
                                          onChangeMaxSupply(item, Math.floor(digits))
                                          onChangeSupply(item, Math.floor(digits))
                                        }}
                                        min={0}
                                        placeholder="Provide of maxmium supply of editions"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {collectionFiles.length > 0 && (
                    <div
                      className="flex mt-[20px]"
                      onClick={() => {
                        setAddMoreClicked(true)
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
              </div>
              {collectionFiles.length > 0 && (
                <div className="w-full flex justify-end mt-[40px]">
                  <GradientButton
                    disabled={disabledNextButton}
                    label="Next"
                    width={122}
                    height={53}
                    borderRadius={30}
                    onClick={() => onNext()}
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <video controls className="hidden w-full h-full z-10" id="hidden_video"></video>
          </div>
        </div>
      ) : (
        // mobile part
        <div className="g-container mb-[47px]">
          <div className="w-full flex flex-wrap justify-center">
            {/* banner part */}
            <div className="w-full flex flex-wrap justify-center z-10">
              {/* banner image */}
              <div className="w-full flex justify-center">
                <div
                  className={styles.imageArea}
                  style={{ width: artWidth, height: artWidth, marginLeft: '-16px', marginRight: '-16px' }}
                >
                  {selectedCollectionFile !== undefined && selectedCollectionFile.type !== 'vr' && (
                    <div className="absolute inset-0 flex justify-center items-center">
                      <img
                        src={
                          selectedCollectionFile.croppedImage !== ''
                            ? selectedCollectionFile.croppedImage
                            : URL.createObjectURL(selectedCollectionFile.file)
                        }
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {selectedCollectionFile !== undefined && selectedCollectionFile.type === 'vr' ? (
                    selectedCollectionFile.url && (
                      <ModelViewer
                        path={selectedCollectionFile.url}
                        preserveDrawingBuffer
                        getSnapshot={{
                          onSnapshot: image => {
                            addCoverImageToFile(selectedCollectionFile, URL.createObjectURL(image))
                            setTakeSnapshotStatus(false)
                          },
                          status: takeSnapshotStatus,
                        }}
                      />
                    )
                  ) : selectedCollectionFile !== undefined && selectedCollectionFile.type === 'video' ? (
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
                </div>
              )}
            </div>
          </div>

          <div className="w-full">
            <div
              className={`${styles.subTitle} ${selectedCollectionFile?.type === 'audio' ? '-mt-[10px]' : 'mt-[20px]'}`}
            >
              Upload Art (max 20 files) *
            </div>
            <div className="mt-5">
              <Dropzone
                onDrop={acceptedFiles => {
                  setAddMoreClicked(true)
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
                  'model/gltf-binary': ['.glb'],
                }}
                maxFiles={25}
                maxSize={104857600}
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
                        .png .jpeg .mp4 .gif .mp3 .glb
                      </p>
                      <p className={styles.greenText}>Max File Size 100mb</p>
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
                  className="my-[30px] gap-4 cursor-pointer"
                  key={index}
                  onClick={() => handleSelectedCollectionFile(item)}
                >
                  <div className="flex justify-between mb-8">
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
                      ) : item.type === 'vr' && !item.nftCoverImage ? (
                        <p className={styles.tapToView}>Click to Preview</p>
                      ) : (
                        <NextImage
                          src={
                            item.type === 'vr' && item.nftCoverImage
                              ? item.nftCoverImage
                              : item.croppedImage !== ''
                              ? item.croppedImage
                              : URL.createObjectURL(item.file)
                          }
                          alt=""
                          width={
                            selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 76 : 78
                          }
                          height={
                            selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 76 : 78
                          }
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      )}
                    </div>

                    <div onClick={() => onRemoveCollectionFile(item)}>
                      <TrashBinSmall />
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="flex-1 block h-[120px]">
                      <div className={`mb-2 ${styles.subTitle}`}>
                        Artwork Name <span>*</span>
                      </div>
                      <div>
                        <Input
                          value={limit(item.name, 32)}
                          placeholder="Give your art a name"
                          label01={item.file?.name}
                          label02={32 - item.name.length === 32 ? '' : `${32 - item.name.length} Characters left`}
                          fullWidth
                          onChange={value => onChangeCollectionName(item, limit(value, 32))}
                          height="46px"
                        />
                      </div>
                    </div>
                    <div className="flex-1 block h-[120px]">
                      <div className={`mb-2 ${styles.subTitle}`}>Description</div>
                      <div>
                        <Textarea
                          value={item.description}
                          placeholder="Add a short description..."
                          fullWidth
                          label=""
                          onChange={value => onChangeCollectionDescription(item, value)}
                          height="90px"
                        />
                      </div>
                    </div>

                    {item.type === 'vr' && (
                      <>
                        <div className={styles.coverImgMsg}>
                          <h6>
                            Cover Photo <span>*</span>
                          </h6>
                          <p>Pick the best angle to take a snapshot or upload an image to use as the cover photo.</p>
                        </div>
                        <div className={styles.coverBtnBox}>
                          <button disabled={item.nftCoverImage !== null} onClick={() => setTakeSnapshotStatus(true)}>
                            <ImageIcon /> Take Snapshot
                          </button>
                          <button disabled={item.nftCoverImage !== null}>
                            <label htmlFor="fileInput">
                              <ShareIcon /> Upload Photo
                            </label>
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            onClick={e => e.stopPropagation()}
                            onChange={e => {
                              const file = e.target.files[0]
                              if (file && file.type.startsWith('image/')) {
                                addCoverImageToFile(selectedCollectionFile, file)
                                setOpenCoverImageEditorModal(true)
                              } else {
                                alert('Please select an image file.')
                              }
                            }}
                          />
                        </div>

                        {item.nftCoverImage && (
                          <div className="w-full">
                            <div
                              className={styles.glbNftImageSection}
                              onMouseEnter={() => setShowDelete(true)}
                              onMouseLeave={() => setShowDelete(false)}
                              onClick={() => setShowDelete(!showDelete)}
                            >
                              <img className="w-full aspect-square" src={item.nftCoverImage} alt="" />
                              {showDelete && (
                                <div className={styles.deleteArea}>
                                  <div
                                    onClick={() => {
                                      setShowDelete(false)
                                      addCoverImageToFile(selectedCollectionFile, null)
                                    }}
                                  >
                                    Delete
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {/* Editins */}
                  <div className="w-full mb-[30px] mt-[30px]">
                    <div className={styles.subTitle}>
                      Edition type <span>*</span>
                    </div>
                    <div className="w-full mt-[15px]">
                      <ProductionListMenu
                        label={item.editionType.label}
                        data={EditionList}
                        selectedItem={item.editionType}
                        setSelectedItem={data => {
                          onChangeEditionType(item, data)
                        }}
                      />
                    </div>
                    {item.editionType.id === 0 && (
                      <div className="mt-[15px]">
                        <div className={styles.maxSupplyTitle}>
                          Max Supply <span>*</span>
                        </div>
                        <div className={styles.editionDescription}>The max number of copies that will be created</div>
                        <div className="flex flex-wrap gap-[20px] mt-[16px] lg:mt-[25px]">
                          {MaxNumberList.map((number, index) => (
                            <div
                              key={index}
                              className={`${
                                item.maxNum?.id === number.id ? styles.mobileSelectSupply : styles.mobileNoneSupply
                              } ${number.id === 3 ? 'w-[120px]' : 'w-[50px]'}`}
                              onClick={() => {
                                onChangeMaxNum(item, number)
                                onChangeMaxSupply(item, number.value)
                                onChangeSupply(item, 0)
                              }}
                            >
                              {number.id === 3 ? number.label : number.value}
                            </div>
                          ))}
                        </div>
                        {item.maxNum && item.maxNum['id'] === 3 && (
                          <div className="max-w-[450px] mt-[15px] lg:mt-[30px]">
                            <div className={styles.maxTitle}>
                              Custom Supply <span>*</span>
                            </div>
                            <div className="mt-[15px]">
                              <Input
                                value={item.supply}
                                onChange={value => {
                                  let digits = validDigits(value)
                                  onChangeMaxSupply(item, Math.floor(digits))
                                  onChangeSupply(item, Math.floor(digits))
                                }}
                                min={0}
                                placeholder="Provide of maxmium supply of editions"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {collectionFiles.length > 0 && (
            <div
              className="flex mt-[20px]"
              onClick={() => {
                setAddMoreClicked(true)
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
          <div className="w-full my-[30px]">
            <div className="w-full">
              <OutlineButton fullWidth label="Back" type="back" onClick={() => router.back()} />
            </div>
            <div className="w-full mt-[15px]">
              {coverImageProcessing ? (
                <LoadingPrimaryButton fullWidth />
              ) : (
                <GradientButton
                  fullWidth
                  label="Next"
                  disabled={disabledNextButton}
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
