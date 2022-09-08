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

// styles
import styles from './index.module.scss'

import { useEnvironment } from 'providers/EnvironmentProvider'
import { useWallet } from '@solana/wallet-adapter-react'
import { getTokensByAccount } from 'utils/wallet.util'

const MyNFTSection = props => {
  const { viewport } = props
  const router = useRouter()
  const { connection } = useEnvironment()
  const { publicKey } = useWallet()

  const [myNFTftList, setMyNFTList] = useState([])

  useEffect(() => {
    async function loadMyNFTs() {
      if (!connection || !publicKey) {
        setMyNFTList([])
        return
      }

      setMyNFTList(await getTokensByAccount(publicKey, connection))
    }
    loadMyNFTs()
  }, [connection, publicKey])

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
      {selectedData && selectedData.length > 0 ? (
        <ListNFTModal
          viewport={viewport}
          data={selectedData}
          open={showListNFTModal}
          onClose={() => setShowListNFTModal(false)}
        />
      ) : viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <div className="h-[400px]"></div>
      ) : (
        <></>
      )}
    </section>
  )
}

export default MyNFTSection
