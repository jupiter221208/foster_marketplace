import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// third party components
import Dropzone from 'react-dropzone'

// image
import PlusIcon from 'assets/icons/plus-circle-icon.svg?component'

// json

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import ImageCard from './ImageCard'

const MyProductSection = () => {
  const viewport = useViewport()
  const [imageFirst, setImageFirst] = useState<any>(null)
  return (
    <div className="w-full">
      <div className="w-full lg:block hidden flex">
        <div className="w-[45%]">
          <div className="flex gap-[5px] mb-[15px]">
            <div className={styles.fullfill}>Product Image (max 4)</div> <div className={styles.asterisk}>*</div>
          </div>
          <div className={styles.imageArea}>
            <div className={styles.imageContent}></div>
          </div>
          <div className="flex gap-[30px] mt-[32px]">
            <ImageCard image={imageFirst} setImage={setImageFirst} isDelete={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProductSection
