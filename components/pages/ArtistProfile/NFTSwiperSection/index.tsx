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

const NFTSwiperSection = props => {
  const { nfts } = props
  const viewport = useViewport()
  const router = useRouter()

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

  return (
    <section className={styles.container}>
      <div className={`w-full flex ${viewport === 'xs' ? 'justify-end' : 'justify-between'} items-center z-10`}>
        {showFilter ? (
          <div className="flex h-[42px] justify-between lg:justify-start items-center gap-4 lg:gap-8 mr-[10px]">
            <div className="flex z-10">
              <Button
                label="Created"
                onClick={() => handleChangeActive(0)}
                color={active === 0 ? '#202427' : '#979EA2'}
                height={viewport === 'xs' ? 32 : 42}
                backgroundColor={active === 0 ? '#5ac3ba' : 'transparent'}
              />
              <Button
                label="All"
                onClick={() => handleChangeActive(1)}
                color={active === 1 ? '#202427' : '#979EA2'}
                height={viewport === 'xs' ? 32 : 42}
                backgroundColor={active === 1 ? '#5ac3ba' : 'transparent'}
              />
              <Button
                label="Collected"
                onClick={() => handleChangeActive(2)}
                color={active === 2 ? '#202427' : '#979EA2'}
                height={viewport === 'xs' ? 32 : 42}
                backgroundColor={active === 2 ? '#5ac3ba' : 'transparent'}
              />
            </div>
          </div>
        ) : (
          <div className="h-[42px]"></div>
        )}
        <div className="flex z-10">
          <OutlineButton
            label={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : 'Filter'}
            icon={FilterGreenIcon}
            onClick={() => {
              setShowFilter(!showFilter)
            }}
            borderColor={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '#63D6CD' : '#ffffff'}
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '32px' : '51px'}
            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '32px' : ''}
            direction="rtl"
          />
        </div>
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4}
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40}
          modules={[Autoplay, Lazy, Navigation]}
          className="navigationSwiper"
          loop
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
                    image={nftItem.asset_url}
                    nftName={nftItem.nft_name}
                    artistName={nftItem.artist_username}
                    price={nftItem.list_price ?? 0}
                    onClick={() => router.push(`/browse-nft?id=${item.token_id}`)}
                    key={nftIndex}
                  />
                ))}
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
