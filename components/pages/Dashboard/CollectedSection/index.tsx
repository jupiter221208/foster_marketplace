import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'

// components
import CollectionCard from 'components/Card/CollectionCard'
import StartAuctionModal from 'components/Modal/StartAuctionModal'
import ListNFTModal from 'components/Modal/ListNFTModal'
import ProgressingModal from 'components/Modal/ProgressingModal'
import LoadingModal from 'components/Modal/LoadingModal'
import Alert from 'components/Alert'

// json

// styles
import styles from './index.module.scss'
import { getMyNFTs } from 'utils/nfts.utils'
import { useMetaplex } from 'hooks/useMetaplex'

// api
import userAPI from 'apis/user'
import NoDataSection from '../NoDataSection'
import LoadingComponent from 'pages/explore/LoadingComponent'

const CollectedSection = props => {
  const { changeActiveTab } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [allNftList, setAllNFTList] = useState([])
  const isGetMyNFTs = useSelector<any>(state => state.isGetMyNFTs)
  const collectedNftList = useSelector<any>(state => state.collectedNftList)
  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [filteredList, setFilteredList] = useState<any>([])
  const [selectedData, setSelectedData] = useState()
  const [showStartAuctionModal, setShowStartAuctionModal] = useState(false)
  const [openProgressingModal, setOpenProgressingModal] = useState(false)
  const [showListNFTModal, setShowListNFTModal] = useState(false)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [rowCount, setRowCount] = useState(12)
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const { metaplex: mx } = useMetaplex()

  const loadMyNFTs = async () => {
    setLoading(true)
    let nfts = await getMyNFTs(mx)
    let validNfts = nfts.filter(item => item.creators?.length > 0 && item.collectionDetails === null)
    let collectedNfts = nfts.filter(
      item => item.creators?.length > 0 && item.creators[0].address.toString() != publicKey.toBase58()
    )
    dispatch({ type: 'set', isGetMyNFTs: true })
    dispatch({ type: 'set', myNftList: validNfts })
    dispatch({ type: 'set', collectedNftList: collectedNfts })
    setLoading(false)
  }

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
    setLoading(true)
  }, [])

  useEffect(() => {
    if (isGetMyNFTs) setLoading(false)
  }, [isGetMyNFTs])

  useEffect(() => {
    let list = []
    let allList = collectedNftList as any[]

    if (Array.isArray(allList)) {
      allList.forEach(item => {
        list.push(item)
      })
    }

    setAllNFTList(list)
  }, [collectedNftList])

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] grid grid-cols-12 z-10">
        {!loading &&
          allNftList.map((item, index) => (
            <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <CollectionCard
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
      {/* {allNftList.length > 0 && (
        <div className="w-full flex justify-end">
          <Pagination data={allNftList} getCurrentData={data => setNFTList(data)} />
        </div>
      )} */}
    </section>
  )
}

export default CollectedSection
