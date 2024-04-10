import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// components
import Alert from 'components/Alert'

import Chip from 'components/Chip'
import Input from 'components/Input'

import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// call apis
import Button from 'components/Button'

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
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="w-full grid grid-cols-12 gap-0">
          {/* left part */}
          <div className="relative col-span-12 lg:col-span-6 g-left-container">
            <div className={styles.leftContainer}>
              <div className="w-full">
                <div className="w-full mt-[15px]">
                  <div className={styles.bannerImageArea}>
                    <Image src={bannerCroppedImage} width={760} height={218} alt="" objectFit="cover" />
                  </div>
                </div>
                <div className="relative mt-[-109px]">
                  <div className="w-full flex justify-center z-0 mt-[15px]">
                    <div className={styles.coverImageArea}>
                      <Image src={coverCroppedImage} width={218} height={218} alt="" objectFit="cover" />
                    </div>
                  </div>
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
                  <div className={`${styles.subTitle} mt-[20px]`}>{collectionName}</div>

                  <div className={`${styles.desc} mt-[9px]`}>{description}</div>

                  <div className={`${styles.cateLabel} mt-[30px]`}>Categories</div>

                  <div className="w-full flex flex-wrap justify-start items-center mt-[10px] gap-[10px]">
                    {categoryList?.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
                  </div>

                  <div className={`${styles.cateLabel} mt-[16px] flex justify-start items-center gap-2`}>Royalties</div>
                  <div className="max-w-[370px] w-full mt-[10px]">
                    <Input
                      value={royalties + ' %'}
                      width={70}
                      height={27}
                      fontSize={13}
                      fontFamily="Muli-SemiBold"
                      min="0"
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // mobile part
        <div className="g-container mt-[26px] mb-[47px]">
          <div className="w-full flex flex-wrap justify-center mt-[38px]">
            <div className={styles.bannerImageArea}>
              <div className="relative">
                <Image src={bannerCroppedImage} width={375} height={100} alt="" objectFit="cover" />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-wrap justify-center mt-[-50px]">
            <div className={styles.coverImageArea}>
              <Image src={coverCroppedImage} width={100} height={100} alt="" objectFit="cover" />
            </div>
          </div>

          {/* upload artwork part */}
          <div className="w-full">
            <div className={`${styles.subTitle} mt-[40px]`}>{collectionName}</div>

            <div className={`${styles.desc} mt-[9px]`}>{description}</div>

            <div className={`${styles.cateLabel} mt-[30px]`}>Categories</div>
            <div className="w-full flex flex-wrap justify-start items-center mt-[10px] gap-[10px]">
              {categoryList.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
            </div>

            <div className={`${styles.cateLabel} mt-[30px] flex justify-start items-center gap-2`}>Royalties</div>
            <div className="max-w-[370px] w-full mt-[10px]">
              <Input
                value={royalties + ' %'}
                width={70}
                height={27}
                fontSize={13}
                fontFamily="Muli-SemiBold"
                min="0"
                onChange={() => {}}
              />
            </div>
          </div>

          <div className="w-full my-10">
            {/* button group part */}
            <div>
              <Button
                label="Back"
                onClick={() => onChangeCurrentStep(currentStep - 1)}
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
                label="Review"
                fullWidth
                height={50}
                fontSize={18}
                borderColor="transparent"
                onClick={() => {
                  mintCollection()
                }}
              />
            </div>
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
    </div>
  )
}

export default Step01ReviewSection
