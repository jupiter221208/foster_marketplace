import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import OutlineButton from 'components/Button/OutlineButton'
import NFTCard from 'components/Card/NFTCard'

// custom functions
import { useViewport } from 'utils'
import { useDispatch } from 'react-redux'

// styles
import styles from './index.module.scss'

// api
import SeeMoreButton from 'components/Button/SeeMoreButton'

const MoreCollectionSection = props => {
  const { collectionId, collectionName = '', collectionNFTs } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  useEffect(() => {
    fetchNftData(collectionNFTs)
  }, [collectionNFTs])

  const fetchNftData = nfts => {
    if (nfts.length > 0) {
      ;(async () => {
        for (let index = 0; index < nfts.length; index++) {
          let data = nfts[index]
          fetch(`/nft/${data.token_id}`).then(e => e.text())
          if (index % 4 == 3) {
            await sleep(1000)
          }
        }
      })()
    }
  }

  return collectionNFTs.length > 0 ? (
    <section className={styles.container}>
      <div className="w-full flex justify-between items-center z-10">
        <div className="w-full lg:w-auto flex justify-center lg:justify-start items-center gap-4 lg:gap-8">
          <div className={`${styles.title} mr-0 lg:mr-6 xl:mr-8`}>
            {collectionName?.length > 0 && `More from ${collectionName}`}
          </div>
        </div>
        <div className="hidden lg:flex z-10">
          <SeeMoreButton
            onClick={() => {
              dispatch({ type: 'set', isLoading: true })
              router.push(`/collection/${collectionId}`)
            }}
          />
        </div>
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4}
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40}
          modules={[Autoplay, Lazy, Navigation]}
          className={collectionNFTs.length > 4 ? 'navigationSwiper' : 'noScrollNavigationSwiper'}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {collectionNFTs.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
                <NFTCard
                  token_id={item.token_id}
                  image={item.asset_url}
                  nftName={item.nft_name}
                  assetType={item.asset_type}
                  coverImage={item.cover_image_url}
                  artistName={item.artist_username}
                  collectionName={collectionName}
                  price={item.list_price}
                  onClick={() => router.push(`/nft/${item.token_id}`)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="w-full flex lg:hidden justify-center">
        <div className="w-full max-w-[242px] z-10">
          <OutlineButton
            label="See More"
            fullWidth
            onClick={() => router.push(`/collection/${collectionId}`)}
            borderColor={'var(--see-more-border)'}
            height="40px"
          />
        </div>
      </div>
    </section>
  ) : (
    <></>
  )
}
export default MoreCollectionSection
