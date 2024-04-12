import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// next components
import Image from 'next/image'

// third party components
import Dropzone from 'react-dropzone'
import { limit } from 'utils/strings'

// components
import Alert from 'components/Alert'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import Chip from 'components/Chip'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import GradientButton from 'components/Button/GradientButton'
import CheckboxGroup from 'components/Checkbox/CheckboxGroup'
import CategoryListModal from 'components/Modal/CategoryListModal'

// custom functions
import { useViewport, namePublicFile } from 'utils'
import { EACollectionInfo, getEACollectionInfo } from 'utils/collection.util'

// images and icons
import EditorGreenIcon from 'assets/icons/editor-green.svg?component'
import ArrowDownIcon from 'assets/icons/arrow-down-white.svg?component'
// import FosterLogoSmall from 'assets/icons/foster-logo-small.svg?component'
// import EAImportIcon from 'assets/icons/ea-import-icon.svg?component'

// json
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

// call apis
import uploadFileToS3API from 'apis/aws'
import ImportEAModal from 'components/Modal/ImportEAModal'
import { validDigits } from 'utils/helpers'
import LoadingButton from 'components/Button/LoadingButton'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'
import { useRouter } from 'next/router'
import Button from 'components/Button'

const Step01CollectionSection = props => {
  const {
    currentStep,
    onChangeCurrentStep,
    collectionName,
    onChangeCollectionName,
    description,
    onChangeDescription,
    coverImage,
    onChangeCoverImage,
    coverCroppedImage,
    setCoverCroppedImage,
    setCoverAWSUrl,
    bannerImage,
    onChangeBannerImage,
    bannerCroppedImage,
    setBannerCroppedImage,
    setBannerAWSUrl,
    royalties,
    onChangeRoyalties,
    categoryList,
    onChangeCategoryList,
    setDisabledButton,
  } = props
  const viewport = useViewport()
  const router = useRouter()

  const collectionKind = useSelector<any>(state => state.collectionKind)

  // variables
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [collectionType, setCollectionType] = useState<any>('foster')
  const [showEAModal, setShowEAModal] = useState(false)
  const [eaImportUrl, setEAImportUrl] = useState('')
  const [eaCollectionInfo, setEACollectionInfo] = useState<EACollectionInfo | null>(null)
  const [eaTags, setEATags] = useState<string[]>([])
  const [enableImageDialog, setEnableImageDialog] = useState(false)
  const [enableCoverImageDialog, setEnableCoverImageDialog] = useState(false)

  useEffect(() => {
    setCollectionType(collectionKind)
    if (collectionKind === 'ea') {
      setShowEAModal(true)
    }
  }, [collectionKind])

  const handleShowAlert = (type, error) => {
    if (error === 'file-invalid-type') {
      setAlertData([
        {
          id: 0,
          title: 'File Format Not Supported',
          description: `Supported file formats for ${type} image include .png, .jpeg and .gif`,
          type: 'error',
        },
      ])
    } else if (error === 'file-too-large') {
      setAlertData([
        {
          id: 0,
          title: 'Max File Size Exceeded',
          description: `Oops! It looks like your file exceeded the max file size of ${
            type === 'cover' ? '10mb' : '30mb'
          }`,
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

  const [openCoverImageEditorModal, setOpenCoverImageEditorModal] = useState(false)
  const [openBannerImageEditorModal, setOpenBannerImageEditorModal] = useState(false)
  const [disabledNextButton, setDisabledNextButton] = useState(true)

  const [updateBannerImage, setUpdateBannerImage] = useState(false)
  const [updateCoverImage, setUpdateCoverImage] = useState(false)

  useEffect(() => {
    if (coverImage !== null && coverImage !== undefined && enableCoverImageDialog) {
      if (coverImage[0].type.split('/')[0] === 'image' && coverImage[0].type !== 'image/gif') {
        setOpenCoverImageEditorModal(true)
      }
      setEnableCoverImageDialog(false)
    }
  }, [coverImage, enableImageDialog])

  useEffect(() => {
    if (bannerImage !== null && bannerImage !== undefined && enableImageDialog) {
      if (bannerImage[0].type.split('/')[0] === 'image' && bannerImage[0].type !== 'image/gif') {
        setOpenBannerImageEditorModal(true)
      }
      setEnableImageDialog(false)
    }
  }, [bannerImage, enableImageDialog])

  useEffect(() => {
    if (bannerCroppedImage !== '' && updateBannerImage) {
      const fetchData = async url => {
        let response = await fetch(url)
        let blob = await response.blob()
        const file = new File([blob], 'avatar.jpg', {
          type: 'image/jpeg',
        })
        const filename = namePublicFile('avatar.jpg')
        uploadBannerFile(file, filename)
      }
      fetchData(bannerCroppedImage)
      setUpdateBannerImage(false)
    }
  }, [updateBannerImage])

  const uploadBannerFile = async (file: any, filename: string) => {
    const { url } = await uploadFileToS3API(file, filename)
    setBannerAWSUrl(url)
  }

  useEffect(() => {
    if (coverCroppedImage !== '' && updateCoverImage) {
      const fetchData = async url => {
        let response = await fetch(url)
        let blob = await response.blob()
        const file = new File([blob], 'avatar.jpg', {
          type: 'image/jpeg',
        })
        const filename = namePublicFile('avatar.jpg')
        uploadCoverfile(file, filename)
      }
      fetchData(coverCroppedImage)
      setUpdateCoverImage(false)
    }
  }, [updateCoverImage])

  const uploadCoverfile = async (file: any, filename: string) => {
    const { url } = await uploadFileToS3API(file, filename)
    setCoverAWSUrl(url)
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

  const importEACollection = async url => {
    setShowEAModal(false)
    setEAImportUrl(url)

    try {
      let collectionInfo = await getEACollectionInfo(url)
      setEACollectionInfo(collectionInfo)

      let { name, description, primaryCategory, secondaryCategory, tags = [] } = collectionInfo.info

      let eaTags = [primaryCategory, secondaryCategory, ...tags]
      let eaTagSet = new Set(eaTags.filter(tag => typeof tag == 'string').map(tag => tag.toLowerCase()))
      let checkedCount = 0
      let fosterCategories = [...categoryList]
      for (let category of fosterCategories)
        if (eaTagSet.has(category.name.toLowerCase()) && checkedCount < 3) {
          category.checked = true
          checkedCount++
        }
      onChangeCategoryList(fosterCategories)

      onChangeCollectionName(name)
      onChangeDescription(description)
      setEATags(eaTags)

      let { thumbnailPath, bannerPath } = collectionInfo.assets
      let coverName = thumbnailPath.match(/[^\/]*$/)?.[0] || 'cover.png'
      let bannerName = bannerPath.match(/[^\/]*$/)?.[0] || 'banner.png'
      let [coverBlob, bannerBlob] = await Promise.all([
        fetch(thumbnailPath)
          .then(r => r.blob())
          .catch(e => e),
        fetch(bannerPath)
          .then(r => r.blob())
          .catch(e => e),
      ])

      if (coverBlob instanceof Blob) {
        setEnableCoverImageDialog(true)
        onChangeCoverImage([
          new File([coverBlob], coverName, {
            type: coverBlob.type,
          }),
        ])
      } else {
        console.error(`could not fetch EA collection image from ${thumbnailPath}: ${coverBlob?.message}`)
        // TODO: show error message
      }

      await new Promise(resolve => setTimeout(resolve, 1))

      if (bannerBlob instanceof Blob) {
        setEnableImageDialog(true)
        onChangeBannerImage([
          new File([bannerBlob], bannerName, {
            type: bannerBlob.type,
          }),
        ])
      } else {
        console.error(`could not fetch EA banner image from ${bannerPath}: ${bannerBlob?.message}`)
        // TODO: show error message
      }
    } catch (e) {
      console.error(e)
      // TODO: show error message
    }
  }

  useEffect(() => {
    let count = 0
    categoryList.map(item => {
      if (item.checked === true) count++
    })

    if (
      collectionName !== '' &&
      description !== '' &&
      count <= 3 &&
      coverCroppedImage !== undefined &&
      bannerCroppedImage !== undefined
    ) {
      setDisabledNextButton(false)
      setDisabledButton(false)
    } else {
      setDisabledNextButton(true)
      setDisabledButton(true)
    }
  }, [
    collectionName,
    description,
    coverCroppedImage,
    bannerCroppedImage,
    coverImage,
    bannerImage,
    categoryList,
    royalties,
  ])

  const [bannerHelper, setBannerHelper] = useState(false)
  const [coverHelper, setCoverHelper] = useState(false)

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="w-full grid grid-cols-12 gap-0">
          {/* left part */}
          <div className="relative col-span-12 lg:col-span-6 g-left-container">
            <div className={styles.leftContainer}>
              <div className="w-full">
                <div className={styles.collectionBannerImage}>
                  Collection Banner Image<span>*</span>
                </div>
                <div className="w-full mt-[15px]">
                  <div className={styles.bannerImageArea}>
                    {bannerCroppedImage === undefined ? (
                      <div>
                        <Dropzone
                          onDrop={acceptedFiles => {
                            if (acceptedFiles.length !== 0) {
                              setEnableImageDialog(true)
                              onChangeBannerImage(acceptedFiles)
                            } else handleShowAlert('banner', 'uknown')
                          }}
                          onDropRejected={rejectedFiles => {
                            handleShowAlert('banner', rejectedFiles[0]?.errors[0]?.code)
                          }}
                          maxFiles={1}
                          accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                          maxSize={104857600}
                        >
                          {({ getRootProps, getInputProps, open }) => (
                            <section className={styles.dropzone}>
                              <div {...getRootProps()} className={styles.selectBannerArea}>
                                <input {...getInputProps()} />
                                <p className={styles.subTitle}>Upload file</p>
                                <p className={styles.text}>Supported File Formats .png and .jpeg</p>
                                <p className={styles.greenText}>Max File Size 100mb</p>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </div>
                    ) : (
                      <div>
                        <Image src={bannerCroppedImage} width={760} height={218} alt="" objectFit="cover" />
                        <div className="absolute bottom-2 right-[10px] z-[1000]">
                          <Dropzone
                            onDrop={acceptedFiles => {
                              if (acceptedFiles.length !== 0) {
                                setEnableImageDialog(true)
                                onChangeBannerImage(acceptedFiles)
                              } else handleShowAlert('banner', 'uknown')
                            }}
                            onDropRejected={rejectedFiles => {
                              handleShowAlert('banner', rejectedFiles[0]?.errors[0]?.code)
                            }}
                            maxFiles={1}
                            accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                            maxSize={104857600}
                          >
                            {({ getRootProps, getInputProps, open }) => (
                              <section>
                                <button onClick={open} style={{ display: 'none' }}>
                                  open
                                </button>
                                <div {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <div className={styles.iconBlurView}>
                                    <div className="w-full h-full flex justify-center items-center">
                                      <IconButtonWithSVG
                                        width={40}
                                        height={40}
                                        iconWidth={40}
                                        iconHeight={40}
                                        icon={<EditorGreenIcon />}
                                        onClick={() => {}}
                                        backgroundColor="transparent"
                                        borderColor="transparent"
                                        borderRadius="100%"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </section>
                            )}
                          </Dropzone>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* <div className="absolute z-10">
                  <div className={`${styles.dropzoneTitle} w-full flex justify-start items-center mt-[10px] mb-[15px]`}>
                    <div className={styles.collectionBannerImage}>Collection Banner Image</div>

                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setBannerHelper(true)
                        setTimeout(() => {
                          setBannerHelper(false)
                        }, 2000)
                      }}
                    >
                      <InfoCircleLightGreenIcon alt="" />
                    </div>
                  </div>
                  {bannerHelper && (
                    <div className={styles.bannerRecommend}>Recommended dimensions are 1920px by 452px</div>
                  )}
                </div> */}
                <div className="relative mt-[34px]">
                  <div className={styles.collectionBannerImage}>
                    Collection Cover Image<span>*</span>
                  </div>
                  <div className="w-full flex justify-start z-0 mt-[15px]">
                    <div className={styles.coverImageArea}>
                      {coverCroppedImage === undefined ? (
                        <Dropzone
                          onDropAccepted={acceptedFiles => {
                            if (acceptedFiles.length !== 0) {
                              setEnableCoverImageDialog(true)
                              onChangeCoverImage(acceptedFiles)
                            } else handleShowAlert('cover', 'unknown')
                          }}
                          onDropRejected={rejectedFiles => {
                            handleShowAlert('cover', rejectedFiles[0]?.errors[0]?.code)
                          }}
                          maxFiles={1}
                          accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                          maxSize={10485760}
                        >
                          {({ getRootProps, getInputProps, open }) => (
                            <section className={styles.dropzone}>
                              <div {...getRootProps()} className={styles.selectArea}>
                                <input {...getInputProps()} />
                                <p className={styles.subTitleCover}>Upload file</p>
                                <p className={styles.textCover}>Supported File Formats .png and .jpeg</p>
                                <p className={styles.greenTextCover}>Max File Size 10mb</p>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      ) : (
                        <div>
                          <Image src={coverCroppedImage} width={200} height={200} alt="" objectFit="cover" />
                          <div className="absolute bottom-2 right-[10px]">
                            <Dropzone
                              onDropAccepted={acceptedFiles => {
                                if (acceptedFiles.length !== 0) {
                                  setEnableCoverImageDialog(true)
                                  onChangeCoverImage(acceptedFiles)
                                } else handleShowAlert('cover', 'unknown')
                              }}
                              onDropRejected={rejectedFiles => {
                                handleShowAlert('cover', rejectedFiles[0]?.errors[0]?.code)
                              }}
                              maxFiles={1}
                              accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                              maxSize={10485760}
                            >
                              {({ getRootProps, getInputProps, open }) => (
                                <section>
                                  <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <div className={styles.iconBlurView}>
                                      <div className="w-full h-full flex justify-center items-center">
                                        <IconButtonWithSVG
                                          width={40}
                                          height={40}
                                          iconWidth={40}
                                          iconHeight={40}
                                          icon={<EditorGreenIcon />}
                                          onClick={() => {}}
                                          backgroundColor="rgba(var(--background-main-color-rgb), 0.75)"
                                          borderColor="transparent"
                                          borderRadius="100%"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </section>
                              )}
                            </Dropzone>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className={`${styles.dropzoneTitle} relative w-full flex justify-center items-center mt-[10px]`}>
                    Collection Cover Image
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setCoverHelper(true)
                        setTimeout(() => {
                          setCoverHelper(false)
                        }, 2000)
                      }}
                    >
                      <InfoCircleLightGreenIcon alt="" />
                    </div>
                    {coverHelper && (
                      <div className={`${styles.bannerRecommend} absolute right-0 top-5 2xl:top-0`}>
                        Recommended dimensions are 1080px by 1080px
                      </div>
                    )}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          {/* right part */}
          <div className="col-span-12 lg:col-span-6 g-right-container z-0">
            <div className={styles.rightContainer}>
              <div className="w-full relative">
                {/* upload artwork part */}
                <div className="w-full">
                  <div className={`${styles.subTitle} mt-[20px]`}>
                    Collection Name <span>*</span>
                  </div>
                  <div className="w-full mt-[15px]">
                    <Input
                      value={limit(collectionName, 32)}
                      placeholder="Give your collection name"
                      label01="Max Characters 32"
                      label02={32 - collectionName.length === 32 ? '' : `${32 - collectionName.length} Characters left`}
                      onChange={value => onChangeCollectionName(limit(value, 32))}
                    />
                  </div>
                  <div className={`${styles.subTitle} mt-[30px]`}>
                    Description <span>*</span>
                  </div>
                  <div className="w-full mt-[15px]">
                    <Textarea
                      value={limit(description, 1000)}
                      placeholder="Add a short description..."
                      height={152}
                      label01="Max Characters 1000"
                      label02={
                        1000 - description.length <= 0 || 1000 - description.length === 1000
                          ? ''
                          : `${1000 - description.length} Characters left`
                      }
                      onChange={value => onChangeDescription(limit(value, 1000))}
                    />
                  </div>

                  <div className={`${styles.subTitle} mt-[30px] flex justify-start items-center gap-2`}>
                    Royalties <span>*</span>
                  </div>

                  <div className="max-w-[370px] w-full mt-[15px]">
                    <Input
                      value={royalties}
                      placeholder="Insert a royalty percentage"
                      label01="From 0 to 10%"
                      min="0"
                      onChange={value => {
                        let royal = validDigits(value)
                        if (royal > 10) {
                          onChangeRoyalties(10)
                        } else {
                          onChangeRoyalties(Math.floor(royal))
                        }
                      }}
                    />
                  </div>
                  <div className={`${styles.subTitle} mt-[30px]`}>Category (optional)</div>
                  <div className={`${styles.categoryDesc} mt-[9px]`}>Select up to three categories</div>
                  <div className="w-full mt-[15px]">
                    <CheckboxGroup categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // mobile part
        <div className="g-container mt-[26px] mb-[47px]">
          {/* CollectionStepper part */}
          {/* <div className="w-full">
            <div className={styles.collectionTypeSection}>
              <div
                className={collectionType === 'foster' ? styles.selectedType : styles.deSelectedType}
                onClick={() => setCollectionType('foster')}
              >
                <FosterLogoSmall />
                <div className="lg:block hidden">Create New Collection</div>
                <div className="lg:hidden block">New Collection</div>
              </div>
              <div
                className={collectionType === 'ea' ? styles.selectedType : styles.deSelectedType}
                onClick={() => {
                  setShowEAModal(true)
                  setCollectionType('ea')
                }}
              >
                <EAImportIcon />
                Import EA Series
              </div>
            </div>
          </div> */}

          <div className="w-full flex flex-wrap justify-center mt-[22px]">
            {/* <div className="w-full relative z-10">
              <div
                className={`${styles.dropzoneTitle} w-full flex justify-start items-center mt-[15px] mb-[15px] gap-[10px]`}
              >
                Collection Banner Image
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setBannerHelper(true)
                    setTimeout(() => {
                      setBannerHelper(false)
                    }, 2000)
                  }}
                >
                  <InfoCircleLightGreenIcon alt="" />
                </div>
              </div>

              {bannerHelper && (
                <div className={`${styles.bannerRecommend} absolute top-[50px]`}>
                  Recommended dimensions are 1920px by 452px
                </div>
              )}
            </div> */}
            <div className="w-full flex justify-start">
              <div className={styles.collectionBannerImage}>
                Collection Banner Image<span>*</span>
              </div>
            </div>
            <div className="w-full z-0 mt-[9px]">
              <div className={styles.bannerImageArea}>
                {bannerCroppedImage === undefined ? (
                  <div>
                    <Dropzone
                      onDrop={acceptedFiles => {
                        if (acceptedFiles.length !== 0) {
                          setEnableImageDialog(true)
                          onChangeBannerImage(acceptedFiles)
                        }
                        handleShowAlert('banner', 'uknown')
                      }}
                      onDropRejected={rejectedFiles => {
                        handleShowAlert('banner', rejectedFiles[0]?.errors[0]?.code)
                      }}
                      maxFiles={1}
                      accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                      maxSize={104857600}
                    >
                      {({ getRootProps, getInputProps, open }) => (
                        <section className={styles.dropzone}>
                          <div {...getRootProps()} className={styles.selectBannerArea}>
                            <input {...getInputProps()} />
                            <p className={styles.subTitle}>Upload Here</p>
                            <p className={styles.text}>Supported file formats are .png .jpeg</p>
                            <p className={styles.greenText}>Max File Size 100mb</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                ) : (
                  <div className="relative">
                    <Image src={bannerCroppedImage} width={375} height={120} alt="" objectFit="cover" />
                    <div className="absolute bottom-2 right-[10px]">
                      <Dropzone
                        onDrop={acceptedFiles => {
                          if (acceptedFiles.length !== 0) {
                            setEnableImageDialog(true)
                            onChangeBannerImage(acceptedFiles)
                          } else handleShowAlert('banner', 'uknown')
                        }}
                        onDropRejected={rejectedFiles => {
                          handleShowAlert('banner', rejectedFiles[0]?.errors[0]?.code)
                        }}
                        maxFiles={1}
                        accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                        maxSize={104857600}
                      >
                        {({ getRootProps, getInputProps, open }) => (
                          <section>
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div className={styles.iconBlurView}>
                                <div className="w-full h-full flex justify-center items-center">
                                  <IconButtonWithSVG
                                    width={40}
                                    height={40}
                                    iconWidth={40}
                                    iconHeight={40}
                                    icon={<EditorGreenIcon />}
                                    onClick={() => {}}
                                    backgroundColor="transparent"
                                    borderColor="transparent"
                                    borderRadius="100%"
                                  />
                                </div>
                              </div>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-wrap justify-center mt-[30px]">
            {/* <div className="w-full relative z-10">
              <div
                className={`${styles.dropzoneTitle} w-full flex justify-start items-center gap-2 mt-[15px] mb-[15px]`}
              >
                Collection Cover Image
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setCoverHelper(true)
                    setTimeout(() => {
                      setCoverHelper(false)
                    }, 2000)
                  }}
                >
                  <InfoCircleLightGreenIcon alt="" />
                </div>
              </div>

              {coverHelper && (
                <div className={`${styles.bannerRecommend} absolute top-[50px]`}>
                  Recommended dimensions are 1080px by 1080px
                </div>
              )}
            </div> */}
            <div className="w-full flex justify-start">
              <div className={styles.collectionBannerImage}>
                Collection Cover Image<span>*</span>
              </div>
            </div>
            <div className="w-full z-0 mt-[9px]">
              <div className={styles.coverImageArea}>
                {coverCroppedImage === undefined ? (
                  <Dropzone
                    onDropAccepted={acceptedFiles => {
                      if (acceptedFiles.length !== 0) {
                        setEnableImageDialog(true)
                        onChangeCoverImage(acceptedFiles)
                      } else handleShowAlert('cover', 'unknown')
                    }}
                    onDropRejected={rejectedFiles => {
                      handleShowAlert('cover', rejectedFiles[0]?.errors[0]?.code)
                    }}
                    maxFiles={1}
                    accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                    maxSize={104857600}
                  >
                    {({ getRootProps, getInputProps, open }) => (
                      <section className={styles.dropzone}>
                        <div {...getRootProps()} className={styles.selectArea}>
                          <input {...getInputProps()} />
                          <p className={styles.subTitle}>Upload Here</p>
                          <p className={styles.text}>Supported file formats are .png .jpeg</p>
                          <p className={styles.greenText}>Max File Size 100mb</p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                ) : (
                  <div>
                    <Image src={coverCroppedImage} width={140} height={140} alt="" objectFit="cover" />
                    <div className="absolute bottom-2 right-[10px]">
                      <Dropzone
                        onDropAccepted={acceptedFiles => {
                          if (acceptedFiles.length !== 0) {
                            setEnableImageDialog(true)
                            onChangeCoverImage(acceptedFiles)
                          } else handleShowAlert('cover', 'unknown')
                        }}
                        onDropRejected={rejectedFiles => {
                          handleShowAlert('cover', rejectedFiles[0]?.errors[0]?.code)
                        }}
                        maxFiles={1}
                        accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                        maxSize={104857600}
                      >
                        {({ getRootProps, getInputProps, open }) => (
                          <section>
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div className={styles.iconBlurView}>
                                <div className="w-full h-full flex justify-center items-center">
                                  <IconButtonWithSVG
                                    width={40}
                                    height={40}
                                    iconWidth={40}
                                    iconHeight={40}
                                    icon={<EditorGreenIcon />}
                                    onClick={() => {}}
                                    backgroundColor="transparent"
                                    borderColor="transparent"
                                    borderRadius="100%"
                                  />
                                </div>
                              </div>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* upload artwork part */}
          <div className="w-full">
            <div className={`${styles.subTitle} mt-[30px]`}>
              Collection Name <span>*</span>
            </div>
            <div className="max-w-[370px] w-full mt-[15px] z-10">
              <Input
                value={limit(collectionName, 32)}
                placeholder="Give your art name"
                label01="Max Characters 32"
                label02={32 - collectionName.length === 32 ? '' : `${32 - collectionName.length} Characters left`}
                onChange={value => onChangeCollectionName(limit(value, 32))}
              />
            </div>
            <div className={`${styles.subTitle} mt-[30px]`}>
              Description <span>*</span>
            </div>
            <div className="w-full mt-[15px]">
              <Textarea
                value={limit(description, 1000)}
                placeholder="Add a short description..."
                label01="Max Characters 1000"
                label02={1000 - description.length === 1000 ? '' : `${1000 - description.length} Characters left`}
                onChange={value => onChangeDescription(value)}
              />
            </div>
            <div className={`${styles.subTitle} mt-[30px] flex justify-start items-center gap-2`}>
              Royalties <span>*</span>
            </div>
            <div className="max-w-[370px] w-full mt-[15px]">
              <Input
                value={royalties}
                placeholder="Insert a royalty percentage"
                label01="From 0 to 10%"
                min={0}
                onChange={value => {
                  let royal = validDigits(value)
                  if (royal > 10) {
                    onChangeRoyalties(10)
                  } else onChangeRoyalties(Math.floor(royal))
                }}
              />
            </div>
            <div className={`${styles.subTitle} mt-[30px]`}>Category (optional)</div>
            <div className={styles.categoryBtn} onClick={() => setShowCategoryList(true)}>
              <>Select up to three categories</>
              <ArrowDownIcon />
            </div>
            <div className="w-full mt-4">
              {/* <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1">
                  <div className={styles.chooseCategory} onClick={() => setShowCategoryList(true)}>
                    Choose Category
                  </div>
                </div>
              </div> */}
              {showCategoryList && (
                <CategoryListModal
                  data={CategoryList}
                  categoryList={categoryList}
                  onChange={index => handleSelectCategory(index)}
                  onClick={() => setShowCategoryList(!showCategoryList)}
                  onClickCancel={() => setShowCategoryList(false)}
                />
              )}
            </div>
          </div>

          <div className="w-full my-10">
            {/* button group part */}
            <div>
              <Button
                label="Back"
                onClick={() => {
                  if (currentStep === 1) router.push('/create/single-nft')
                  else onChangeCurrentStep(currentStep - 1)
                }}
                fullWidth
                fontFamily="Muli-SemiBold"
                height="50px"
                backgroundColor="transparent"
                color="var(--main-bg-color)"
                borderColor={'rgba(var(--main-bg-color-rgb), 0.1)'}
                borderWidth={1}
                fontSize={18}
              />
            </div>
            <div className="mt-[18px]">
              <GradientButton
                label="Next"
                fullWidth
                height={50}
                fontSize={18}
                borderColor="transparent"
                disabled={disabledNextButton}
                onClick={() => {
                  onChangeCurrentStep(currentStep + 1)
                }}
              />
            </div>
          </div>
        </div>
      )}

      <ImportEAModal
        open={showEAModal}
        onClose={() => {
          router.push('/create/single-nft')
          // setShowEAModal(false)
        }}
        onImportUrl={importEACollection}
      />

      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
      <NftImageEditorModal
        open={openCoverImageEditorModal}
        close={() => setOpenCoverImageEditorModal(false)}
        nftImage={coverImage}
        getCroppedImage={croppedImage => {
          setUpdateCoverImage(true)
          setCoverCroppedImage(croppedImage)
          setOpenCoverImageEditorModal(false)
        }}
        dimension={{ value: [1080, 1080] }}
      />
      <NftImageEditorModal
        open={openBannerImageEditorModal}
        close={() => setOpenBannerImageEditorModal(false)}
        nftImage={bannerImage}
        getCroppedImage={croppedImage => {
          setUpdateBannerImage(true)
          setBannerCroppedImage(croppedImage)
          setOpenBannerImageEditorModal(false)
        }}
        dimension={{ value: [758, 194] }}
      />
    </div>
  )
}

export default Step01CollectionSection
