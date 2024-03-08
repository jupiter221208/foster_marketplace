import React from 'react'
import { useDispatch } from 'react-redux'

// next components

// icons

// styles
import styles from './index.module.scss'
import Link from 'next/link'
import { getDisplayUserName } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'

const StatsCollectionCard = props => {
  const { data, type } = props
  const dispatch = useDispatch()
  return (
    <Link href={type === 'artworks' ? `/nft/${data.mint_address}` : `/collection/${data.collection_address}`} passHref>
      <a>
        <div
          className={styles.container}
          onClick={() => {
            dispatch({ type: 'set', isLoading: true })
          }}
        >
          <div className={styles.imageArea}>
            <ImageWithFoster
              src={type === 'artworks' ? data.asset_url : data.cover_image}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={styles.dataContainer}>
            <div className={styles.dataGradientBgView} />
            <div className={styles.dataContentView}>
              <div className={styles.nftName}>{type === 'artworks' ? data.asset_name : data.collection_name}</div>
              <div className="w-full flex justify-between pr-[13px] lg:pr-[25px]">
                <div className={styles.saleName}>
                  {type === 'artworks'
                    ? data.minter_username.length > 0
                      ? data.minter_username
                      : getDisplayUserName(data.minter_address)
                    : data.creator_username.length > 0
                    ? data.creator_username
                    : getDisplayUserName(data.creator_address)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default StatsCollectionCard
