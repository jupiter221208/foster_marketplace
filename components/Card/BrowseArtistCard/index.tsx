import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import Link from 'next/link'
import { getDisplayUserName } from 'utils/strings'

const BrowseArtistCard = props => {
  const { image, collectionName, artistName, artistAddress, hasloading } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const viewport = useViewport()

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        {hasloading ? (
          <div className={`${styles.skeletonLoader} ${styles.avatar}`}></div>
        ) : (
          <>
            <div className={styles.avatar}>
              {image && (
                <img
                  src={image}
                  alt=""
                  width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
                  height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </div>
          </>
        )}
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
                    <span
                      className={styles.greenText}
                      onClick={() => {
                        dispatch({ type: 'set', isLoading: true })
                      }}
                    >
                      {getDisplayUserName(artistName)}
                    </span>
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
