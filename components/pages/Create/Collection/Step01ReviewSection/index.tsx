import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// components
import Chip from 'components/Chip'
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import LoadingButton from 'components/Button/LoadingButton'
import OutlineButton from 'components/Button/OutlineButton'

const Step01ReviewSection = props => {
  const {
    currentStep,
    collectionName,
    description,
    coverCroppedImage,
    bannerCroppedImage,
    royalties,
    categoryList,
    mintCollection,
    isMinting,
    onChangeCurrentStep,
  } = props
  const viewport = useViewport()

  // variables
  const [displayCategory, setDisplayCategory] = useState(false)

  useEffect(() => {
    if (categoryList) {
      let list = categoryList.filter((item, index) => item.checked === true)
      if (list.length > 0) {
        setDisplayCategory(true)
      } else {
        setDisplayCategory(false)
      }
    }
  }, [categoryList])

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="w-full mt-[44px] mb-[100px]">
          <div className="w-full g-container">
            <div className={styles.container}>
              <div className="w-full">
                <div className="w-full">
                  <div className={styles.bannerImageArea}>
                    <img src={bannerCroppedImage} alt="" className="w-full h-[295px]" />
                  </div>
                </div>
                <div className="mt-[-82px] flex gap-[44px]">
                  <div className="w-[165px] z-0 mt-[15px] ml-[55px]">
                    <div className={styles.coverImageArea}>
                      <Image src={coverCroppedImage} width={163} height={163} alt="" objectFit="cover" />
                    </div>
                    <div className={`${styles.subTitle} mt-[10px] w-full text-center`}>{collectionName}</div>
                  </div>
                </div>
              </div>
              <div className="mt-[30px] px-[50px]">
                <div className={`${styles.subTitle}`}>Description</div>
                <div className={`${styles.desc} mt-[10px]`}>{description}</div>

                {displayCategory && <div className={`${styles.subTitle} mt-[20px]`}>Categories</div>}

                {displayCategory && (
                  <div className="w-full flex flex-wrap justify-start items-center mt-[15px] gap-[10px]">
                    {categoryList?.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
                  </div>
                )}

                <div className={`${styles.subTitle} mt-[22px] flex justify-start`}>Royalties</div>

                <div className="max-w-[370px] w-full mt-[9px]">
                  <div className={styles.desc}>{royalties + ' %'}</div>
                </div>
              </div>
              <div className="absolute w-[122px] h-[53px] right-[57px] bottom-[41px]">
                {isMinting ? (
                  <LoadingButton width={122} height={53} borderRadius={30} />
                ) : (
                  <GradientButton
                    label="Mint"
                    width={122}
                    height={53}
                    borderRadius={30}
                    onClick={() => mintCollection()}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // mobile part
        <div className="g-container mt-[26px] mb-[47px]">
          <div className={styles.container}>
            <div className="w-full flex flex-wrap justify-center">
              <div className={styles.bannerImageArea}>
                <img src={bannerCroppedImage} alt="" className="w-full h-[120px] object-cover" />
              </div>
            </div>

            <div className="w-full flex flex-wrap justify-center mt-[-60px]">
              <div className={styles.coverImageArea}>
                <Image src={coverCroppedImage} width={120} height={120} alt="" objectFit="cover" />
              </div>
            </div>
            <div className="w-full flex justify-center">
              <div className={`${styles.subTitle} mt-[10px]`}>{collectionName}</div>
            </div>
            {/* upload artwork part */}
            <div className="w-full g-container">
              <div className={`${styles.subTitle} mt-[30px]`}>Description</div>
              <div className={`${styles.desc} mt-[15px]`}>{description}</div>
              {displayCategory && <div className={`${styles.subTitle} mt-[20px]`}>Categories</div>}
              {displayCategory && (
                <div className="w-full flex flex-wrap justify-start items-center mt-[10px] gap-[10px]">
                  {categoryList.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
                </div>
              )}

              <div className={`${styles.subTitle} mt-[20px] flex justify-start items-center gap-2`}>Royalties</div>
              <div className={`${styles.desc} mt-[15px]`}>{royalties}%</div>
            </div>
          </div>
          <div className="w-full mt-[35px] mb-[50px]">
            {/* button group part */}
            <div className="mt-[15px]">
              <OutlineButton label="Back" onClick={() => onChangeCurrentStep(currentStep - 1)} fullWidth />
            </div>
            <div className="mt-[18px]">
              {isMinting ? (
                <LoadingButton fullWidth />
              ) : (
                <GradientButton
                  fullWidth
                  label="Mint"
                  onClick={() => {
                    mintCollection()
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step01ReviewSection
