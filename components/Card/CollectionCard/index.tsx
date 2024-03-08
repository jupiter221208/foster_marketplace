import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
// next component

// custom components

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'
import { getDisplayUserName } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'

const CollectionCard = props => {
  const { image, nftName, link, artistName, collectionName, unSave = null } = props
  const dispatch = useDispatch()

  return (
    <div className={styles.container}>
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
                <ImageWithFoster width={360} src={image} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </a>
      </Link>

      <div className={styles.imageInfo}>
        <div className="w-full flex justify-start items-center">
          <Link href={link} passHref>
            <a>
              <div className={styles.nftName}>{nftName}</div>
            </a>
          </Link>
        </div>
        <div className="w-full flex justify-start items-center">
          <Link href={`/${artistName || collectionName}`} passHref>
            <a>
              <div className={styles.artistName}>
                {getDisplayUserName(artistName) || collectionName || 'Ecosystem Artist'}
              </div>
            </a>
          </Link>
        </div>
        {unSave !== null && (
          <div className="mt-[10px]">
            <GradientButton
              fullWidth
              label="Unsave"
              onClick={() => {
                dispatch({ type: 'set', isLoading: true })

                unSave()
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionCard
