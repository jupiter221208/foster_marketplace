import React, { useEffect, useState } from 'react'
// import Lottie from 'lottie-react'

// next components
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
// import Image from 'next/image'

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

// styles
import styles from './index.module.scss'
import { getMyNFTs } from 'utils/nfts.utils'
import { useMetaplex } from 'hooks/useMetaplex'
import DashboardSearchBox from 'components/Input/DashboardSearchBox'
import NoDataSection from '../NoDataSection'

// images
// import RefreshIcon from 'assets/icons/refresh-icon.svg'
// import RefreshMobileIcon from 'assets/icons/refresh-icon-mobile.svg'
// import RefreshLottery from 'assets/lottery/refresh.json'
// import RefreshMobileLottery from 'assets/lottery/refresh-mobile.json'

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
    let validNfts = nfts.filter(item => item.creators?.length > 0 && item.collectionDetails === null)
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
    dispatch({ type: 'set', isLoading: true })
    router.push(`/nft/${data.mintAddress.toString()}`)
  }

  const handleStartAuction = item => {
    setSelectedData(item)
    setShowStartAuctionModal(true)
  }

  const handleStartProgress = () => {
    setOpenProgressingModal(true)
  }

  const handleSuccessAuction = nftName => {
    loadMyNFTs()

    setOpenProgressingModal(false)

    setAlertData([
      {
        id: 0,
        title: 'Auction Published!',
        description: `You've successfully published an auction for ${nftName}`,
        type: 'success',
      },
    ])

    setTimeout(() => {
      setShowStartAuctionModal(false)
      setTimeout(() => {
        setShowAlert(true)
      }, 1000)
    }, 1000)
  }

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
      setFilteredList([])
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

  // const [refreshing, setRefreshing] = useState(false)
  // const refreshNFT = () => {
  //   setRefreshing(true)
  //   setTimeout(() => {
  //     setRefreshing(false)
  //   }, 2000)
  // }

  return (
    <section className={styles.container}>
      {!loading && allNftList.length > 0 && (
        <div className="w-full flex justify-between gap-[15px] items-center">
          <DashboardSearchBox placeholder="Search" onChange={key => searchNFT(key)} />
          {/* <div className="w-[140px] h-[46px] lg:flex hidden">
            {refreshing ? (
              <Lottie animationData={RefreshLottery} loop={true} />
            ) : (
              <div className={styles.refreshButton} onClick={() => refreshNFT()}>
                <Image src={RefreshIcon} width={28} height={28} alt="" />
                <div className="mb-[4px]">Refresh</div>
              </div>
            )}
          </div>
          <div className="w-[26px] h-[26px] flex lg:hidden">
            {refreshing ? (
              <Lottie width={26} height={26} animationData={RefreshMobileLottery} loop={true} />
            ) : (
              <div onClick={() => refreshNFT()}>
                <Image src={RefreshMobileIcon} width={26} height={26} alt="" />
              </div>
            )}
          </div> */}
        </div>
      )}
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12 z-10">
        {!loading &&
          nftList.map((item, index) => (
            <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <MyNFTCard
                data={item}
                publicKey={publicKey}
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
        <Pagination
          data={filteredList}
          getCurrentData={data => {
            setNFTList([])
            window.scrollTo({
              top: 550,
            })
            setTimeout(() => {
              setNFTList(data)
            }, 500)
          }}
        />
      </div>

      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />

      <ProgressingModal open={openProgressingModal} />

      <StartAuctionModal
        data={selectedData}
        open={showStartAuctionModal}
        onSuccess={nft => handleSuccessAuction(nft)}
        onStartProgress={() => handleStartProgress()}
        onClose={() => setShowStartAuctionModal(false)}
      />
      <ListNFTModal
        data={selectedData}
        open={showListNFTModal}
        onClose={(status: string) => {
          setShowListNFTModal(false)
          if (status === 'listed') {
            loadMyNFTs()
            changeActiveTab(1)
          } else if (status === 'list-close') {
            loadMyNFTs()
          }
        }}
      />
    </section>
  )
}

export default MyNFTSection
