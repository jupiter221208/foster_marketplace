import React, { useState } from 'react'

// next components
import Link from 'next/link'

// images and icons
import TrashIcon from 'assets/icons/trash-icon.svg?component'

// styles
import styles from './index.module.scss'

// third party components
import { useViewport } from 'utils'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

const TrendingCollectionCard = props => {
  const {
    collectionID,
    image,
    collectionName,
    artistName,
    nftCount,
    avatar,
    showRemoveButton = false,
    removeCollection = null,
  } = props
  const viewport = useViewport()
  const [loaded, setLoaded] = useState(false)

  return (
    <Link href={`/collection/${collectionID}`}>
      <a>
        <div className={styles.container}>
          <div className="relative w-full h-full rounded-[24px] overflow-hidden">
            <div className={styles.imageArea}>
              {!loaded && (
                <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={false} color="#202427">
                  <div></div>
                </ReactPlaceholder>
              )}
              <img
                src={image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onLoad={() => setLoaded(true)}
              />
            </div>
            <div className={styles.bidContainer}>
              <div className={styles.bidGradientBgView} />
              {showRemoveButton && (
                <div className={styles.removeVisible} onClick={() => removeCollection(collectionID)}>
                  <TrashIcon alt="" />
                </div>
              )}
              <div className={styles.bidContentView}>
                <div className="px-[15px] lg:px-[28px]">
                  <div className={styles.nftName}>{collectionName}</div>
                  <div className="flex mt-1">
                    <div className={styles.artistName}>{artistName || collectionName}</div>
                    <div className={styles.dotStyle}>&#183;</div>
                    <div className={styles.nftCount}>{nftCount} artworks</div>
                  </div>
                </div>
                {avatar !== null && avatar.length > 0 && (
                  <div className={styles.avatar}>
                    <div className="w-[32px] lg:w-[44px] h-[32px] lg:h-[44px] overflow-hidden rounded-[16px] rounded-[22px]">
                      <img
                        src={avatar}
                        alt=""
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 44}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 44}
                        className="rounded-full"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default TrendingCollectionCard
