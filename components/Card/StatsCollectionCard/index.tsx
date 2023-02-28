import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const StatsCollectionCard = props => {
  const { data, type } = props
  const router = useRouter()

  return (
    <div
      className={styles.container}
      onClick={() => {
        if (type === 'artworks') {
          router.push(`/browse-nft?id=${data.id}`)
        } else {
          router.push('/browse-collection')
        }
      }}
    >
      <div className={styles.imageArea}>
        <Image src={data.asset_url} width={180} height={180} alt="" layout="fill" objectFit="cover" />
      </div>
      <div className={styles.bottomMask} />
      {/* <div className={styles.avatarArea}>
        <Image
          src={data.avatar}
          alt=""
          width={32}
          height={32}
          layout="fixed"
          objectFit="cover"
          className="rounded-full"
        />
      </div> */}
      <div className="absolute bottom-[8px] w-full ml-[5px] flex justify-between items-end z-10">
        <div className="block">
          <div className={styles.nftName}>{data.asset_name}</div>
          <div className="flex gap-[4px]">
            <div className={styles.price}>Sale Price:</div>
            <Image src={SolanaLogoIcon} width={18} height={18} alt="" />
            <div className={styles.value}>{data.amount}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCollectionCard
