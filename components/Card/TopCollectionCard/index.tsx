import React from 'react'

// next components
import Link from 'next/link'

// images and icons

// styles
import styles from './index.module.scss'

// apis
import ImageWithFoster from 'components/ImageWithFoster'

const TopCollectionCard = props => {
  const { collectionID, image, collectionName, artistName, nftCount, avatar, showRemoveButton = false, rank } = props

  return (
    <div className={styles.layout}>
      <div>
        <div className="sm:block hidden">
          <div className={styles.order}>{rank}</div>
          <div className="w-full flex gap-[15px] mt-[-4px]">
            <Link href={`/collection/${collectionID}`} passHref>
              <a>
                <div className={styles.image}>
                  <ImageWithFoster width={100} height={100} src={image} className="w-full h-full object-cover" />
                </div>
              </a>
            </Link>
            <div>
              <Link href={`/collection/${collectionID}`} passHref>
                <a>
                  <div className={styles.collection}>{collectionName}</div>
                </a>
              </Link>
              <Link href={`/${artistName}`} passHref>
                <a>
                  <div className={styles.creator}>{artistName}</div>
                </a>
              </Link>
            </div>
          </div>
        </div>
        <div className={`sm:hidden flex w-full justify-between items-center ${styles.container}`}>
          <div className="flex gap-[15px]">
            <div className={styles.image}>
              <ImageWithFoster width={100} height={100} src={image} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className={styles.collection}>{collectionName}</div>
              <div className={styles.creator}>{artistName}</div>
            </div>
          </div>
          <div className={styles.order}>{rank}</div>
        </div>
      </div>
      {/* </Link> */}
    </div>
  )
}

export default TopCollectionCard
