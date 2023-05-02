import React, { useState } from 'react'

// next components
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'

// images and icons
import Avatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

// third party components
import { useDispatch } from 'react-redux'
import { useViewport } from 'utils'
import ReactPlaceholder from 'react-placeholder/lib'

const TrendingCollectionCard = props => {
  const { collectionID, image, collectionName, artistName, nftCount, avatar } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const viewport = useViewport()
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={styles.container}
      onClick={() => {
        dispatch({ type: 'set', isLoading: true })
        router.push('/browse-collection/' + collectionID)
      }}
    >
      <div className="relative w-full h-full rounded-[24px] overflow-hidden">
        <div className="w-full h-full">
          {!loaded && (
            <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
              <div></div>
            </ReactPlaceholder>
          )}
          <Image
            src={image}
            alt=""
            unoptimized
            layout="fill"
            className="w-full h-full object-cover"
            onLoadingComplete={() => setLoaded(true)}
          />
        </div>
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
              <div className="w-[32px] lg:w-[44px] h-[32px] lg:h-[44px] overflow-hidden rounded-[16px] rounded-[22px]">
                <Image
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
    </div>
  )
}

export default TrendingCollectionCard
