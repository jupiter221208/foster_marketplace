import React, { useEffect, useRef, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import Dropzone from 'react-dropzone'
import { limit } from 'utils/strings'

// components
import Alert from 'components/Alert'
import IconButton from 'components/Button/IconButton'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import Chip from 'components/Chip'
import CollectionStepper from 'components/Stepper/CollectionStepper'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'
import CheckboxGroup from 'components/Checkbox/CheckboxGroup'
import CategoryListModal from 'components/Modal/CategoryListModal'

// custom functions
import { useViewport, namePublicFile } from 'utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'
import EditorGreenIcon from 'assets/icons/editor-green.svg'
import AddChangeWhiteIcon from 'assets/icons/add-change-white-46x46.svg'
import InfoCircleLightGreenIcon from 'assets/icons/info-circle-light-green-20x20.svg?component'

// json
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

// call apis
import uploadFileToS3API from 'apis/aws'

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
    mintCollection,
  } = props
  const viewport = useViewport()

  const dropzoneBannerEl = useRef(null)
  const dropzoneCoverEl = useRef(null)

  // variables
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])

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
    setOpenCoverImageEditorModal(false)
    setOpenBannerImageEditorModal(false)
  }, [])

  useEffect(() => {
    if (coverImage !== null && coverImage !== undefined) {
      if (coverImage[0].type.split('/')[0] === 'image' && coverImage[0].type !== 'image/gif') {
        setOpenCoverImageEditorModal(true)
      }
    }
  }, [coverImage])

  useEffect(() => {
    if (bannerImage !== null && bannerImage !== undefined) {
      if (bannerImage[0].type.split('/')[0] === 'image' && bannerImage[0].type !== 'image/gif') {
        setOpenBannerImageEditorModal(true)
      }
    }
  }, [bannerImage])

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
    setBannerAWSUrl(url + filename)
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
      setUpdateBannerImage(false)
    }
  }, [updateCoverImage])

  const uploadCoverfile = async (file: any, filename: string) => {
    const { url } = await uploadFileToS3API(file, filename)
    setCoverAWSUrl(url + filename)
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

    if (
      collectionName !== '' &&
      description !== '' &&
      count > 0 &&
      count <= 3 &&
      coverCroppedImage !== undefined &&
      bannerCroppedImage !== undefined
    ) {
      setDisabledNextButton(false)
    } else {
      setDisabledNextButton(true)
    }
  }, [collectionName, description, coverCroppedImage, bannerCroppedImage, categoryList])

  // form validate
  useEffect(() => {
    let count = 0
    categoryList.map(item => {
      if (item.checked === true) count++
    })
    if (
      collectionName !== '' &&
      description !== '' &&
      count > 0 &&
      count <= 3 &&
      bannerImage !== undefined &&
      coverImage !== undefined &&
      royalties >= 0 &&
      royalties <= 10
    ) {
      setDisabledNextButton(false)
    } else {
      setDisabledNextButton(true)
    }
  }, [collectionName, description, categoryList, coverImage, bannerImage, royalties])

  const [bannerHelper, setBannerHelper] = useState(false)
  const [coverHelper, setCoverHelper] = useState(false)

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="w-full grid grid-cols-12 gap-0">
          {/* left part */}
          <div className="relative col-span-12 lg:col-span-6 g-left-container">
            <div className={styles.topLeftEllipse}>
              {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
            </div>
            <div className={styles.leftContainer}>
              <div className={`${styles.title} w-full`}>Collection Cover Image & Banner</div>
              <div className="w-full mt-[57px]">
                <div className="w-full">
                  <div className={styles.bannerImageArea}>
                    {bannerImage === undefined ? (
                      <div>
                        <Dropzone
                          onDrop={acceptedFiles => {
                            acceptedFiles.length !== 0
                              ? onChangeBannerImage(acceptedFiles)
                              : handleShowAlert('banner', 'uknown')
                          }}
                          onDropRejected={rejectedFiles => {
                            handleShowAlert('banner', rejectedFiles[0]?.errors[0]?.code)
                          }}
                          maxFiles={1}
                          accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                          maxSize={31457280}
                        >
                          {({ getRootProps, getInputProps, open }) => (
                            <section className={styles.dropzone}>
                              <button onClick={open} ref={dropzoneCoverEl} style={{ display: 'none' }}>
                                open
                              </button>
                              <div {...getRootProps()} className={styles.selectBannerArea}>
                                <input {...getInputProps()} />
                                <p className={styles.subTitle}>Upload Here</p>
                                <p className={styles.text}>Supported file formats are .png .jpeg</p>
                                <p className={styles.greenText}>Max File Size 30mb</p>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </div>
                    ) : (
                      <div>
                        <Image
                          src={
                            bannerCroppedImage !== undefined ? bannerCroppedImage : URL.createObjectURL(bannerImage[0])
                          }
                          width={758}
                          height={194}
                          alt=""
                          objectFit="cover"
                          className="rounded-[20px]"
                        />
                        <div className="absolute bottom-2 right-[10px]">
                          <IconButton
                            width={30}
                            height={30}
                            iconWidth={15}
                            iconHeight={15}
                            icon={bannerCroppedImage !== undefined ? EditorGreenIcon : AddChangeWhiteIcon}
                            onClick={() => dropzoneBannerEl.current.click()}
                            backgroundColor="rgba(55, 130, 135, 0.3)"
                            borderColor="transparent"
                            borderRadius="100%"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative -mt-[50px]">
                  <div className="absolute mt-[50px] z-10">
                    <div
                      className={`${styles.dropzoneTitle} w-full flex justify-start items-center  mt-[15px] mb-[15px]`}
                    >
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
                      <div className={styles.bannerRecommend}>Recommended dimensions are 1620px by 460px</div>
                    )}
                  </div>
                  <div className="w-full flex justify-center z-0">
                    <div className={styles.coverImageArea}>
                      {coverCroppedImage === undefined && coverImage === undefined ? (
                        // <div className={styles.defaultCoverLight} />
                        <Dropzone
                          onDropAccepted={acceptedFiles => {
                            acceptedFiles.length !== 0
                              ? onChangeCoverImage(acceptedFiles)
                              : handleShowAlert('cover', 'unknown')
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
                              <button onClick={open} ref={dropzoneCoverEl} style={{ display: 'none' }}>
                                open
                              </button>
                              <div {...getRootProps()} className={styles.selectArea}>
                                <input {...getInputProps()} />
                                <p className={styles.subTitleCover}>Upload Here</p>
                                <p className={styles.textCover}>Supported file formats are .png .jpeg</p>
                                <p className={styles.greenTextCover}>Max File Size 10mb</p>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      ) : (
                        <div>
                          <Image
                            src={
                              coverCroppedImage !== undefined ? coverCroppedImage : URL.createObjectURL(coverImage[0])
                            }
                            width={200}
                            height={200}
                            alt=""
                            objectFit="cover"
                            className="rounded-[20px]"
                          />
                          <div className="absolute bottom-2 right-[10px]">
                            <IconButton
                              width={30}
                              height={30}
                              iconWidth={15}
                              iconHeight={15}
                              icon={coverCroppedImage !== undefined ? EditorGreenIcon : AddChangeWhiteIcon}
                              onClick={() => dropzoneCoverEl.current.click()}
                              backgroundColor="rgba(55, 130, 135, 0.3)"
                              borderColor="transparent"
                              borderRadius="100%"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`${styles.dropzoneTitle} relative w-full flex justify-center items-center mt-[15px]`}>
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
                  </div>
                </div>
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
                  {categoryList.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
                </div>
              )}
            </div>
          </div>
          {/* right part */}
          <div className="col-span-12 lg:col-span-6 g-right-container z-0">
            <div className={styles.rightContainer}>
              <div className="w-full relative">
                <div className="w-full">
                  <CollectionStepper currentStep={currentStep} />
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
                      value={limit(description, 1000)}
                      placeholder="Add a short description..."
                      label01="Max Characters 1000"
                      label02={
                        1000 - description.length <= 0 || 1000 - description.length === 1000
                          ? ''
                          : `${1000 - description.length} Characters left`
                      }
                      onChange={value => onChangeDescription(limit(value, 1000))}
                    />
                  </div>

                  <div className={`${styles.subTitle} mt-10 flex justify-start items-center gap-2`}>
                    Royalties * <InfoCircleLightGreenIcon alt="" />
                  </div>

                  <div className="max-w-[370px] w-full mt-5">
                    <Input
                      value={royalties}
                      placeholder="Insert a royalty percentage"
                      label="From 0 to 10%"
                      type="number"
                      min="0"
                      onChange={value => {
                        if (value > 10) {
                          onChangeRoyalties(10)
                        } else {
                          onChangeRoyalties(Math.floor(value))
                        }
                      }}
                    />
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
                      onClick={() => mintCollection()}
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
            <div className="w-full relative z-10">
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
            </div>

            <div className="w-full z-0">
              <div className={styles.coverImageArea}>
                {coverCroppedImage === undefined && coverImage === undefined ? (
                  <Dropzone
                    onDropAccepted={acceptedFiles => {
                      acceptedFiles.length !== 0
                        ? onChangeCoverImage(acceptedFiles)
                        : handleShowAlert('cover', 'unknown')
                    }}
                    onDropRejected={rejectedFiles => {
                      handleShowAlert('cover', rejectedFiles[0]?.errors[0]?.code)
                    }}
                    maxFiles={1}
                    accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                    maxSize={31457280}
                  >
                    {({ getRootProps, getInputProps, open }) => (
                      <section className={styles.dropzone}>
                        <button onClick={open} ref={dropzoneCoverEl} style={{ display: 'none' }}>
                          open
                        </button>
                        <div {...getRootProps()} className={styles.selectArea}>
                          <input {...getInputProps()} />
                          <p className={styles.subTitle}>Upload Here</p>
                          <p className={styles.text}>Supported file formats are .png .jpeg</p>
                          <p className={styles.greenText}>Max File Size 30mb</p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                ) : (
                  <div>
                    <Image
                      src={coverCroppedImage !== undefined ? coverCroppedImage : URL.createObjectURL(coverImage[0])}
                      width={140}
                      height={140}
                      alt=""
                      objectFit="cover"
                      className="rounded-[20px]"
                    />
                    <div className="absolute bottom-2 right-[10px]">
                      <IconButton
                        width={30}
                        height={30}
                        iconWidth={15}
                        iconHeight={15}
                        icon={coverCroppedImage !== undefined ? EditorGreenIcon : AddChangeWhiteIcon}
                        onClick={() => dropzoneCoverEl.current.click()}
                        backgroundColor="rgba(55, 130, 135, 0.3)"
                        borderColor="transparent"
                        borderRadius="100%"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-wrap justify-center mt-[22px]">
            <div className="w-full relative z-10">
              <div className={`${styles.dropzoneTitle} w-full flex justify-start items-center mt-[15px] mb-[15px]`}>
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
                  Recommended dimensions are 1620px by 460px
                </div>
              )}
            </div>

            <div className="w-full z-0">
              <div className={styles.bannerImageArea}>
                {bannerImage === undefined ? (
                  <div>
                    <Dropzone
                      onDrop={acceptedFiles => {
                        acceptedFiles.length !== 0
                          ? onChangeBannerImage(acceptedFiles)
                          : handleShowAlert('banner', 'uknown')
                      }}
                      onDropRejected={rejectedFiles => {
                        handleShowAlert('banner', rejectedFiles[0]?.errors[0]?.code)
                      }}
                      maxFiles={1}
                      accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                      maxSize={31457280}
                    >
                      {({ getRootProps, getInputProps, open }) => (
                        <section className={styles.dropzone}>
                          <button onClick={open} ref={dropzoneCoverEl} style={{ display: 'none' }}>
                            open
                          </button>
                          <div {...getRootProps()} className={styles.selectBannerArea}>
                            <input {...getInputProps()} />
                            <p className={styles.subTitle}>Upload Here</p>
                            <p className={styles.text}>Supported file formats are .png .jpeg</p>
                            <p className={styles.greenText}>Max File Size 30mb</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                ) : (
                  <div className="relative">
                    <Image
                      src={bannerCroppedImage !== undefined ? bannerCroppedImage : URL.createObjectURL(bannerImage[0])}
                      width={375}
                      height={120}
                      alt=""
                      objectFit="cover"
                      className="rounded-[20px]"
                    />
                    <div className="absolute bottom-2 right-[10px]">
                      <IconButton
                        width={30}
                        height={30}
                        iconWidth={15}
                        iconHeight={15}
                        icon={bannerCroppedImage !== undefined ? EditorGreenIcon : AddChangeWhiteIcon}
                        onClick={() => dropzoneBannerEl.current.click()}
                        backgroundColor="rgba(55, 130, 135, 0.3)"
                        borderColor="transparent"
                        borderRadius="100%"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* upload artwork part */}
          <div className="w-full">
            <div className={`${styles.subTitle} mt-5`}>Collection Name *</div>
            <div className="max-w-[370px] w-full mt-4 z-10">
              <Input
                value={limit(collectionName, 20)}
                placeholder="Give your art name"
                backgroundColor={'var(--input-bg)'}
                label01="Max Characters 20"
                label02={20 - collectionName.length === 20 ? '' : `${20 - collectionName.length} Characters left`}
                onChange={value => onChangeCollectionName(limit(value, 20))}
              />
            </div>
            <div className={`${styles.subTitle} mt-5`}>Description *</div>
            <div className="w-full mt-5">
              <Textarea
                value={limit(description, 1000)}
                backgroundColor={'var(--input-bg)'}
                placeholder="Add a short description..."
                label01="Max Characters 1000"
                label02={1000 - description.length === 1000 ? '' : `${1000 - description.length} Characters left`}
                onChange={value => onChangeDescription(value)}
              />
            </div>
            <div className={`${styles.subTitle} mt-10 flex justify-start items-center gap-2`}>
              Royalties * <InfoCircleLightGreenIcon alt="" />
            </div>
            <div className="max-w-[370px] w-full mt-5">
              <Input
                value={royalties}
                placeholder="Insert a royalty percentage"
                label="From 0 to 10%"
                backgroundColor={'var(--input-bg)'}
                type="number"
                min={0}
                onChange={value => {
                  if (value > 10) {
                    onChangeRoyalties(10)
                  } else onChangeRoyalties(Math.floor(value))
                }}
              />
            </div>
            <div className={`${styles.subTitle} mt-5`}>Categories *</div>
            <div className="w-full mt-4">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1">
                  {/* <GradientButton
                    fullWidth
                    label="Choose Category"
                    onClick={() => setShowCategoryList(true)}
                    height="45px"
                  /> */}
                  <div className={styles.chooseCategory} onClick={() => setShowCategoryList(true)}>
                    Choose Category
                  </div>
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
                  disabled={disabledNextButton}
                  onClick={() => mintCollection()}
                  height="45px"
                />
              </div>
            )}
          </div>
        </div>
      )}

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
