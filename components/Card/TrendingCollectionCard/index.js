import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// styles
import styles from './index.module.scss'

const TrendingCollectionCard = props => {
  const { image, nftName, artistName, nfts, avatar } = props
  const router = useRouter()

  return (
    <div className={styles.container} onClick={() => router.push('/browse-collection')}>
      <div className="relative w-full h-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <Image src={image} alt="" width={492} height={515} layout="responsive" objectFit="cover" />
        <div className={styles.bottomMask}></div>
        <div className="w-full h-[40px] lg:h-[54px] flex justify-between absolute lg:bottom-[28px] bottom-[15px] left-[0px] right-[0px] items-center">
          <div className="ml-[15px] lg:ml-[28px]">
            <div className="flex justify-between items-center">
              <div className={styles.nftName}>{nftName}</div>
            </div>
            <div className="flex">
              <div className={styles.artistName}>{artistName}</div>
              <div className={styles.dotStyle}>&#183;</div>
              <div className={styles.artistName}>{nfts} NFTs</div>
            </div>
          </div>
        </div>
        <div className={styles.avatar}>
          <Image src={avatar} alt="" width={58} height={58} />
        </div>
      </div>
    </div>
  )
}

export default TrendingCollectionCard
