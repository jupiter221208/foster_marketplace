import React from 'react'

import styles from './index.module.scss'
import Image from 'next/image'
import SingleMobileIcon from 'public/icons/single-mobile.svg?component'
import SingleIcon from 'public/icons/single.svg?component'
import EditionMobileIcon from 'public/icons/edition-mobile.svg?component'
import EditionIcon from 'public/icons/edition.svg?component'
import CollectionMobileIcon from 'public/icons/collection-mobile.svg?component'
import CollectionIcon from 'public/icons/collection.svg?component'

const MintTypeSection = ({ setCurrentStep, setType }: { setCurrentStep; setType: any }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center mt-[30px] lg:mt-[95px]">
        <div className={styles.title}>Create Digital Art</div>
        <div className={styles.subTitle}>Choose the type of NFT you would like to mint</div>
      </div>
      <div className="g-container w-full h-full flex justify-center mt-[46px] lg:mt-[95px]">
        <div className="lg:flex w-full jusitfy-between lg:gap-[60px]">
          <div
            className={styles.singleTag}
            onClick={() => {
              setCurrentStep(1)
              setType(0)
            }}
          >
            <div className="flex h-full gap-[15px] lg:gap-[0px] lg:flex-col items-center">
              <div className="hidden lg:flex mt-[70px] justify-center">
                <SingleIcon />
              </div>
              <div className="flex lg:hidden justify-center">
                <SingleMobileIcon />
              </div>
              <div className="lg:mt-[40px] mt-[-2px]">
                <span className={styles.tagTitle}>Single</span>
                <span className={styles.tagSubtitle}>One of a kind artwork</span>
              </div>
            </div>
          </div>
          <div
            className={`${styles.singleTag} mt-[12px] mb-[12px] sm:mt-[0px] sm:mb-[0px]`}
            onClick={() => {
              setCurrentStep(1)
              setType(1)
            }}
          >
            <div className="flex h-full gap-[15px] lg:gap-[0px] lg:flex-col items-center">
              <div className="hidden lg:flex justify-center mt-[70px]">
                <EditionIcon />
              </div>
              <div className="flex lg:hidden justify-center">
                <EditionMobileIcon />
              </div>
              <div className="lg:mt-[40px] mt-[-2px]">
                <span className={styles.tagTitle}>Editions</span>
                <span className={styles.tagSubtitle}>Multiple editions of the same artwork</span>
              </div>
            </div>
          </div>
          <div
            className={`${styles.singleTag} mt-[12px] sm:mt-[0px] sm:mb-[0px]`}
            onClick={() => {
              setCurrentStep(1)
              setType(1)
            }}
          >
            <div className="flex h-full gap-[15px] lg:gap-[0px] lg:flex-col items-center">
              <div className="hidden lg:flex justify-center mt-[70px]">
                <CollectionIcon />
              </div>
              <div className="flex lg:hidden justify-center">
                <CollectionMobileIcon />
              </div>
              <div className="lg:mt-[40px] mt-[-2px]">
                <span className={styles.tagTitle}>Collection</span>
                <span className={styles.tagSubtitle}>Collection to nest a group of artwork</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.exchangeArt}>
        Or, <span className={styles.underline}>import your series from Exchange Art</span>
      </div>
    </div>
  )
}

export default MintTypeSection
