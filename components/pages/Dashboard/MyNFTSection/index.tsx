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
import Alert from 'components/Alert'
import SearchBox from 'components/Input/SearchBox'

// custom functions
import { getTokensByAccount } from 'utils/wallet.util'

// styles
import styles from './index.module.scss'
import { getMyNFTs } from 'utils/nfts.utils'
import { useMetaplex } from 'hooks/useMetaplex'
import DashboardSearchBox from 'components/Input/DashboardSearchBox'
import NoDataSection from '../NoDataSection'

const MyNFTSection = props => {
  const { changeActiveTab } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const isGetMyNFTs = useSelector<any>(state => state.isGetMyNFTs)
  const myNftList = useSelector<any>(state => state.myNftList)
  const [allNftList, setAllNftList] = useState<any>([])
  const [filteredList, setFilteredList] = useState<any>([])
  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const { metaplex: mx } = useMetaplex()
  const loadMyNFTs = async () => {
    setLoading(true)
    let nfts = await getMyNFTs(mx)
    let validNfts = nfts.filter(item => item.creators?.length > 0)
    dispatch({ type: 'set', isGetMyNFTs: true })
    dispatch({ type: 'set', myNftList: validNfts })
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
  const [alertData, setAlertData] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [selectedData, setSelectedData] = useState()

  const handleGotoDetailPage = (data: any) => {
    router.push(`/browse-nft?id=${data.mintAddress.toString()}&type=general`)
  }

  const handleStartAuction = item => {
    setSelectedData(item)
    setShowStartAuctionModal(true)
  }

  const handleSuccessAuction = nftName => {
    setShowStartAuctionModal(false)
    setAlertData([
      {
        id: 0,
        title: 'Auction Published!',
        description: `You've successfully published an auction for ${nftName}`,
        type: 'success',
      },
    ])
    setTimeout(() => {
      setOpenProgressingModal(true)
    }, 500)
  }

  useEffect(() => {
    if (openProgressingModal) {
      setTimeout(() => {
        setOpenProgressingModal(false)
        setTimeout(() => {
          setShowAlert(true)
        }, 500)
      }, 3000)
    }
  }, [openProgressingModal])

  const handleListNFT = item => {
    setSelectedData(item)
    setShowListNFTModal(true)
  }

  useEffect(() => {
    setAllNftList(myNftList)
    setFilteredList(myNftList)
  }, [myNftList])

  const searchNFT = key => {
    if (key === '') {
      setFilteredList(allNftList)
    } else {
      let filtered = []
      allNftList.forEach(element => {
        if (
          element.json?.name?.toLowerCase().includes(key.toLowerCase()) ||
          element.name.toLowerCase().includes(key.toLowerCase())
        )
          filtered.push(element)
      })
      setFilteredList(filtered)
    }
  }

  return (
    <section className={styles.container}>
      {!loading && allNftList.length > 0 && (
        <DashboardSearchBox placeholder="Search" onChange={key => searchNFT(key)} />
      )}
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
      {isGetMyNFTs && allNftList.length === 0 && (
        <div className="mt-[30px] lg:mt-[70px]">
          <NoDataSection
            title="There were no NFTs detected in your wallet"
            description="This tab displays the NFTs you own without an active listing"
          />
        </div>
      )}
      <div className="w-full flex justify-end">
        <Pagination data={filteredList} getCurrentData={data => setNFTList(data)} />
      </div>

      <StartAuctionModal
        data={selectedData}
        open={showStartAuctionModal}
        onSuccess={nft => handleSuccessAuction(nft)}
        onClose={() => setShowStartAuctionModal(false)}
      />
      <ProgressingModal open={openProgressingModal} />
      <ListNFTModal
        data={selectedData}
        open={showListNFTModal}
        onClose={(status: string) => {
          setShowListNFTModal(false)
          if (status === 'listed') {
            loadMyNFTs()
            changeActiveTab(1)
          }
        }}
      />
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </section>
  )
}

export default MyNFTSection
