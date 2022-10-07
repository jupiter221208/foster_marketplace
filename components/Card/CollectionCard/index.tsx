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
  const { image, nftName, category, artistName, mintAddress = '', price} = props
  const viewport = useViewport()
  const router = useRouter()

  return (
    <div
      className={styles.container}
      onClick={() => {
        router.push(`/browse-collection/${mintAddress}`)
      }}
    >
      <div className="relative w-full rounded-[10px] lg:rounded-[20px] overflow-hidden">
        <Image src={image} alt="" width={321} height={378} layout="responsive" objectFit="cover" />
        <div className="absolute bottom-[14px] right-[8px]"></div>
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
          <div className="items-center">
            <div className="flex justify-center items-center mt-[4px]">
              <Image
                src={SolanaLogoIcon}
                width={
                  viewport === 'xs' ? 11 : viewport === 'sm' ? 13 : viewport === 'md' ? 14 : viewport === 'lg' ? 16 : 24
                }
                height={
                  viewport === 'xs' ? 11 : viewport === 'sm' ? 13 : viewport === 'md' ? 14 : viewport === 'lg' ? 16 : 24
                }
                alt=""
              />
              <div className={`${styles.price} ml-1 lg:ml-1`}>{price}</div>
            </div>
            <div className={styles.priceName}>Floor Price</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionCard
