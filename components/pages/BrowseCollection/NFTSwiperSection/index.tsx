import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

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
import NFTCard from 'components/Card/NFTCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const NFTSwiperSection = ({ nfts, collectionName, showHideButton }) => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [nftList, setNFTList] = useState<any[]>([])

  useEffect(() => {
    if (nfts) {
      let newList: any[] = []
      let tempItem: any[] = []
      nfts.map((item, index) => {
        tempItem.push(item)
        if (index % 2 === 1) {
          newList.push(tempItem)
          tempItem = []
        }
      })
      if (tempItem.length > 0) newList.push(tempItem)
      setNFTList(newList)
    }
  }, [nfts])

  return (
    nfts !== undefined && (
      <section className={styles.container}>
        <div className="w-full mt-[15px] lg:mt-[34px] z-10">
          {nfts.length > 5 ? (
            <Swiper
              navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
              slidesPerView={
                viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4
              }
              spaceBetween={
                viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
              }
              modules={[Autoplay, Lazy, Navigation]}
              className="showNavigationSwiper"
              loop
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
            >
              {nftList.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
                    {item.map((nftItem, nftIndex) => (
                      <NFTCard
                        token_id={item.token_id}
                        image={nftItem.asset_url}
                        nftName={nftItem.nft_name}
                        assetType={nftItem.asset_type}
                        coverImage={nftItem.cover_image_url}
                        artistName={nftItem.artist_username}
                        collectionName={collectionName}
                        price={nftItem.list_price}
                        showHideButton={showHideButton}
                        onClick={() => {
                          let token_id = nftItem.mintAddress
                          if (token_id === null || token_id === undefined) token_id = nftItem.token_id
                          if (token_id !== null && token_id !== undefined) {
                            dispatch({ type: 'set', isLoading: true })
                            router.push(`/nft/${token_id.toString()}`)
                          }
                        }}
                        key={nftIndex}
                      />
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-12 gap-[11px] lg:gap-[20px] xl:gap-[34px]">
              {nfts.map((item, index) => (
                <div className="col-span-6 lg:col-span-3" key={index}>
                  <NFTCard
                    token_id={item.token_id}
                    image={item.asset_url}
                    nftName={item.nft_name}
                    assetType={item.asset_type}
                    coverImage={item.cover_image_url}
                    artistName={item.artist_username}
                    collectionName={collectionName}
                    artistId={item.artist_id}
                    price={item.list_price}
                    showHideButton={showHideButton}
                    onClick={() => {
                      let token_id = item.mintAddress
                      if (token_id === null || token_id === undefined) token_id = item.token_id
                      if (token_id !== null && token_id !== undefined) {
                        dispatch({ type: 'set', isLoading: true })
                        router.push(`/nft/${token_id.toString()}`)
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  )
}

export default NFTSwiperSection
