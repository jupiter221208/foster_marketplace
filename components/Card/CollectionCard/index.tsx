import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
// next component

// styles
import styles from './index.module.scss'
import Link from 'next/link'
import ImageWithFoster from 'components/ImageWithFoster'
import { useRouter } from 'next/router'
import { useViewport } from 'utils'
import PrimaryDashboardButton from 'components/Button/PrimaryDashboardButton'
import SecondaryDashboardButton from 'components/Button/SecondaryDashboardButton'

const CollectionCard = props => {
  const { image, nftName, link, artistName, collectionName, unSave = null } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const viewport = useViewport()

  return (
    <div className={styles.container}>
      <div className="relative w-full overflow-hidden">
        <div className={styles.topSection}>
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <Link href={link} passHref>
          <a>
            <div
              className={styles.imageArea}
              onClick={() => {
                dispatch({ type: 'set', isLoading: true })
              }}
            >
              <div className={styles.imageContent}>
                <div className="w-full h-full overflow-hidden">
                  <ImageWithFoster width={800} src={image} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </a>
        </Link>
        <div className={styles.bottomSection}>
          <div className="w-full">
            <PrimaryDashboardButton
              fullWidth
              label="View"
              type="next"
              onClick={() => {
                dispatch({ type: 'set', isLoading: true })
                router.push(link)
              }}
            />
          </div>
          {unSave !== null && (
            <div className="w-full">
              <SecondaryDashboardButton
                fullWidth
                label="Unsave"
                type="unsave"
                onClick={() => {
                  dispatch({ type: 'set', isLoading: true })
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
