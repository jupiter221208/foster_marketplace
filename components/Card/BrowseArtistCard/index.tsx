import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

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
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <div className={styles.container}>
      <div className={`${styles.avatarArea} ${lightMode ? styles.lightAvatarArea : ''}`}>
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
      </div>
      <div className={styles.bottomSection}>
        {collectionName ? (
          <div className={`${styles.collectionName} ${lightMode ? styles.lightColor : ''}`}>{collectionName}</div>
        ) : (
          <div className="w-full h-[22px]"></div>
        )}
        {artistName ? (
          <div
            className={`${styles.artistName} ${lightMode ? styles.lightArtistName : ''}`}
            onClick={() => {
              router.push(`/artist-profile?id=${artistAddress}`)
              dispatch({ type: 'set', isLoading: true })
            }}
          >
            Created by{' '}
            <span className={`${styles.greenText} ${lightMode ? styles.lightGreenText : ''}`}>{artistName}</span>
          </div>
        ) : (
          <div className="w-full h-[22px]"></div>
        )}
      </div>
    </div>
  )
}

export default BrowseArtistCard
