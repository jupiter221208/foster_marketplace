import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

// next components
import Link from 'next/link'

// images and icons
import TrashIcon from 'assets/icons/trash-white.svg?component'
import TrashMobileIcon from 'assets/icons/trash-white-mobile.svg?component'

// styles
import styles from './index.module.scss'

// apis
import collectionAPI from 'apis/collections'
import LoadingModal from 'components/Modal/LoadingModal'
import ImageWithFoster from 'components/ImageWithFoster'

const TrendingCollectionCard = props => {
  const { collectionID, image, collectionName, artistName, nftCount, avatar, showRemoveButton = false } = props
  const dispatch = useDispatch()
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
      <div className="relative w-full h-full overflow-hidden">
        <div className={styles.imageArea}>
          <div className={styles.imageContent}>
            <Link href={`/collection/${collectionID}`} passHref>
              <a>
                <ImageWithFoster src={image} width={500} className="w-full h-full object-cover" />
              </a>
            </Link>

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
        </div>

        <div className={styles.bidContainer}>
          {/* <div className={styles.bidGradientBgView} /> */}
          <div className={styles.bidContentView}>
            <div className="px-[15px] sm:px-[20px] lg:px-[28px]">
              <div className={styles.nftName}>{collectionName}</div>
              <div className="flex mt-2">
                <div className={styles.artistName}>{artistName || collectionName}</div>
                <div className={styles.dotStyle}>&#183;</div>
                <div className={styles.nftCount}>{nftCount} artworks</div>
              </div>
            </div>
            {avatar !== null && avatar.length > 0 && (
              <div className={styles.avatar}>
                <div className="lg:w-[56px] lg:min-w-[56px] lg:h-[56px] min-w-[45px] w-[45px] h-[45px] overflow-hidden rounded-full">
                  <ImageWithFoster src={avatar} width={56} className="rounded-full" loading="lazy" />
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
