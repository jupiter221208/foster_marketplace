import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import SolanaLogoLightIcon from 'assets/icons/solana-logo-light.svg'

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
          router.push(`/browse-nft?id=${data.mint_address}`)
        } else {
          router.push('/browse-collection')
        }
      }}
    >
      <div className={styles.imageArea}>
        <Image src={data.asset_url} width={180} height={180} alt="" layout="fill" objectFit="cover" />
      </div>
      {/* <div className={styles.bottomMask} /> */}
      <div className={styles.dataContainer}>
        <div className={styles.dataGradientBgView} />
        <div className={styles.dataContentView}>
          <div className={styles.nftName}>{data.asset_name}</div>
          <div className="flex gap-[4px] items-center">
            <Image src={SolanaLogoLightIcon} width={18} height={18} alt="" />
            <div className={styles.value}>{data.amount}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCollectionCard
