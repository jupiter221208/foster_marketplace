import React, { useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'

// icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'

const StatsCollectionCard = props => {
  const { data, type } = props
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [saleName, setSaleName] = useState('Highest Sale')

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
        <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
          <img src={data.asset_url} alt="" className="w-full h-full object-cover" />
        </ReactPlaceholder>

        {!loaded && (
          <img
            src={data.asset_url}
            alt=""
            className="w-full h-full object-cover"
            onLoad={() => {
              setLoaded(true)
            }}
          />
        )}
      </div>
      {/* <div className={styles.imageArea}>
        <Image src={data.asset_url} width={180} height={180} alt="" layout="fill" objectFit="cover" />
      </div> */}
      {/* <div className={styles.bottomMask} /> */}
      <div className={styles.dataContainer}>
        <div className={styles.dataGradientBgView} />
        <div className={styles.dataContentView}>
          <div className={styles.nftName}>{data.asset_name}</div>
          <div className="w-full flex justify-between pr-[13px] lg:pr-[25px]">
            <div className={styles.saleName}>{type === 'artworks' ? 'Highest Sale' : 'Total Sale'}</div>
            <div className="flex gap-[4px] items-center">
              <Image src={SolanaLogoIcon} width={18} height={15} alt="" />
              <div className={styles.value}>{data.amount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCollectionCard
