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
import MyNFTCard from 'components/Card/MyNFTCard'
import ListNFTModal from 'components/Modal/ListNFTModal'

// json
import MyNFTList from 'assets/json/dashboard/my-nft-list.json'

// styles
import styles from './index.module.scss'

const MyNFTSection = props => {
  const { viewport } = props
  const router = useRouter()

  const [myNFTftList, setMyNFTList] = useState([])

  useEffect(() => {
    setMyNFTList(MyNFTList)
  }, [])

  const [showListNFTModal, setShowListNFTModal] = useState(false)

  const [selectedData, setSelectedData] = useState()
  const handleSelectData = item => {
    setSelectedData(item)
    setShowListNFTModal(true)
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
          className="navigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {myNFTftList.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-wrap gap gap-[11px] lg:gap-[20px] xl:gap-[34px]">
                <MyNFTCard viewport={viewport} data={item} onClick={item => handleSelectData(item)} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <ListNFTModal
        viewport={viewport}
        data={selectedData}
        open={showListNFTModal}
        onClose={() => setShowListNFTModal(false)}
      />
    </section>
  )
}

export default MyNFTSection
