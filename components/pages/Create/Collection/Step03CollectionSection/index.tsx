import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import Lottie from 'lottie-react'

// custom functions
import { useViewport } from 'utils'

// images and icons

// json
import CheckLottery from 'assets/lottery/check.json'
import LoaderLottery from 'assets/lottery/loader.json'

// styles
import styles from './index.module.scss'
import { FadeLoader } from 'react-spinners'

const Step03CollectionSection = props => {
  const {
    onChangeCurrentStep,
    collectionMintName,
    collectionFiles,
    bannerCroppedImage,
    uploadedCount,
    startUpload,
    setStartUpload,
  } = props

  const viewport = useViewport()

  useEffect(() => {
    if (uploadedCount === collectionFiles.length) setStartUpload(false)
  })

  useEffect(() => {
    if (collectionFiles.length !== 0) {
      let count = 0
      collectionFiles.map((item, index) => {
        if (item.name === '') {
          count++
        }
      })
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
          <div className="col-span-12 lg:col-span-5 g-right-container z-0">
            <div className={styles.rightContainer}>
              <div className="w-full relative">
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
                                selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 95 : 95
                              }
                              height={
                                selectedCollectionFile !== undefined && selectedCollectionFile.id === item.id ? 95 : 95
                              }
                              objectFit="cover"
                              className="rounded-lg"
                            />
                          )}
                        </div>
                        <div className="w-full">
                          <div className={styles.nftName}>{item.name} </div>
                          <div className={styles.nftDesc}>{item.description} </div>
                        </div>
                        {startUpload && (
                          <div className="absolute -right-20 top-4 w-10 h-10">
                            {index < uploadedCount ? (
                              <Lottie animationData={CheckLottery} loop={true} />
                            ) : (
                              <FadeLoader margin="0px" height={10} speedMultiplier={1} color="#63D6CD" />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // mobile part
        <div className="g-container mb-[47px]">
          {/* CollectionStepper part */}
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
                      <div className={styles.nftName}>{item.name} </div>
                    </div>
                    <div className="w-full mt-[15px]">
                      <div className={styles.nftDesc}>{item.description} </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step03CollectionSection
