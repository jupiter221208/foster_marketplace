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
import LoadingComponent from 'pages/explore/LoadingComponent'
import TimeSlotButton from 'components/Button/TimeSlotButton'

const MyNFTSection = props => {
  const { changeActiveTab } = props
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const isGetMyNFTs = useSelector<any>(state => state.isGetMyNFTs)
  const myNftList = useSelector<any>(state => state.myNftList)
  const [allNftList, setAllNftList] = useState<any>([])
  const [allList, setAllList] = useState<any>([])
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
    console.log(nfts, '===================nfts===========')
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
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [rowCount, setRowCount] = useState(12)
  const [active, setActive] = useState(0)

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
    let list = []

    let allList = myNftList as any[]
    setAllList(allList)
    allList.forEach(item => {
      let created = false
      let creators = item.creators
      creators.forEach(creator => {
        if (creator.address.toBase58() === publicKey.toBase58()) {
          created = true
          return
        }
      })
      if (active === 0) {
        if (created) list.push(item)
      } else {
        if (!created) list.push(item)
      }
    })

    setFilteredList(list)
    setAllNftList(list)
  }, [myNftList, active])

  useEffect(() => {
    let new_list = filteredList as any[]
    if (new_list.length > rowCount) setIsVisibleFetching(true)
    setNFTList(new_list.slice(0, rowCount))
  }, [filteredList])

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false)
      if (nftList.length + rowCount > filteredList.length) {
        setNFTList([...nftList, ...filteredList.slice(nftList.length, filteredList.length)])
        setIsVisibleFetching(false)
      } else {
        setNFTList([...nftList, ...filteredList.slice(nftList.length, nftList.length + rowCount)])
        setIsVisibleFetching(true)
      }
    }
  }, [isFetching])

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

  return (
    <section className={styles.container}>
      {!loading && allList.length > 0 && (
        <div className="w-full flex flex-wrap justify-between gap-[15px] items-center">
          <div className="w-full lg:w-[300px] flex h-[54px] mt-[15px] z-10">
            <div className={styles.slotBG}>
              <TimeSlotButton
                label="Created"
                onClick={() => setActive(0)}
                fontFamily={'Muli-SemiBold'}
                color={active === 0 ? '#1A1A1A' : '#979EA2'}
                backgroundColor01={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
                backgroundColor02={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
                gradientDirection="bottom"
                width={160}
                boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
              />
              <TimeSlotButton
                label="Collected"
                onClick={() => setActive(1)}
                fontFamily={'Muli-SemiBold'}
                color={active === 1 ? '#1A1A1A' : '#979EA2'}
                backgroundColor01={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
                backgroundColor02={active === 1 ? 'var(--toggle-bg-color)' : 'transparent'}
                gradientDirection="bottom"
                width={160}
                boxShadow={active === 1 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
              />
            </div>
          </div>
          <DashboardSearchBox placeholder="Search" onChange={key => searchNFT(key)} />
        </div>
      )}
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12 z-10">
        {!loading &&
          nftList.map((item, index) => (
            <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <MyNFTCard
                data={item}
                publicKey={publicKey}
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
        <div className="mt-[30px] lg:mt-[30px]">
          <NoDataSection
            title="There were no NFTs detected in your wallet"
            description="This tab displays the NFTs you own without an active listing"
          />
        </div>
      )}

      {!loading && isVisibleFetching && (
        <div className="w-full mt-[-100px] mb-[40px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
        </div>
      )}

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
