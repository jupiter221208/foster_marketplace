import React, { useState, useEffect } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'
import { useDispatch, useSelector } from 'react-redux'
import { useMetaplex } from 'hooks/useMetaplex'

// components
import LoadingModal from 'components/Modal/LoadingModal'
// json

// styles
import styles from './index.module.scss'

// api
import NoDataSection from '../NoDataSection'
import { getMyNFTs } from 'utils/nfts.utils'
import { NftData } from 'types/nft'
import MyNFTCard from 'components/Card/MyNFTCard'

import ListNFTModal from 'components/Modal/ListNFTModal'
import Alert from 'components/Alert'
import ProgressingModal from 'components/Modal/ProgressingModal'
import StartAuctionModal from 'components/Modal/StartAuctionModal'

const CollectedSection = props => {
  const { changeActiveTab } = props

  const myNftList = useSelector<any>(state => state.myNftList)
  const { publicKey } = useWallet()
  const { metaplex: mx } = useMetaplex()
  const dispatch = useDispatch()

  const [nftList, setNFTList] = useState<NftData[]>([])
  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedData, setSelectedData] = useState()
  const [showStartAuctionModal, setShowStartAuctionModal] = useState(false)
  const [showListNFTModal, setShowListNFTModal] = useState(false)
  const [openProgressingModal, setOpenProgressingModal] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState<boolean>(false)

  const loadMyNFTs = async () => {
    setLoading(true)
    let nfts = await getMyNFTs(mx)
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

  useEffect(() => {
    setLoading(true)

    let list = []
    let allList = myNftList as any[]
    allList.forEach(item => {
      let created = false
      let creators = item.creators
      creators.forEach(creator => {
        if (publicKey && creator.address.toString() === publicKey.toString()) {
          created = true
          return
        }
      })

      if (!created) list.push(item)
    })

    setNFTList(list)
    setLoading(false)
  }, [myNftList])

  const handleStartProgress = () => {
    setOpenProgressingModal(true)
  }

  const handleStartAuction = item => {
    setSelectedData(item)
    setShowStartAuctionModal(true)
  }

  const handleListNFT = item => {
    setSelectedData(item)
    setShowListNFTModal(true)
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

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[0px] gap-4 lg:gap-[34px] grid grid-cols-12">
        {!loading &&
          nftList
            .filter(item => item.image !== undefined || null)
            .map((item, index) => (
              <div className="col-span-6 md:col-span-6 lg:col-span-3 gap-[34px]" key={index}>
                <MyNFTCard
                  data={item}
                  onClickStartAuction={(item: NftData) => handleStartAuction(item)}
                  onClickListEdition={(item: NftData) => {}}
                  onClickListNFT={(item: NftData) => handleListNFT(item)}
                  active={0}
                />
              </div>
            ))}
        <div className="col-span-12">
          <LoadingModal open={loading} />
        </div>
      </div>
      {isLoaded && nftList.length === 0 && (
        <div className="mt-[35px] lg:mt-[65px]">
          <NoDataSection
            title="No collectibles detected"
            description="This tab displays the items you collected that are part of a collection"
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

      <ListNFTModal
        data={selectedData}
        open={showListNFTModal}
        onClose={(status: string) => {
          setShowListNFTModal(false)
          if (status === 'listed') {
            loadMyNFTs()
            changeActiveTab(2)
          } else if (status === 'list-close') {
            loadMyNFTs()
          }
        }}
      />
    </section>
  )
}

export default CollectedSection
