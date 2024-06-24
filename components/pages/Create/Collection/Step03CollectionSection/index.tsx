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
import { useSelector } from 'react-redux'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'

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
                  <div className={`${styles.nftDesc} mr-[60px]`}>{item.description} </div>

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
                <div className="absolute right-[111px] top-[25px]">
                  <div className={styles.collectionName}>
                    <img className="w-[30px] h-[30px] rounded-[15px]" src={bannerCroppedImage} />
                    {collectionMintName}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        // mobile part
        <div className="mt-[30px] mb-[50px]">
          {collectionFiles.length !== 0 &&
            collectionFiles.map((item, index) => (
              <div className={styles.nftContainer} key={index} onClick={() => setSelectedCollectionFile(item)}>
                <div className="w-full flex justify-between">
                  <div className={styles.collectionName}>
                    <img className="w-[30px] h-[30px] rounded-[15px]" src={bannerCroppedImage} />
                    {collectionMintName}
                  </div>
                  {startUpload && (
                    <div className="absolute right-[20px] top-[20px] w-10 h-10">
                      {index < uploadedCount ? (
                        <Lottie animationData={CheckLottery} loop={true} />
                      ) : (
                        <FadeLoader margin="0px" height={10} speedMultiplier={1} color="#63D6CD" />
                      )}
                    </div>
                  )}
                </div>
                <div className={`mt-[15px] ${styles.selectedImage}`}>
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
                <div className="mt-[15px]">
                  <div className={styles.nftName}>Name</div>
                  <div className={styles.nftDesc}>{item.name} </div>
                  <div className={`${styles.nftName} mt-[25px]`}>Description</div>
                  <div className={styles.nftDesc}>{item.description} </div>

                  <div className="mt-[25px]">
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
                      <div className="mt-[25px]">
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
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default Step03CollectionSection
