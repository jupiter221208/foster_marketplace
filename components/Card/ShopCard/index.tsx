import React from 'react'

// next components

// images and icons

// styles
import styles from './index.module.scss'
import ImageWithFallback from 'components/ImageWithFallback'

const ShopCard = props => {
  const { data, nftCoverUrl = '', onClick } = props
  return (
    <div className={styles.container}>
      <div className={styles.imageArea} onClick={onClick}>
        <div className={styles.imageContent}>
          <ImageWithFallback
            src={data.asset_url}
            layout="fill"
            alt=""
            className="w-full h-full rounded-[24px] object-cover"
          />
        </div>
        {nftCoverUrl.length > 0 && (
          <div className={styles.nftImage}>
            <div
              className={`w-[25%] h-[30%] ${data.top === 25 ? '-mt-[25%]' : data.top === 10 ? '-mt-[10%]' : ''}`}
              style={{ opacity: '90%' }}
            >
              <img src={nftCoverUrl} alt="" className="w-full h-full object-cover" />
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
