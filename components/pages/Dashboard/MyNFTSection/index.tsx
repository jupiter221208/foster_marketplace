import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'

// third party components
import { useWallet, useConnection } from '@solana/wallet-adapter-react'

// components
import MyNFTCard from 'components/Card/MyNFTCard'
import Pagination from 'components/Button/Pagination'
import StartAuctionModal from 'components/Modal/StartAuctionModal'
import ListNFTModal from 'components/Modal/ListNFTModal'
import ProgressingModal from 'components/Modal/ProgressingModal'
import LoadingModal from 'components/Modal/LoadingModal'

// custom functions
import { getTokensByAccount } from 'utils/wallet.util'

// styles
import styles from './index.module.scss'
import { getMyNFTs } from 'utils/nfts.utils'
import { useMetaplex } from 'hooks/useMetaplex'

const MyNFTSection = props => {
  const { changeActiveTab } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const isGetMyNFTs = useSelector<any>(state => state.isGetMyNFTs)
  const myNftList = useSelector<any>(state => state.myNftList)
  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const { metaplex: mx } = useMetaplex()

  const loadMyNFTs = async () => {
    setLoading(true)
    let nfts = await getMyNFTs(mx)
    dispatch({ type: 'set', isGetMyNFTs: true })
    dispatch({ type: 'set', myNftList: nfts })
    setLoading(false)
  }

  useEffect(() => {
    if (mx && connection && publicKey && !isGetMyNFTs) {
      loadMyNFTs()
    }
  }, [mx, connection, publicKey, isGetMyNFTs])

  const [nftList, setNFTList] = useState([])

  const [showStartAuctionModal, setShowStartAuctionModal] = useState(false)
  const [showListNFTModal, setShowListNFTModal] = useState(false)
  const [openProgressingModal, setOpenProgressingModal] = useState(false)

  const [selectedData, setSelectedData] = useState()

  const handleGotoDetailPage = (data: any) => {
    router.push(`/browse-nft?id=${data.mintAddress.toString()}&type=general`)
  }

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
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12 z-10">
        {!loading &&
          nftList.map((item, index) => (
            <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <MyNFTCard
                data={item}
                onClick={(data: any) => handleGotoDetailPage(data)}
                onClickStartAuction={item => handleStartAuction(item)}
                onClickListNFT={item => handleListNFT(item)}
              />
            </div>
          ))}
        <div className="col-span-12">
          <LoadingModal open={loading} />
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={myNftList} getCurrentData={data => setNFTList(data)} />
      </div>
      <StartAuctionModal
        data={selectedData}
        open={showStartAuctionModal}
        onClose={() => setShowStartAuctionModal(false)}
        onClick={() => handleProgressAuction()}
      />
      {openProgressingModal && <ProgressingModal open={openProgressingModal} />}
      <ListNFTModal
        data={selectedData}
        open={showListNFTModal}
        onClose={(status: string) => {
          setShowListNFTModal(false)
          loadMyNFTs()
          if (status === 'listed') changeActiveTab(1)
        }}
      />
    </section>
  )
}

export default MyNFTSection
