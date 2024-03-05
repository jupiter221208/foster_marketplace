import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

// next component
import Link from 'next/link'

// custom components
import GradientButton from 'components/Button/GradientButton'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'
import { getDisplayUserName, getShortAddress } from 'utils/strings'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

const DashboardCollectionCard = props => {
  const { image, nftName, link, artistAddress, mintAddress, onClick, unSave = null } = props
  const [loaded, setLoaded] = useState(false)
  const dispatch = useDispatch()

  return (
    <div className={styles.container}>
      <Link href={link} passHref>
        <a>
          <div className={styles.imageArea} onClick={() => onClick()}>
            <div className={styles.imageContent}>
              <div className="w-full h-full overflow-hidden">
                <ImageWithFoster src={image} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </a>
      </Link>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex justify-start items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex justify-start items-center">
          <div className={styles.artistName}>{getDisplayUserName(artistAddress) || getShortAddress(mintAddress)}</div>
        </div>
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
  )
}

export default DashboardCollectionCard
