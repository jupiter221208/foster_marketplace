import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// custom functions
import { getShortAddress } from 'utils/strings'
import { useViewport } from 'utils'

// custom components
import SmallCategoryChip from 'components/Chip/SmallCategoryChip'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const CollectionCard = props => {
  const { image, nftName, category, artistName, mintAddress = '' } = props
  const viewport = useViewport()
  const router = useRouter()

  return (
    <div
      className={styles.container}
      onClick={() => {
        router.push(`/browse-collection/${mintAddress}`)
      }}
    >
      <div className={styles.imageArea}>
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
          <div className={styles.artistName}>
            {getShortAddress(artistName)} / {getShortAddress(mintAddress)}
          </div>
        </div>
        <div className="w-full mt-[6px] flex justify-between items-end">
          <div className="flex flex-wrap gap-[2px]">
            {category?.map((item, index) => (
              <SmallCategoryChip data={item} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionCard
