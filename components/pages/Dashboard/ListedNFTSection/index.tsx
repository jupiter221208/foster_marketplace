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
import LoadingModal from 'components/Modal/LoadingModal'

// custom functions
import { useViewport } from 'utils'

// json
import MyNFTList from 'assets/json/dashboard/my-nft-list.json'

// styles
import styles from './index.module.scss'

import { getMyListedNFTs, cancelList } from "utils/auction.util"
import { useMetaplex } from 'hooks/useMetaplex'
import { useDispatch, useSelector } from 'react-redux'

const ListedNFTSection = () => {
  const viewport = useViewport()

  const [myNFTftList, setMyNFTList] = useState<any[]>([])

  const [showListNFTModal, setShowListNFTModal] = useState(false)

  const [selectedData, setSelectedData] = useState()
  const handleSelectData = item => {
    setSelectedData(item)
    setShowListNFTModal(true)
  }

  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)

  const { metaplex: mx } = useMetaplex()

  const setMyListedNFTs = async () => {
    dispatch({ type: 'set', isLoading: true })
    const listedNFTs = await getMyListedNFTs(mx)
    setMyNFTList(listedNFTs)
    dispatch({ type: 'set', isLoading: false })
  }
  
  useEffect(() => {
    if(mx) setMyListedNFTs()
  }, [mx])

  const onCancelList = async (id) => {
    const result = await cancelList(mx, id)
    if(result) {
      setShowListNFTModal(false)
      setMyListedNFTs()
    }
  }

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] z-10">
        <div className="col-span-12">
          <LoadingModal open={isLoading} />
        </div>
        {!isLoading && myNFTftList && <Swiper
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
        </Swiper>}
      </div>
      <UpdateNFTModal data={selectedData} open={showListNFTModal} onClose={() => setShowListNFTModal(false)} onCancelList={id => onCancelList(id)}/>
    </section>
  )
}

export default ListedNFTSection
