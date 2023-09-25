import React, { useState } from 'react'

// next components
import Image from 'next/image'

// images and icons

// styles
import styles from './index.module.scss'

const ShopCard = props => {
  const { data, nftCoverUrl = '', onClick } = props
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <div className={styles.container}>
      <div className={styles.imageArea} onClick={onClick}>
        <div className={styles.imageContent}>
          <Image
            src={data.asset_url}
            layout="fill"
            alt=""
            className="w-full h-full rounded-[24px] object-cover"
            onLoadingComplete={() => setIsLoaded(true)}
          />
        </div>
        {nftCoverUrl.length > 0 && isLoaded && (
          <div className={styles.nftImage}>
            <div
              className="w-[30%] h-[30%] lg:w-[34%] h-[34%] lg:-mt-[8%] -mt-[8%] flex justify-center items-start"
              style={{ opacity: '80%' }}
            >
              <img src={nftCoverUrl} alt="" className="w-auto h-auto max-w-full max-h-full object-contain" />
            </div>
          </div>
        )}
      </div>
      <div className={styles.bidContainer}>
        <div className={styles.bidGradientBgView} />
        <div className={styles.bidContentView}>
          <div className="w-full flex gap-[6px] items-center">
            <div className={styles.name}>{data.name}</div>
            {data.type.length > 0 && <div className={styles.type}>&nbsp;({data.type})</div>}
          </div>
          <div className={styles.startPrice}>Starting at ${data.start_price}</div>
        </div>
      </div>
    </div>
  )
}

export default ShopCard
