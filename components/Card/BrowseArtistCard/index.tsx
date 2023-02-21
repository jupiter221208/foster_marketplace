import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// next components

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const BrowseArtistCard = props => {
  const { image, collectionName, artistName, artistAddress } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const viewport = useViewport()
  console.log(collectionName, artistName)
  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <div className={styles.avatar}>
          {image && (
            <img
              src={image}
              alt=""
              width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
              height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
              className="object-cover rounded-full"
            />
          )}
        </div>
      </div>
      <div className={styles.bottomSection}>
        {collectionName ? (
          <div className={styles.collectionName}>{collectionName}</div>
        ) : (
          <div className="w-full h-[22px]"></div>
        )}
        {artistName ? (
          <div
            className={styles.artistName}
            onClick={() => {
              router.push(`/artist-profile?id=${artistAddress}`)
              dispatch({ type: 'set', isLoading: true })
            }}
          >
            Created by <span className={styles.greenText}>{artistName}</span>
          </div>
        ) : (
          <div className="w-full h-[22px]"></div>
        )}
      </div>
    </div>
  )
}

export default BrowseArtistCard
