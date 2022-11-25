import React from 'react'

// next components
import { useRouter } from 'next/router'

// images and icons
import Avatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

// third party components
import { useDispatch } from 'react-redux'

const TrendingCollectionCard = props => {
  const { collectionID, image, collectionName, artistName, nftCount, avatar } = props
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <div
      className={styles.container}
      onClick={() => {
        dispatch({ type: 'set', isLoading: true })
        router.push('/browse-collection/' + collectionID)
      }}
    >
      <div className="relative w-full h-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <img src={image} alt="" width={492} height={492} className="w-full object-cover aspect-square" />
        <div className={styles.bottomMask} />
        <div className="w-full h-[40px] lg:h-[54px] flex justify-between absolute lg:bottom-[28px] bottom-[15px] left-[0px] right-[0px] items-center">
          <div className="px-[15px] lg:px-[28px]">
            <div className={styles.nftName}>{collectionName}</div>
            <div className="flex">
              <div className={styles.artistName}>{artistName}</div>
              <div className={styles.dotStyle}>&#183;</div>
              <div className={styles.artistName}>{nftCount} NFTs</div>
            </div>
          </div>
          <div className={styles.avatar}>
            <img src={avatar !== null ? avatar : Avatar.src} alt="" width={58} height={58} className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingCollectionCard
