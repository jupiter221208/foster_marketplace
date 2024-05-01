import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
// next component

// custom components
import EllipseGroupWhiteIcon from 'assets/icons/three-dot-icon.svg?component'
import CloseIcon from 'assets/icons/close-white-13x13.svg?component'

// styles
import styles from './index.module.scss'
import Link from 'next/link'
import ImageWithFoster from 'components/ImageWithFoster'
import { useRouter } from 'next/router'
import { useViewport } from 'utils'
import PrimaryButton from 'components/Button/PrimaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'
import GradientButton from 'components/Button/GradientButton'

const CollectionCard = props => {
  const { image, nftName, link, artistName, collectionName, unSave = null } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const viewport = useViewport()
  const [showEditBtn, setShowEditBtn] = useState(false)

  return (
    <div className={styles.container}>
      <div className="relative w-full overflow-hidden">
        <div className={styles.topSection}>
          <div className={styles.moreBtn} onClick={() => setShowEditBtn(true)}>
            <EllipseGroupWhiteIcon alt="" />
          </div>
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
                  <ImageWithFoster width={360} src={image} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </a>
        </Link>
        <div className={styles.bottomSection}>
          <div className={styles.nftName}>{nftName}</div>
        </div>
        {showEditBtn && (
          <div className={styles.overlay}>
            <div className={styles.closeBtn} onClick={() => setShowEditBtn(false)}>
              <CloseIcon />
            </div>
            <div className={styles.bottomBtn}>
              <div className="mt-[6px] sm:mt-[15px]">
                <PrimaryButton
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
                <div className="mt-[6px] sm:mt-[10px]">
                  <SecondaryButton
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
        )}
      </div>
    </div>
  )
}

export default CollectionCard
