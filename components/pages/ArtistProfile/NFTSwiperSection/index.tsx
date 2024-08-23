import React from 'react'

// next components
import { useRouter } from 'next/router'

// third party components

// components
import { FadeLoader } from 'react-spinners'

// styles
import styles from './index.module.scss'

// redux
import HomeNftCard from 'components/Card/HomeNFTCard'

const NFTSwiperSection = props => {
  const { nfts, showHideButton, isLoaded, type = 'normal' } = props

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
        <div className="grid grid-cols-10 lg:grid-cols-20 gap gap-[11px] lg:gap-[20px] xl:gap-[30px] pb-[30px]">
          {nfts.map((item, index) => (
            <div className="col-span-10 sm:ol-span-5 lg:col-span-5 2xl:col-span-4" key={index}>
              {type === 'created' ? (
                <HomeNftCard
                  image={item.asset_url}
                  token_id={item.token_id}
                  nftName={item.nft_name}
                  assetType={item.asset_type}
                  coverImage={item.cover_image_url}
                  artistName={item.artist_username}
                  artistImage={item.artist_profile_picture}
                  collectionName={item.collection_name}
                  price={item.list_price}
                  parentNft={item.parent_nft}
                  showHideButton={showHideButton}
                  onClick={() => {}}
                  key={index}
                />
              ) : type === 'studio' ? (
                <HomeNftCard
                  image={item.asset_url}
                  token_id={item.token_id}
                  nftName={item.nft_name}
                  assetType={item.asset_type}
                  coverImage={item.cover_image_url}
                  artistName={item.artist_username}
                  artistImage={item.artist_profile_picture}
                  collectionName={item.collection_name}
                  price={item.list_price}
                  parentNft={item.parent_nft}
                  onClick={() => {}}
                  key={index}
                />
              ) : (
                <HomeNftCard
                  image={item.asset_url}
                  token_id={item.token_id}
                  nftName={item.nft_name}
                  assetType={item.asset_type}
                  coverImage={item.cover_image_url}
                  artistName={item.artist_username}
                  artistImage={item.artist_profile_picture}
                  collectionName={item.collection_name}
                  price={item.list_price}
                  parentNft={item.parent_nft}
                  onClick={() => {}}
                  key={index}
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
