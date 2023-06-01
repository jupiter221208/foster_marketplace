import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

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
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        {!loaded && (
          <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
            <div></div>
          </ReactPlaceholder>
        )}

        <img
          src={type === 'artworks' ? data.asset_url : data.cover_image}
          alt=""
          className="w-full h-full object-cover"
          onLoad={() => {
            setLoaded(true)
          }}
        />
      </div>
      <div className={styles.dataContainer}>
        <div className={styles.dataGradientBgView} />
        <div className={styles.dataContentView}>
          <div
            className={styles.nftName}
            onClick={() => {
              dispatch({ type: 'set', isLoading: true })
              if (type === 'artworks') {
                router.push(`/browse-nft?id=${data.mint_address}`)
              } else {
                router.push(`/browse-collection/${data.collection_address}`)
              }
            }}
          >
            {type === 'artworks' ? data.asset_name : data.collection_name}
          </div>
          <div className="w-full flex justify-between pr-[13px] lg:pr-[25px]">
            <div className={styles.saleName}>{type === 'artworks' ? 'Highest Sale' : 'Total Sales'}</div>
            <div className="flex gap-[4px] items-center">
              <Image src={SolanaLogoIcon} width={18} height={15} alt="" />
              <div className={styles.value}>
                {type === 'artworks' ? parseFloat(data.amount).toFixed(2) : parseFloat(data.total_sales).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCollectionCard
