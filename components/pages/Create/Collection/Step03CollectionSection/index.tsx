import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import Lottie from 'lottie-react'

// components
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'

// custom functions
import { useViewport } from 'utils'

// images and icons

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
    collectionMintName,
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
    // setStartUpload(true)
    readFilesAndUplaod()
  }

  useEffect(() => {
    if (collectionFiles.length !== 0) {
      let count = 0
      collectionFiles.map((item, index) => {
        if (item.name === '') {
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

  const [selectedCollectionFile, setSelectedCollectionFile] = useState<any>()

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="relative w-full grid grid-cols-12 gap-0">
          {/* left part */}
          <div className="col-span-12 lg:col-span-6 g-left-container">
            <div className={styles.leftContainer}>
              <div className={`${styles.title} w-full`}>{collectionMintName}</div>
              <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
                {/* banner image */}
                <div className={styles.bannerImageArea}>
                  <Image
                    src={bannerCroppedImage}
                    alt=""
                    width={640}
                    height={640}
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-[20px]"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* right part */}
          <div className="col-span-12 lg:col-span-6 g-right-container z-0">
            <div className={styles.rightContainer}>
              <div className="w-full relative">
                <div className={styles.reviewCollection}>Review Collection Items</div>
                <div className="w-full">
                  {/* {!showMore && */}
                  {collectionFiles.length !== 0 &&
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
                          {item.type === 'video' ? (
                            <video loop autoPlay className="w-full h-full" id="video">
                              <source src={URL.createObjectURL(item.file)} type={item.file.type} />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <Image
                              src={item.type === 'vr' && item.nftCoverImage ? item.nftCoverImage : item.croppedImage}
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
                            Description
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
                <div className="absolute bottom-0 w-full flex justify-end">
                  <div className="flex gap-10">
                    <OutlineButton
                      label="Back"
                      onClick={() => handleChangeCurrentStep(currentStep - 1)}
                      width={viewport === '2xl' ? 124 : 117}
                      height={viewport === '2xl' ? 53 : 46}
                      borderWidth={2}
                    />
                    <button
                      className={styles.mintCollection}
                      disabled={disabledNextButton}
                      style={{
                        color: disabledNextButton ? 'var(--create-collection-color)' : 'var(--twitter-text-color)',
                        background: disabledNextButton ? 'var(--create-collection-btn)' : 'var(--main-icon-color)',
                      }}
                      onClick={() => uploadArtworks()}
                    >
                      Mint
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // mobile part
        <div className="g-container mb-[47px]">
          {/* CollectionStepper part */}
          {/* <div className="w-full">
            <CollectionStepper currentStep={currentStep} />
          </div> */}
          <div className={`${styles.title} w-full`}>{collectionMintName}</div>

          <div className="w-full flex flex-wrap justify-center mt-[22px]">
            {/* banner part */}
            <div className="w-full flex flex-wrap justify-center z-10">
              {/* banner image */}
              <div className={styles.bannerImageArea}>
                {bannerCroppedImage !== undefined && (
                  <Image
                    src={bannerCroppedImage}
                    alt=""
                    width={256}
                    height={256}
                    layout="responsive"
                    objectFit="cover"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="w-full mt-[70px]">
              {/* {!showMore && */}
              {collectionFiles.length !== 0 &&
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
                        {item.type === 'video' ? (
                          <video loop autoPlay className="w-full h-full" id="video">
                            <source src={URL.createObjectURL(item.file)} type={item.file.type} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <Image
                            src={item.type === 'vr' && item.nftCoverImage ? item.nftCoverImage : item.croppedImage}
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
                        Description
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
            <div className="w-full flex justify-between">
              <div>
                <OutlineButton
                  label="Back"
                  onClick={() => handleChangeCurrentStep(currentStep - 1)}
                  width={175}
                  height="45px"
                  // color="#EFF0F6"
                  borderWidth={2}
                  // borderColor="#5AC3BA"
                />
              </div>
              <div>
                <button
                  className={styles.mintCollection}
                  disabled={disabledNextButton}
                  style={{
                    color: disabledNextButton ? 'var(--create-collection-color)' : 'var(--twitter-text-color)',
                    background: disabledNextButton ? 'var(--create-collection-btn)' : 'var(--main-icon-color)',
                  }}
                  onClick={() => uploadArtworks()}
                >
                  Mint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step03CollectionSection
