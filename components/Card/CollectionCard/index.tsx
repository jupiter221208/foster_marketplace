import React from 'react'
// next component

// styles
import styles from './index.module.scss'
import Link from 'next/link'
import ImageWithFoster from 'components/ImageWithFoster'
import { useRouter } from 'next/router'
import OutlineButton from 'components/Button/OutlineButton'

const CollectionCard = props => {
  const { image, nftName, link, artistName, artistImage, unSave = null } = props
  const router = useRouter()

  return (
    <div className={styles.container}>
      <div className="relative w-full overflow-hidden">
        <div className={styles.topSection}>
          <div>
            <div className={styles.nftName}>{nftName}</div>
            <div className={styles.artistName}>{artistName}</div>
          </div>
          <div className="w-[45px] h-[45px] rounded-[23px] overflow-hidden">
            <ImageWithFoster width={100} src={artistImage} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        <Link href={link} passHref>
          <a>
            <div className={styles.imageArea}>
              <div className={styles.imageContent}>
                <div className="w-full h-full overflow-hidden">
                  <ImageWithFoster width={800} src={image} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </a>
        </Link>
        <div className={styles.bottomSection}>
          {unSave === null ? (
            <div className="w-full">
              <OutlineButton
                fullWidth
                label="View"
                fontSize={16}
                height={45}
                onClick={() => {
                  router.push(link)
                }}
              />
            </div>
          ) : (
            <div className="w-full">
              <OutlineButton
                fullWidth
                label="Remove"
                fontSize={16}
                height={45}
                onClick={() => {
                  unSave()
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollectionCard
