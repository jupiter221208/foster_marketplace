import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
// next component

// custom components

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import Link from 'next/link'
import ImageWithFoster from 'components/ImageWithFoster'
import { useRouter } from 'next/router'
import { useViewport } from 'utils'

const CollectionCard = props => {
  const { image, nftName, link, artistName, collectionName, unSave = null } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const viewport = useViewport()

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
        {/* <div className="w-full flex justify-start items-center">
          <Link href={`/${artistName || collectionName}`} passHref>
            <a>
              <div className={styles.artistName}>
                {getDisplayUserName(artistName) || collectionName || 'Ecosystem Artist'}
              </div>
            </a>
          </Link>
        </div> */}
        <div className="mt-[6px] sm:mt-[15px]">
          <GradientButton
            fullWidth
            label="View"
            fontSize={viewport === 'xs' ? 12 : 18}
            height={viewport === 'xs' ? 28 : 50}
            borderRadius={viewport === 'xs' ? 5 : 10}
            onClick={() => {
              dispatch({ type: 'set', isLoading: true })
              router.push(link)
            }}
          />
        </div>
        {unSave !== null && (
          <div className="mt-[6px] sm:mt-[10px]">
            <GradientButton
              fullWidth
              label="Unsave"
              fontSize={viewport === 'xs' ? 12 : 18}
              borderRadius={viewport === 'xs' ? 5 : 10}
              height={viewport === 'xs' ? 28 : 50}
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
