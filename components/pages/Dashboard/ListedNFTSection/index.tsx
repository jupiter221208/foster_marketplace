import React, { useEffect, useState } from 'react'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import Pagination from 'components/Button/Pagination'
import ListedNFTCard from 'components/Card/ListedNFTCard'
import UpdateNFTModal from 'components/Modal/UpdateNFTModal'
import LoadingModal from 'components/Modal/LoadingModal'

// custom functions
import { useViewport } from 'utils'

// json
import MyNFTList from 'assets/json/dashboard/my-nft-list.json'

// styles
import styles from './index.module.scss'

import { getMyListedNFTs, cancelList } from 'utils/auction.util'
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

  const [nftList, setNFTList] = useState([])

  const setMyListedNFTs = async () => {
    dispatch({ type: 'set', isLoading: true })
    const listedNFTs = await getMyListedNFTs(mx)
    setMyNFTList(listedNFTs)
    dispatch({ type: 'set', isLoading: false })
  }

  useEffect(() => {
    if (mx) setMyListedNFTs()
  }, [mx])

  const onCancelList = async id => {
    const result = await cancelList(mx, id)
    if (result) {
      setShowListNFTModal(false)
      setMyListedNFTs()
    }
  }

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12 z-10">
        <div className="col-span-12">
          <LoadingModal open={isLoading} />
        </div>
        {nftList.map((item, index) => (
          <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
            <ListedNFTCard data={item} onClick={item => handleSelectData(item)} />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={myNFTftList} getCurrentData={data => setNFTList(data)} />
      </div>
      <UpdateNFTModal
        data={selectedData}
        open={showListNFTModal}
        onClose={() => setShowListNFTModal(false)}
        onCancelList={id => onCancelList(id)}
      />
    </section>
  )
}

export default ListedNFTSection
