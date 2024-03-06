import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

// next components
import Link from 'next/link'

// images and icons
import TrashIcon from 'assets/icons/trash-white.svg?component'
import TrashMobileIcon from 'assets/icons/trash-white-mobile.svg?component'

// styles
import styles from './index.module.scss'

// third party components
import { useViewport } from 'utils'

// apis
import collectionAPI from 'apis/collections'
import LoadingModal from 'components/Modal/LoadingModal'
import ImageWithFoster from 'components/ImageWithFoster'

const TrendingCollectionCard = props => {
  const { collectionID, image, collectionName, artistName, nftCount, avatar, showRemoveButton = false } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false)
  const [displayRemoveConfirm, setDisplayRemoveConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const removeCollection = collectionId => {
    setIsLoading(true)

    collectionAPI.deleteCollection(collectionId).then(
      response => {
        setIsLoading(false)
        setDisplayRemoveConfirm(false)
        dispatch({ type: 'set', removeCollectionId: collectionId })
      },
      error => {}
    )
  }

  return (
    <div className={styles.container}>
      <div className="relative w-full h-full rounded-[24px] overflow-hidden">
        <div className={styles.imageArea}>
          <ImageWithFoster
            link={`/collection/${collectionID}`}
            src={image}
            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 375 : 504}
            className="w-full h-full object-cover"
          />

          {showRemoveButton && (
            <div className={styles.removeVisible} onClick={() => setDisplayRemoveConfirm(true)}>
              <div className="hidden lg:block">
                <TrashIcon alt="" />
              </div>
              <div className="block lg:hidden">
                <TrashMobileIcon alt="" />
              </div>
            </div>
          )}
        </div>

        <div className={styles.bidContainer}>
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
            {avatar !== null && avatar.length > 0 && (
              <div className={styles.avatar}>
                <div className="w-[32px] lg:w-[44px] h-[32px] lg:h-[44px] overflow-hidden rounded-[16px] rounded-[22px]">
                  <ImageWithFoster src={avatar} width={44} className="rounded-full" loading="lazy" />
                </div>
              </div>
            )}
          </div>
        </div>
        {displayRemoveConfirm && (
          <div className={styles.hideConfirm}>
            {isLoading ? (
              <div className={styles.loading}>
                <LoadingModal open={isLoading} />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div>
                  <div className={styles.hideText}>
                    This action will remove this collection and
                    <br />
                    all of the collection items from Foster Marketplace.
                    <br />
                    <br />
                    Would you like to proceed?
                  </div>
                  <div className="flex gap-[19px] lg:gap-[19px] mt-[50px] justify-center">
                    <div className={styles.hideCancelButton} onClick={() => setDisplayRemoveConfirm(false)}>
                      Cancel
                    </div>
                    <div className={styles.hideButton} onClick={() => removeCollection(collectionID)}>
                      <div className={styles.hideButtonText}>Remove</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TrendingCollectionCard
