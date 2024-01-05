import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
// next component

// custom components
import SmallCategoryChip from 'components/Chip/SmallCategoryChip'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'

const CollectionCard = props => {
  const { image, nftName, link, artistName, collectionName, unSave = null } = props
  const [loaded, setLoaded] = useState(false)
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
                <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </ReactPlaceholder>
                {!loaded && (
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      setLoaded(true)
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </a>
      </Link>

      <div className={styles.imageInfo}>
        <div className="w-full flex justify-start items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex justify-start items-center">
          <div className={styles.artistName}>{artistName || collectionName || 'Ecosystem Artist'}</div>
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
