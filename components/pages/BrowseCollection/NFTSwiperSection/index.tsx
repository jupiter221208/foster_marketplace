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

// json
import NFTList from 'assets/json/browse-collection/nft-list.json'

// styles
import styles from './index.module.scss'

const NFTSwiperSection = ({ nfts }) => {
  console.log('nfts==================', nfts)
  const viewport = useViewport()
  const router = useRouter()

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
      console.log('nfeList', newList)
      setNFTList(newList)
    }
  }, [nfts])

  return (
    <section className={styles.container}>
      {nfts !== undefined && (
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
                        image={nftItem.offchainMetadata.image}
                        nftName={nftItem.offchainMetadata.name}
                        artistName={nftItem.creators[0].address.toString()}
                        price={nftItem.price}
                        onClick={() => router.push(`/browse-nft?id=${nftItem.mintAddress.toString()}`)}
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
                <div className="col-span-6 lg:col-span-3">
                  <NFTCard
                    image={item.offchainMetadata.image}
                    nftName={item.offchainMetadata.name}
                    artistName={item.creators[0].address.toString()}
                    price={item.price}
                    onClick={() => router.push(`/browse-nft?id=${item.mintAddress.toString()}`)}
                    key={index}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="w-full flex lg:hidden justify-center">
        <div className="w-full max-w-[242px] z-10">
          <OutlineButton
            label="See More"
            fullWidth
            onClick={() => router.push('/explore')}
            borderColor="#ffffff"
            height="40px"
          />
        </div>
      </div>
    </section>
  )
}

export default NFTSwiperSection
