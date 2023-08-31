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
import { getShortAddress } from 'utils/strings'

const DashboardCollectionCard = props => {
  const { image, nftName, category, artistAddress, mintAddress, onClick, unSave = null } = props
  const [loaded, setLoaded] = useState(false)
  const dispatch = useDispatch()

  return (
    <div className={styles.container}>
      <div className={styles.imageArea} onClick={() => onClick()}>
        <div className={styles.imageContent}>
          <div className="w-full h-full overflow-hidden">
            <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
              <img src={image} alt="" className="w-full h-full object-cover rounded-[10px] lg:rounded-[20px]" />
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
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex justify-start items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex justify-start items-center">
          <div className={styles.artistName}>{getShortAddress(artistAddress) || getShortAddress(mintAddress)}</div>
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
