import React from 'react'

import styles from './index.module.scss'

const MintTypeSection = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center mt-[30px] lg:mt-[95px]">
        <div className={styles.title}>Create Digital Art</div>
        <div className={styles.subTitle}>Choose the type of NFT you would like to mint</div>
      </div>
      <div className="w-full h-full flex justify-center mt-[46px] lg:mt-[120px]">
        <div className="sm:flex sm:gap-[46px] lg:gap-[10%]">
          <div className={styles.singleTag}>123</div>
          <div className={`${styles.singleTag} mt-[46px] sm:mt-[0px]`}>345</div>
        </div>
      </div>
    </div>
  )
}

export default MintTypeSection
