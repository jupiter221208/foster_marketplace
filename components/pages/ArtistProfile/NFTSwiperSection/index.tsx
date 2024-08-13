import React from 'react'

// next components
import { useRouter } from 'next/router'

// third party components

// components
import NFTCard from 'components/Card/NFTCard'
import { FadeLoader } from 'react-spinners'

// styles
import styles from './index.module.scss'

// redux
import NFTCreatedCard from 'components/Card/NFTCreatedCard'
import NFTStudioCard from 'components/Card/NFTStudioCard'

const NFTSwiperSection = props => {
  const { nfts, showHideButton, isLoaded, type = 'normal' } = props
  const router = useRouter()

  return !isLoaded ? (
    <section className={styles.container}>
      <div className="w-full flex justify-center items-center py-4 text-white text-xl font-bold">
        <div className="w-full flex justify-center">
          <FadeLoader color="var(--fade-loader-color)" width="6px" height="12px" />
        </div>
      </div>
    </section>
  ) : nfts.length === 0 ? (
    <section className={styles.container}>
      <div className={styles.noData}>No artwork available</div>
    </section>
  ) : (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        <div className="grid grid-cols-10 lg:grid-cols-20 gap gap-[11px] lg:gap-[20px] xl:gap-[20px] pb-[30px]">
          {nfts.map((item, index) => (
            <div className="col-span-10 sm:ol-span-5 lg:col-span-5 xl:col-span-4" key={index}>
              {type === 'created' ? (
                <NFTCreatedCard
                  token_id={item.token_id}
                  image={item.asset_url}
                  assetType={item.asset_type}
                  coverImage={item.cover_image_url}
                  nftName={item.nft_name}
                  collectionName={item.collection_name}
                  artistName={item.artist_username}
                  price={item.list_price}
                  showHideButton={showHideButton}
                  onClick={() => {
                    router.push(`/nft/${item.token_id}`)
                  }}
                  key={item}
                />
              ) : type === 'studio' ? (
                <NFTStudioCard
                  token_id={item.token_id}
                  image={item.asset_url}
                  coverImage={item.cover_image_url}
                  nftName={item.nft_name}
                  artistName={item.artist_username}
                  onClick={() => {
                    router.push(`/nft/${item.token_id}`)
                  }}
                  key={item}
                />
              ) : (
                <NFTCard
                  token_id={item.token_id}
                  image={item.asset_url}
                  assetType={item.asset_type}
                  coverImage={item.cover_image_url}
                  nftName={item.nft_name}
                  collectionName={item.collection_name}
                  artistName={item.artist_username}
                  price={item.list_price}
                  showHideButton={showHideButton}
                  onClick={() => {
                    router.push(`/nft/${item.token_id}`)
                  }}
                  key={item}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NFTSwiperSection
