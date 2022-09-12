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
import { useWallet } from '@solana/wallet-adapter-react'

// components
import MyNFTCard from 'components/Card/MyNFTCard'
import StartAuctionModal from 'components/Modal/StartAuctionModal'
import ListNFTModal from 'components/Modal/ListNFTModal'
import ProgressingModal from 'components/Modal/ProgressingModal'

// custom functions
import { useEnvironment } from 'providers/EnvironmentProvider'
import { getTokensByAccount } from 'utils/wallet.util'

// styles
import styles from './index.module.scss'

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

  const [showStartAuctionModal, setShowStartAuctionModal] = useState(false)
  const [showListNFTModal, setShowListNFTModal] = useState(false)
  const [openProgressingModal, setOpenProgressingModal] = useState(false)

  const [selectedData, setSelectedData] = useState()

  const handleStartAuction = item => {
    setSelectedData(item)
    setShowStartAuctionModal(true)
  }

  const handleProgressAuction = () => {
    setShowStartAuctionModal(false)
    setOpenProgressingModal(true)
  }

  useEffect(() => {
    if (openProgressingModal) {
      setTimeout(() => {
        setOpenProgressingModal(false)
      }, 3000)
    }
  }, [openProgressingModal])

  const handleListNFT = item => {
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
                <MyNFTCard
                  viewport={viewport}
                  data={item}
                  onClickStartAuction={item => handleStartAuction(item)}
                  onClickListNFT={item => handleListNFT(item)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <StartAuctionModal
        viewport={viewport}
        data={selectedData}
        open={showStartAuctionModal}
        onClose={() => setShowStartAuctionModal(false)}
        onClick={() => handleProgressAuction()}
      />
      {openProgressingModal && <ProgressingModal viewport={viewport} open={openProgressingModal} />}
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
