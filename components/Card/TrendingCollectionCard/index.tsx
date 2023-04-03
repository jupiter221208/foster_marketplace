import React from 'react'

// next components
import { useRouter } from 'next/router'

// images and icons
import Avatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

// third party components
import { useDispatch } from 'react-redux'
import { useViewport } from 'utils'

const TrendingCollectionCard = props => {
  const { collectionID, image, collectionName, artistName, nftCount, avatar } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const viewport = useViewport()
  return (
    <div
      className={styles.container}
      onClick={() => {
        dispatch({ type: 'set', isLoading: true })
        router.push('/browse-collection/' + collectionID)
      }}
    >
      <div className="relative w-full h-full rounded-[24px] overflow-hidden">
        <img src={image} alt="" className="w-full h-full object-cover" />
        {/* <div className={styles.bottomMask} /> */}
        <div className={styles.bidContainer}>
          <div className={styles.bidBgView} />
          <div className={styles.bidGradientBgView} />
          <div className={styles.bidContentView}>
            <div className="px-[15px] lg:px-[28px]">
              <div className={styles.nftName}>{collectionName}</div>
              <div className="flex mt-1">
                <div className={styles.artistName}>{artistName || collectionName}</div>
                <div className={styles.dotStyle}>&#183;</div>
                <div className={styles.nftCount}>{nftCount} artworks</div>
              </div>
            </div>
            <div className={styles.avatar}>
              <img
                src={avatar !== null ? avatar : Avatar.src}
                alt=""
                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 44}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 44}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingCollectionCard
