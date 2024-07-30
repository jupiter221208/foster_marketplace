import React, { useEffect, useState } from 'react'
// import Lottie from 'lottie-react'

// next components
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
import { getEditionList } from 'apis/editions'
import { useMetaplex } from 'hooks/useMetaplex'
import DashboardSearchBox from 'components/Input/DashboardSearchBox'
import NoDataSection from '../NoDataSection'
import { NftData } from 'types/nft'

import ListEditionModal from 'components/Modal/ListEditionModal'
import DropdownFilterMenu from 'components/Menu/DropdownFilterMenu'

const MyNFTSection = props => {
  const { changeActiveTab, filter = 0 } = props
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const isGetMyNFTs = useSelector<any>(state => state.isGetMyNFTs)
  const myNftList = useSelector<any>(state => state.myNftList)
  const [allNftList, setAllNftList] = useState<NftData[]>([])
  const [listedEdition, setListedEdition] = useState(null)
  const [allList, setAllList] = useState<NftData[]>([])
  const [filteredList, setFilteredList] = useState<NftData[]>([])
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const { metaplex: mx } = useMetaplex()

  const loadMyNFTs = async () => {
    setLoading(true)
    let nfts = await getMyNFTs(mx)
    if (nfts.length === 0) {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      return
    }

    setAllList(nfts)
    let validNfts = nfts.filter(
      item =>
        !item.tokenAccount?.delegate &&
        !item.tokenAccount?.isFrozen &&
        item.creators?.length > 0 &&
        !item.collectionDetails
    )
    dispatch({ type: 'set', isGetMyNFTs: true })
    dispatch({ type: 'set', myNftList: validNfts })

    setLoading(false)
  }

  const getListedNft = async () => {
    const editions = await getEditionList(mx.identity().publicKey.toBase58())
    let lists = []
    editions.map(item => {
      lists.push(item.nft.token_id)
    })
    setListedEdition(lists)
  }

  useEffect(() => {
    if (parseInt(filter) === 1) {
      setSelectedItem({ id: 1, label: 'Editions', disabled: false })
      setActive(1)
    }
  }, [filter])

  useEffect(() => {
    if (mx && connection && publicKey) {
      if (!isGetMyNFTs) loadMyNFTs()
      getListedNft()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mx, connection, publicKey, isGetMyNFTs])

  const [nftList, setNFTList] = useState<NftData[]>([])
  const [filteredNfts, setFilteredNfts] = useState<NftData[]>([])

  const [showStartAuctionModal, setShowStartAuctionModal] = useState(false)
  const [showListEditionModal, setShowListEditionModal] = useState(false)
  const [showListNFTModal, setShowListNFTModal] = useState(false)
  const [openProgressingModal, setOpenProgressingModal] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [selectedData, setSelectedData] = useState()
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [rowCount, setRowCount] = useState(12)
  const [active, setActive] = useState(filter)
  const [filterList, setFilterList] = useState([
    { id: 0, label: '1 of 1', disabled: false },
    { id: 1, label: 'Editions', disabled: false },
  ])
  const [selectedItem, setSelectedItem] = useState({ id: 0, label: '1 of 1', disabled: false })

  const handleStartAuction = item => {
    setSelectedData(item)
    setShowStartAuctionModal(true)
  }

  const handleListEdition = item => {
    if (item.supply?.max === 0) {
      setAlertData([
        {
          id: 0,
          title: 'Invalid NFT',
          description: 'This nft should be Edition instead of Single NFT.',
          type: 'failure',
        },
      ])
      setShowAlert(true)
      return
    }
    setSelectedData(item)
    setShowListEditionModal(true)
  }

  const handleStartProgress = () => {
    setOpenProgressingModal(true)
  }

  const handleSuccessListEdition = nftName => {
    getListedNft()

    setAlertData([
      {
        id: 0,
        title: 'Edition Listed!',
        description: `You've successfully listed an edition for ${nftName}`,
        type: 'success',
      },
    ])

    changeActiveTab(2, 2)

    setTimeout(() => {
      setShowAlert(true)
    }, 500)
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

    changeActiveTab(2, 1)

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
    let allList = myNftList as NftData[]
    allList.forEach(item => {
      let created = false
      let creators = item.creators
      creators.forEach(creator => {
        if (publicKey && creator.address.toString() === publicKey.toString()) {
          created = true
          return
        }
      })
      if (active === 0) {
        if (created) list.push(item)
      } else {
        if (created) list.push(item)
      }
    })
    setFilteredList(list)
    setAllNftList(list)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myNftList, active])

  useEffect(() => {
    let new_list = filteredList as NftData[]
    if (new_list.length > rowCount) setIsVisibleFetching(true)
    setNFTList(new_list.slice(0, rowCount))
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  useEffect(() => {
    if (active === 0) {
      setFilteredNfts(filteredList.filter(n => n?.supply?.max === 0))
    } else if (active === 1) {
      if (listedEdition) {
        setFilteredNfts(
          filteredList.filter(
            n => (n?.supply?.max > 0 || n?.supply?.max === null) && !listedEdition.includes(n.mintAddress)
          )
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredList, listedEdition, active])

  const searchNFT = key => {
    if (key === '') {
      setFilteredList(allNftList)
    } else {
      let filtered = []
      setFilteredList([])
      allNftList.forEach(element => {
        if (element.name.toLowerCase().includes(key.toLowerCase())) filtered.push(element)
      })
      setFilteredList(filtered)
    }
  }

  return (
    <section className={styles.container}>
      {!loading && (
        <div className="w-full flex justify-between gap-[15px] items-center">
          <DashboardSearchBox placeholder="Search" onChange={key => searchNFT(key)} />
          <DropdownFilterMenu
            label={selectedItem['label']}
            data={filterList}
            selectedItem={selectedItem}
            setSelectedItem={item => {
              setSelectedItem(item)
              setActive(item.id)
            }}
          />
        </div>
      )}
      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] 2xl:gap-[60px] grid grid-cols-12 z-10">
        {!loading &&
          filteredNfts
            .filter(item => item.image !== undefined || null)
            .map(item => (
              <div className="col-span-12 md:col-span-6 lg:col-span-4 2xl:col-span-3 gap-[45px]" key={item.mintAddress}>
                <MyNFTCard
                  data={item}
                  onClickStartAuction={(item: NftData) => handleStartAuction(item)}
                  onClickListEdition={(item: NftData) => handleListEdition(item)}
                  onClickListNFT={(item: NftData) => handleListNFT(item)}
                  active={active}
                />
              </div>
            ))}
        <div className="col-span-12">
          <LoadingModal open={loading} />
        </div>
      </div>
      {filteredNfts.length === 0 && !loading && listedEdition && (
        <div className="mt-[30px] lg:mt-[20px]">
          <NoDataSection
            title="There were no NFTs detected in your wallet"
            description="This tab displays the NFTs you own without an active listing"
          />
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

      <ListEditionModal
        data={selectedData}
        open={showListEditionModal}
        listingType={'list'}
        onSuccess={nft => handleSuccessListEdition(nft)}
        onClose={() => setShowListEditionModal(false)}
      />

      <ListNFTModal
        data={selectedData}
        open={showListNFTModal}
        onClose={(status: string) => {
          setShowListNFTModal(false)
          if (status === 'listed') {
            loadMyNFTs()
            changeActiveTab(2, 0)
          } else if (status === 'list-close') {
            loadMyNFTs()
          }
        }}
      />
    </section>
  )
}

export default MyNFTSection
