import React, { useEffect, useState } from 'react'

// third party components
import { useWallet, useConnection } from '@solana/wallet-adapter-react'

// components
import MyNFTCard from 'components/Card/MyNFTCard'
import Pagination from 'components/Button/Pagination'
import StartAuctionModal from 'components/Modal/StartAuctionModal'
import ListNFTModal from 'components/Modal/ListNFTModal'
import ProgressingModal from 'components/Modal/ProgressingModal'

// custom functions
import { getTokensByAccount } from 'utils/wallet.util'

// styles
import styles from './index.module.scss'

const MyNFTSection = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const [myNFTftList, setMyNFTList] = useState<any[]>([])

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

  const [nftList, setNFTList] = useState([])

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
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12 z-10">
        {nftList.map((item, index) => (
          <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
            <MyNFTCard
              data={item}
              onClickStartAuction={item => handleStartAuction(item)}
              onClickListNFT={item => handleListNFT(item)}
            />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={myNFTftList} getCurrentData={data => setNFTList(data)} />
      </div>
      <StartAuctionModal
        data={selectedData}
        open={showStartAuctionModal}
        onClose={() => setShowStartAuctionModal(false)}
        onClick={() => handleProgressAuction()}
      />
      {openProgressingModal && <ProgressingModal open={openProgressingModal} />}
      <ListNFTModal data={selectedData} open={showListNFTModal} onClose={() => setShowListNFTModal(false)} />
    </section>
  )
}

export default MyNFTSection
