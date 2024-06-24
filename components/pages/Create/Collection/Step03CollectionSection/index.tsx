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
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import PrimaryButton from 'components/Button/PrimaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'
import { useSelector } from 'react-redux'

const Step03CollectionSection = props => {
  const {
    currentStep,
    onChangeCurrentStep,
    collectionMintName,
    collectionFiles,
    bannerCroppedImage,
    uploadedCount,
    startUpload,
    setStartUpload,
    isMinting,
    mintCollection,
  } = props

  const viewport = useViewport()
  const categories = useSelector(state => (state as any).collectionMintCategories)

  useEffect(() => {
    window.scrollTo({
      top: 0,
    })
  }, [])

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
    <div className="w-full g-container">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="mt-[70px]">
          {collectionFiles.length !== 0 &&
            collectionFiles.map((item, index) => (
              <div className={styles.nftContainer} key={index} onClick={() => setSelectedCollectionFile(item)}>
                <div className={styles.selectedImage}>
                  {item.type === 'video' ? (
                    <video loop autoPlay className="w-full h-full" id="video">
                      <source src={URL.createObjectURL(item.file)} type={item.file.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={item.type === 'vr' && item.nftCoverImage ? item.nftCoverImage : item.croppedImage}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div>
                  <div className={styles.nftName}>Name</div>
                  <div className={styles.nftDesc}>{item.name} </div>
                  <div className={`${styles.nftName} mt-[25px]`}>Description</div>
                  <div className={styles.nftDesc}>{item.description} </div>

                  <div className="flex gap-[45px] mt-[25px]">
                    <div>
                      <div className={styles.nftName}>Categories</div>
                      <div className="flex gap-[8px] mt-[15px]">
                        {categories?.map((item, index) => (
                          <div className={styles.categories} key={index}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {item.editionType.id != 2 && (
                      <div>
                        <div className={styles.nftName}>Token Type</div>
                        <div className="flex gap-[15px] mt-[15px]">
                          <div className={styles.editionType}>{item.editionType.label}</div>
                          {item.editionType.id === 0 && (
                            <div className={styles.editionType}>{item.maxSupply + ' editions'} </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {startUpload && (
                  <div className="absolute right-[30px] top-[40%] w-10 h-10">
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
      ) : (
        // mobile part
        <div className="mb-[47px]">
          {/* CollectionStepper part */}

          <div className="w-full flex flex-wrap justify-center">
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

          <div className={`${styles.title} w-full mt-[15px]`}>{collectionMintName}</div>

          <div className="w-full">
            <div className="w-full">
              {/* {!showMore && */}
              {collectionFiles.length !== 0 &&
                collectionFiles.map((item, index) => (
                  <div
                    className="w-full flex flex-wrap justify-between items-center gap-[15px] mt-[30px] lg:mt-10 cursor-pointer"
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
                            width={68}
                            height={68}
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
                    <div className="w-full">
                      <div className={styles.nftDesc}>{item.description} </div>
                    </div>
                    <div className="w-full flex gap-[15px]">
                      <div className={styles.editionType}>{item.editionType.label}</div>
                      {item.editionType.id === 0 && (
                        <div className={styles.editionType}>{item.maxSupply + ' editions'}</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <div className="w-full my-[30px]">
              {/* button group part */}
              <div>
                {isMinting ? (
                  <LoadingPrimaryButton fullWidth />
                ) : (
                  <PrimaryButton
                    label="Mint"
                    type="next"
                    fullWidth
                    onClick={() => {
                      mintCollection()
                    }}
                  />
                )}
              </div>
              <div className="mt-[15px]">
                <SecondaryButton
                  fullWidth
                  label="Back"
                  type="back"
                  onClick={() => onChangeCurrentStep(currentStep - 1)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step03CollectionSection
