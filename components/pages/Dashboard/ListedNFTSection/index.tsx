import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// components
import Pagination from 'components/Button/Pagination'
import ListedNFTCard from 'components/Card/ListedNFTCard'
import UpdateNFTModal from 'components/Modal/UpdateNFTModal'
import LoadingModal from 'components/Modal/LoadingModal'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

import { getMyListedNFTs, cancelList } from 'utils/auction.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { useDispatch, useSelector } from 'react-redux'

const ListedNFTSection = () => {
  const viewport = useViewport()

  const router = useRouter()

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

  const handleGotoDetailPage = (data: any) => {
    localStorage.setItem('selectedNFT', JSON.stringify(data))
    router.push('/browse-nft')
  }

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12 z-10">
        {nftList.map((item, index) => (
          <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
            <ListedNFTCard
              data={item}
              onClick={(data: any) => handleGotoDetailPage(data)}
              onUpdateClick={item => handleSelectData(item)}
            />
          </div>
        ))}
        <div className="col-span-12">
          <LoadingModal open={isLoading} />
        </div>
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
