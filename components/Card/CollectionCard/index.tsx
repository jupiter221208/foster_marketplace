import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// custom components
import SmallCategoryChip from 'components/Chip/SmallCategoryChip'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import LoadingButton from 'components/Button/LoadingButton'
import ReactPlaceholder from 'react-placeholder/lib'

const CollectionCard = props => {
  const { image, nftName, category, artistName, artistAddress, mintAddress = '', onClick, unSave = null } = props
  const dispatch = useDispatch()
  const [isUnsaveLoading, setIsUnsaveLoading] = useState(false)
  const unsaveLoading = useSelector(state => (state as any).unsaveLoading)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setIsUnsaveLoading(false)
    dispatch({ type: 'set', unsaveLoading: false })
  }, [unsaveLoading])

  return (
    <div className={styles.container}>
      <div className={styles.imageArea} onClick={() => onClick()}>
        <div className={styles.imageContent}>
          <div className="w-full h-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
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
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex justify-start items-center">
          <div className={styles.nftName}>{nftName}</div>
        </div>
        <div className="w-full flex justify-start items-center">
          <div className={styles.artistName}>{artistName && artistName.length > 0 ? artistName : nftName}</div>
        </div>
        <div className="w-full mt-[6px] flex justify-between items-end">
          <div className="flex flex-wrap gap-1 max-h-[16px] lg:max-h-[30px] overflow-hidden">
            {category?.map((item, index) => (
              <SmallCategoryChip data={item} key={index} />
            ))}
          </div>
        </div>
      </div>
      {unSave !== null && (
        <div className="mt-[10px]">
          {isUnsaveLoading ? (
            <LoadingButton fullWidth />
          ) : (
            <GradientButton
              fullWidth
              label="Unsave"
              onClick={() => {
                setIsUnsaveLoading(true)
                unSave()
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default CollectionCard
