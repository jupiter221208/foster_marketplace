import React from 'react'

import styles from './index.module.scss'

const MintTypeSection = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col items-center mt-[100px]">
        <div className="text-[40px]">Create Digital Art</div>
        <div className="text-[18px]">Choose the type of NFT you would like to mint</div>
      </div>
      <div className={styles.singleTag}>
        <div className="w-[400px] h-[400px] bg-[#242424] rounded-3xl"></div>
        <div className="w-[400px] h-[400px] bg-[#242424] rounded-3xl"></div>
      </div>
    </div>
  )
}

export default MintTypeSection
