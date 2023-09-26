import React from 'react'

import styles from './index.module.scss'
import Image from 'next/image'
import SingleIcon from 'public/icons/single.svg?component'
import EditionIcon from 'public/icons/edition.svg?component'

const MintTypeSection = ({ setCurrentStep, setType }: { setCurrentStep; setType: any }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center mt-[30px] lg:mt-[95px]">
        <div className={styles.title}>Create Digital Art</div>
        <div className={styles.subTitle}>Choose the type of NFT you would like to mint</div>
      </div>
      <div className="w-full h-full flex justify-center mt-[46px] lg:mt-[120px]">
        <div className="sm:flex sm:gap-[46px] lg:gap-[10%]">
          <div
            className={styles.singleTag}
            onClick={() => {
              setCurrentStep(1)
              setType(0)
            }}
          >
            <div className="flex flex-col p-[70px] justify-center w-full">
              <div className="flex justify-center">
                <SingleIcon />
              </div>
              <div className="flex flex-col">
                <span className={styles.tagTitle}>Single</span>
                <span className={styles.tagSubtitle}>1/1</span>
              </div>
            </div>
          </div>
          <div
            className={`${styles.singleTag} mt-[46px] sm:mt-[0px]`}
            onClick={() => {
              setCurrentStep(1)
              setType(1)
            }}
          >
            <div className="flex flex-col p-[70px] justify-center w-full">
              <div className="flex justify-center">
                <EditionIcon />
              </div>
              <div className="flex flex-col">
                <span className={styles.tagTitle}>Edition</span>
                <span className={styles.tagSubtitle}>Multiple Copies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintTypeSection
