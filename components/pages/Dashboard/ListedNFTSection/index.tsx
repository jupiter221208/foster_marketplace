import React, { useEffect, useState } from 'react'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import ListedNFTCard from 'components/Card/ListedNFTCard'
import UpdateNFTModal from 'components/Modal/UpdateNFTModal'

// custom functions
import { useViewport } from 'utils'

// json
import MyNFTList from 'assets/json/dashboard/my-nft-list.json'

// styles
import styles from './index.module.scss'

const ListedNFTSection = () => {
  const viewport = useViewport()

  const [myNFTftList, setMyNFTList] = useState<any[]>([])

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
                <ListedNFTCard data={item} onClick={item => handleSelectData(item)} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <UpdateNFTModal data={selectedData} open={showListNFTModal} onClose={() => setShowListNFTModal(false)} />
    </section>
  )
}

export default ListedNFTSection
