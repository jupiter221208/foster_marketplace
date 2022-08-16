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

// images and icons
import FilterGreenIcon from 'assets/icons/filter-green.svg'

// json
import NFTList from 'assets/json/browse-collection/nft-list.json'

// styles
import styles from './index.module.scss'

const NFTSwiperSection = props => {
  const { viewport } = props
  const router = useRouter()

  const [nftList, setNFTList] = useState([])

  const [active, setActive] = useState(0)

  useEffect(() => {
    let newList = []
    let tempItem = []
    NFTList.map((item, index) => {
      tempItem.push(item)
      if (index % 2 === 1) {
        newList.push(tempItem)
        tempItem = []
      }
    })
    if (tempItem.length > 0) newList.push(tempItem)
    setNFTList(newList)
  }, [])

  const handleChangeActive = value => {
    setActive(value)

    let newList = []
    let tempItem = []
    NFTList.map((item, index) => {
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
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          centeredSlides={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? true : false}
          slidesPerView={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 2 : viewport === 'lg' ? 3 : 4}
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40}
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
                    viewport={viewport}
                    image={nftItem.image}
                    nftName={nftItem.nftName}
                    artistName={nftItem.artistName}
                    icon={nftItem.icon}
                    price={nftItem.price}
                    onClick={() => router.push('/browse-nft')}
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
            onClick={() => router.push('/see-more')}
            borderColor="#ffffff"
            height="40px"
          />
        </div>
      </div>
    </section>
  )
}

export default NFTSwiperSection
