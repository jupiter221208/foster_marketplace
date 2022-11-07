import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// components
import Pagination from 'components/Button/Pagination'
import ListedNFTCard from 'components/Card/ListedNFTCard'
import UpdateNFTModal from 'components/Modal/UpdateNFTModal'
import LoadingModal from 'components/Modal/LoadingModal'
import FilterButton from 'components/Button/FilterButton'

// styles
import styles from './index.module.scss'

import { getMyListedNFTs, cancelList, updateList } from 'utils/auction.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { useDispatch, useSelector } from 'react-redux'

// call apis
import listingsAPI from 'apis/listings'

const ListedNFTSection = () => {
  const router = useRouter()

  const [myNFTftList, setMyNFTList] = useState<any[]>([])

  const [showListNFTModal, setShowListNFTModal] = useState(false)

  const [selectedData, setSelectedData] = useState()
  const handleSelectData = item => {
    if (active === 0) {
      // update listing
    } else {
      // cancel listing
    }
    // setSelectedData(item)
    // setShowListNFTModal(true)
  }
  const [fixedPriceNFTs, setFixedPriceNFTs] = useState<any[]>([])
  const [liveAuctionNFTs, setLiveAuctionNFTs] = useState<any[]>([])
  const [active, setActive] = useState(0)

  const handleChangeActive = value => {
    setActive(value)
  }

  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)

  const { metaplex: mx } = useMetaplex()

  const [nftList, setNFTList] = useState([])

  const setMyListedNFTs = async () => {
    dispatch({ type: 'set', isLoading: true })
    let fixedPrice = await getMyListedNFTs(mx)
    let liveAuction = await getMyListedNFTs(mx)
    setFixedPriceNFTs(fixedPrice)
    setLiveAuctionNFTs(liveAuction)

    if (active === 0) {
      if (fixedPrice !== undefined && fixedPrice !== null) {
        setMyNFTList(fixedPrice)
      }
    } else {
      if (liveAuction !== undefined && liveAuction !== null) {
        setMyNFTList(liveAuction)
      }
    }
    dispatch({ type: 'set', isLoading: false })
  }

  useEffect(() => {
    if (active === 0) {
      if (fixedPriceNFTs !== undefined && fixedPriceNFTs !== null) {
        setMyNFTList(fixedPriceNFTs)
      }
    } else {
      if (liveAuctionNFTs !== undefined && liveAuctionNFTs !== null) {
        setMyNFTList(liveAuctionNFTs)
      }
    }
  }, [active])

  useEffect(() => {
    if (mx) setMyListedNFTs()
  }, [mx])

  const onCancelList = async (mintAddress, tradeStateAddress) => {
    const result = await cancelList(mx, tradeStateAddress)
    if (result) {
      setShowListNFTModal(false)
      listingsAPI.unlistNft(mintAddress).then(response => console.log(response)),
        error => {
          console.log(error)
        }
      setMyListedNFTs()
    }
  }

  const onUpdatePrice = async (nftAddress, tradeStateAddress, price) => {
    const result = await updateList(mx, nftAddress, tradeStateAddress, price)
    if (result) {
      setShowListNFTModal(false)
      setMyListedNFTs()
    }
  }

  const handleGotoDetailPage = (data: any) => {
    router.push(`/browse-nft?id=${data.asset.mint.address.toString()}`)
  }

  return (
    <section className={styles.container}>
      <div className="flex">
        <FilterButton
          label="Fixed-Price"
          onClick={() => handleChangeActive(0)}
          color={active === 0 ? '#5AC3BA' : '#979EA2'}
          background={
            active === 0 ? 'linear-gradient(to bottom, rgba(18, 18, 18, 100%), rgba(32, 36, 39, 100%))' : 'transparent'
          }
        />
        <FilterButton
          label="Live Auction"
          onClick={() => handleChangeActive(1)}
          color={active === 1 ? '#5AC3BA' : '#979EA2'}
          background={
            active === 1 ? 'linear-gradient(to bottom, rgba(18, 18, 18, 100%), rgba(32, 36, 39, 100%))' : 'transparent'
          }
        />
      </div>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12 z-10">
        {!isLoading &&
          nftList.map((item, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <ListedNFTCard
                data={item}
                type={active === 0 ? 'fixed' : 'auction'}
                onClick={(data: any) => handleGotoDetailPage(data)}
                onActionClick={item => handleSelectData(item)}
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
        onCancelList={(mintAddress, tradeStateAddress) => onCancelList(mintAddress, tradeStateAddress)}
        onUpdatePrice={(nftAddress, tradeStateAddress, price) => onUpdatePrice(nftAddress, tradeStateAddress, price)}
      />
    </section>
  )
}

export default ListedNFTSection
