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
import Button from 'components/Button'
import OutlineButton from 'components/Button/OutlineButton'
import NFTCard from 'components/Card/NFTCard'

// custom functions
import { useViewport } from 'utils'

// images and icons
import FilterGreenIcon from 'assets/icons/filter-green.svg'

// json
// import NFTList from 'assets/json/artist-profile/nft-list.json'

// styles
import styles from './index.module.scss'

// redux
import { useDispatch } from 'react-redux'

const NFTSwiperSection = props => {
  const { nfts, showHideButton } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  const [nftList, setNFTList] = useState<any[]>([])
  const [active, setActive] = useState<any>(0)
  const [showFilter, setShowFilter] = useState<boolean>(false)

  useEffect(() => {
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
  }, [nfts])

  const handleChangeActive = value => {
    setActive(value)

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

    switch (value) {
      case 0:
        setNFTList(newList.slice(0, 4))
        break
      case 1:
        setNFTList(newList.slice(0, 5))
        break
      case 2:
        setNFTList(newList.slice(0, 6))
        break
      default:
        setNFTList(newList)
        break
    }
  }

  return nfts.length === 0 ? (
    <section className={styles.container}>
      <div className="w-full flex justify-center items-center py-4 text-white text-xl font-bold">No data</div>
    </section>
  ) : (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        {nfts.length > 4 ? (
          <Swiper
            navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
            slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4}
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
            }
            modules={[Autoplay, Lazy, Navigation]}
            className="navigationSwiper"
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            {nftList.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
                  {item.map((nftItem: any, nftIndex) => (
                    <NFTCard
                      token_id={nftItem.token_id}
                      image={nftItem.asset_url}
                      assetType={nftItem.asset_type}
                      coverImage={nftItem.cover_image_url}
                      nftName={nftItem.nft_name}
                      artistName={nftItem.artist_username}
                      price={nftItem.list_price}
                      showHideButton={showHideButton}
                      onClick={() => {
                        dispatch({ type: 'set', isLoading: true })
                        router.push(`/browse-nft?id=${nftItem.token_id}`)
                      }}
                      key={nftIndex}
                    />
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-12 gap gap-[11px] lg:gap-[20px] xl:gap-[34px] pb-[30px]">
            {nfts.map((item, index) => (
              <div className="col-span-6 lg:col-span-4 xl:col-span-3" key={index}>
                <NFTCard
                  token_id={item.token_id}
                  image={item.asset_url}
                  assetType={item.asset_type}
                  coverImage={item.cover_image_url}
                  nftName={item.nft_name}
                  artistName={item.artist_username}
                  price={item.list_price}
                  onClick={() => {
                    dispatch({ type: 'set', isLoading: true })
                    router.push(`/browse-nft?id=${item.token_id}`)
                  }}
                  key={item}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <div className="w-full flex lg:hidden justify-center">
        <div className="w-full max-w-[242px] z-10">
          <OutlineButton
            label="See More"
            fullWidth
            onClick={() => router.push('/explore')}
            borderColor="#ffffff"
            height="40px"
          />
        </div>
      </div> */}
    </section>
  )
}

export default NFTSwiperSection
