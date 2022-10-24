import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import Lottie from 'lottie-react'

// components
import CollectionStepper from 'components/Stepper/CollectionStepper'
import Button from 'components/Button'
import IconButton from 'components/Button/IconButton'
import GradientButton from 'components/Button/GradientButton'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'

// custom functions
import { useViewport } from 'utils'

// images and icons
import ArrowDownGreenIcon from 'assets/icons/arrow-down-green.svg'
import EllipseGreen from 'assets/icons/ellipse-green.svg'

// json
import CheckLottery from 'assets/lottery/check.json'
import LoaderLottery from 'assets/lottery/loader.json'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'

const Step03CollectionSection = props => {
  const {
    currentStep,
    onChangeCurrentStep,
    coverCroppedImage,
    collectionFiles,
    bannerCroppedImage,
    readFilesAndUplaod,
    uploadedCount,
  } = props

  const viewport = useViewport()

  // variables
  const [disabledNextButton, setDisabledNextButton] = useState(true)
  const [startUpload, setStartUpload] = useState(false)

  const handleChangeCurrentStep = step => {
    onChangeCurrentStep(step)
  }

  const uploadArtworks = () => {
    setStartUpload(true)
    readFilesAndUplaod()
  }

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
              <div className={`${styles.title} w-full`}>Collection Preview</div>
              <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
                {/* banner image */}
                <div className={styles.bannerImageArea}>
                  {bannerCroppedImage !== undefined && (
                    <Image
                      src={bannerCroppedImage}
                      alt=""
                      width={758}
                      height={194}
                      layout="responsive"
                      objectFit="cover"
                      className="rounded-[20px]"
                    />
                  )}
                  <div className="absolute left-0 -bottom-[100px] w-full flex justify-center">
                    <div className={styles.coverImageArea}>
                      <Image
                        src={coverCroppedImage}
                        alt=""
                        width={160}
                        height={160}
                        layout="responsive"
                        objectFit="cover"
                        className="rounded-[6px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={`w-full flex justify-center items-center mt-[195px] mb-5 ${styles.subTitle}`}>
                Collection Artworks
              </div>
              <div className={styles.uploadedImageArea}>
                {collectionFiles.map((item, index) => (
                  <div key={index} className="w-[100px] h-[100px]">
                    <Image
                      src={item.croppedImage}
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
              <div className={`w-full flex justify-start items-center my-2 z-10 ${styles.grayText}`}>
                Files Uploaded: {collectionFiles.length}
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
                <div className="w-full mt-[70px]">
                  {!showMore &&
                    subCollectionFiles !== undefined &&
                    subCollectionFiles.length !== 0 &&
                    subCollectionFiles.map((item, index) => (
                      <div
                        className="relative w-full flex justify-between items-center gap-4 mt-10 cursor-pointer"
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
                            src={item.croppedImage}
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
                              onChange={() => {}}
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
                              onChange={() => {}}
                              height="90px"
                            />
                          </div>
                        </div>
                        {startUpload && (
                          <div className="absolute -right-20 top-10 w-10 h-10">
                            {index < uploadedCount ? (
                              <Lottie animationData={CheckLottery} loop={true} />
                            ) : (
                              <Lottie animationData={LoaderLottery} loop={true} />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  {!showMore && subCollectionFiles !== undefined && subCollectionFiles.length !== 0 && (
                    <div className="w-full flex justify-center">
                      <IconButton
                        icon={ArrowDownGreenIcon}
                        onClick={() => setShowMore(true)}
                        backgroundColor="transparent"
                        iconWidth="32px"
                        iconHeight="32px"
                      />
                    </div>
                  )}

                  {showMore &&
                    collectionFiles.length !== 0 &&
                    collectionFiles.map((item, index) => (
                      <div
                        className="relative w-full flex justify-between items-center gap-4 mt-10 cursor-pointer"
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
                            src={item.croppedImage}
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
                              onChange={() => {}}
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
                              onChange={() => {}}
                              height="90px"
                            />
                          </div>
                        </div>
                        {startUpload && (
                          <div className="absolute -right-20 top-10 w-10 h-10">
                            {index < uploadedCount ? (
                              <Lottie animationData={CheckLottery} loop={true} />
                            ) : (
                              <Lottie animationData={LoaderLottery} loop={true} />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                <div className="w-full h-32" />
                <div className="absolute bottom-0 w-full flex justify-between">
                  <OutlineButton
                    label="Back"
                    onClick={() => handleChangeCurrentStep(currentStep - 1)}
                    width={viewport === '2xl' ? 124 : 117}
                    height={viewport === '2xl' ? 53 : 46}
                    color="#EFF0F6"
                    borderWidth={2}
                    borderColor="#5AC3BA"
                  />
                  {disabledNextButton ? (
                    <Button
                      width={viewport === '2xl' ? 208 : 161}
                      height={viewport === '2xl' ? 53 : 46}
                      label="Mint Collection"
                      disabled={disabledNextButton}
                      backgroundColor="#888A8E"
                    />
                  ) : (
                    <GradientButton
                      width={viewport === '2xl' ? 208 : 161}
                      height={viewport === '2xl' ? 53 : 46}
                      label="Mint Collection"
                      gradientDirection="bottom"
                      onClick={() => uploadArtworks()}
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
          <div className={`${styles.title} w-full`}>Collection Preview</div>

          <div className="w-full flex flex-wrap justify-center mt-[22px]">
            {/* banner part */}
            <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
              {/* banner image */}
              <div className={styles.bannerImageArea}>
                {bannerCroppedImage !== undefined && (
                  <Image
                    src={bannerCroppedImage}
                    alt=""
                    width={758}
                    height={194}
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-[20px]"
                  />
                )}
                <div className="absolute left-0 -bottom-[50px] w-full flex justify-center">
                  <div className={styles.coverImageArea}>
                    <Image
                      src={coverCroppedImage}
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
            <div className={`${styles.subTitle} w-full flex justify-center mt-20`}>Collection Artworks</div>
            <div className={`${styles.grayText} w-full flex justify-center my-2`}>
              Files Uploaded: {collectionFiles.length}
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
                            ? styles.selectedImage
                            : styles.nonSelectedImage
                        }
                      >
                        <Image
                          src={item.croppedImage}
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
                      {startUpload && (
                        <div className="w-10 h-10">
                          {index < uploadedCount ? (
                            <Lottie animationData={CheckLottery} loop={true} />
                          ) : (
                            <Lottie animationData={LoaderLottery} loop={true} />
                          )}
                        </div>
                      )}
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
                          onChange={() => {}}
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
                          onChange={() => {}}
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
                    iconWidth="32px"
                    iconHeight="32px"
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
                            ? styles.selectedImage
                            : styles.nonSelectedImage
                        }
                      >
                        <Image
                          src={item.croppedImage}
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
                      {startUpload && (
                        <div className="w-10 h-10">
                          {index < uploadedCount ? (
                            <Lottie animationData={CheckLottery} loop={true} />
                          ) : (
                            <Lottie animationData={LoaderLottery} loop={true} />
                          )}
                        </div>
                      )}
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
                          onChange={() => {}}
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
                          onChange={() => {}}
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
                <OutlineButton
                  label="Back"
                  onClick={() => handleChangeCurrentStep(currentStep - 1)}
                  fullWidth
                  height="45px"
                  color="#EFF0F6"
                  borderWidth={2}
                  borderColor="#5AC3BA"
                />
              </div>
              <div className="col-span-1">
                {disabledNextButton ? (
                  <div className="w-full">
                    <Button
                      fullWidth
                      label="Mint Collection"
                      disabled={disabledNextButton}
                      backgroundColor="#888A8E"
                      height="45px"
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <GradientButton
                      fullWidth
                      label="Mint Collection"
                      gradientDirection="bottom"
                      onClick={() => uploadArtworks()}
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
