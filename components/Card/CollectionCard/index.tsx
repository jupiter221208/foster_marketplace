import React from 'react'

// custom components
import SmallCategoryChip from 'components/Chip/SmallCategoryChip'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

const CollectionCard = props => {
  const { image, nftName, category, artistName, artistAddress, mintAddress = '', onClick, unSave = null } = props

  return (
    <div className={styles.container}>
      <div className={styles.imageArea} onClick={() => onClick()}>
        <div className={styles.imageContent}>
          {/* <img src={image} alt="" className="w-full h-full rounded-[10px] lg:rounded-[24px] object-contain" /> */}
          <img src={image} alt="" className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover" />
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
          <GradientButton fullWidth label="Unsave" onClick={() => unSave()} />
        </div>
      )}
    </div>
  )
}

export default CollectionCard
