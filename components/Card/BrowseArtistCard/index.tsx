import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'
import CameraWhiteIcon from 'assets/icons/editor-green.svg?component'

// styles
import styles from './index.module.scss'
import Link from 'next/link'
import { getDisplayUserName } from 'utils/strings'

const BrowseArtistCard = props => {
  const { image, collectionName, artistName, artistAddress, hasloading, onClickEdit } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const viewport = useViewport()

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        {/* {hasloading ? (
          <div className={`${styles.skeletonLoader} ${styles.avatar}`}></div>
        ) : ( */}
        <div className="relative">
          <div className={styles.avatar}>
            {image && (
              <Image
                src={image}
                alt=""
                width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
                height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>
          <div className="absolute left-[64px] lg:left-[120px] bottom-[-4px] lg:bottom-0">
            <IconButtonWithSVG
              icon={<CameraWhiteIcon />}
              width={38}
              height={38}
              iconWidth={38}
              iconHeight={38}
              onClick={onClickEdit}
              backgroundColor="var(--background-main-color)"
              borderColor="rgba(var(--main-bg-color-rgb), 0.1)"
              borderRadius="100%"
            />
          </div>
        </div>
        {/* )} */}
      </div>
      <div className={styles.bottomSection}>
        {hasloading ? (
          <div className={`${styles.skeletonLoader} ${collectionName} w-[400px] h-[22px] rounded-full`}></div>
        ) : (
          <>
            {collectionName ? (
              <div className={styles.collectionName}>{collectionName}</div>
            ) : (
              <div className="w-full h-[22px]"></div>
            )}

            {artistName ? (
              <div className={styles.artistName}>
                Created by&nbsp;
                <Link href={`/${artistAddress}`} passHref>
                  <a>
                    <span className={styles.greenText}>{getDisplayUserName(artistName)}</span>
                  </a>
                </Link>
              </div>
            ) : (
              <div className="w-full h-[22px]"></div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BrowseArtistCard
