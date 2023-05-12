import React from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const BrowseArtistCard = props => {
  const { image, collectionName, artistName, artistAddress } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const viewport = useViewport()

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
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
              router.push('/' + artistAddress)
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
