import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

import { useWallets } from 'hooks/useWallets'

// third party components
import { useSelector, useDispatch } from 'react-redux'

// components
import Pagination from 'components/Button/Pagination'
import ListedNFTCard from 'components/Card/ListedNFTCard'
import UpdateNFTModal from 'components/Modal/UpdateNFTModal'
import LoadingModal from 'components/Modal/LoadingModal'
import FilterButton from 'components/Button/FilterButton'

// styles
import styles from './index.module.scss'

// solana
import { getMyListedNFTs, cancelList, updateList } from 'utils/auction.util'
import { cancelListing, executeSale } from 'utils/auctioneer.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { getNFTByAddress } from 'utils/nfts.utils'
import { PublicKey } from '@solana/web3.js'

// call apis
import listingsAPI from 'apis/listings'
import auctionAPI from 'apis/auctions'
import Alert from 'components/Alert'
import NoDataSection from '../NoDataSection'

const ListedNFTSection = props => {
  const { filter } = props

  const router = useRouter()
  const dispatch = useDispatch()

  const [showListNFTModal, setShowListNFTModal] = useState(false)

  const [selectedData, setSelectedData] = useState()
  const handleSelectData = item => {
    setSelectedData(item)
    setShowListNFTModal(true)
  }

  const isGetListedNFTs = useSelector<any>(state => state.isGetListedNFTs)
  const fixedPriceNFTs = useSelector<any>(state => state.fixedPriceNFTs)
  const liveAuctionNFTs = useSelector<any>(state => state.liveAuctionNFTs)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (filter !== undefined) {
      setActive(Number(filter))
    } else {
      setActive(0)
    }
  }, [filter])

  const handleChangeActive = value => {
    setActive(value)
  }

  const [loading, setLoading] = useState(false)

  const { metaplex: mx } = useMetaplex()

  const { updateSolBalance } = useWallets()

  const [nftList, setNFTList] = useState([])

  const setMyListedNFTs = async () => {
    setLoading(true)
    const listedNfts = await getMyListedNFTs(mx)
    let fixedPrice = []
    if (listedNfts) {
      fixedPrice = listedNfts.map(nft => {
        let category = ''
        if (nft.asset.json.hasOwnProperty('properties')) {
          category = nft.asset.json.properties.category
        } else {
          category = nft.asset.json.category
        }
        return {
          mintAddress: nft.asset.address,
          image: nft.asset.json.image,
          name: nft.asset.json.name,
          category: category,
          animation_url: nft.asset.json.animation_url,
          creator: nft.asset.creators[0].address.toString(),
          url: `/browse-nft?id=${nft.asset.address.toString()}`,
          price: nft.price.basisPoints,
          tradeStateAddress: nft.tradeStateAddress,
        }
      })
      dispatch({ type: 'set', fixedPriceNFTs: fixedPrice })
    }
    const listings = await auctionAPI.getListingsBySeller(mx.identity().publicKey.toBase58())
    const liveAuction = await Promise.all(
      listings.map(async listing => {
        const nft = await getNFTByAddress(mx, new PublicKey(listing.auction.mint_address))
        return {
          mintAddress: nft.address,
          image: nft.json.image,
          name: nft.json.name,
          creator: nft.creators[0].address.toString(),
          url: `/live-auction?id=${nft.address.toString()}`,
          startTime: listing.auction.start_time,
          endTime: listing.auction.end_time,
          highestBid: listing.highest_bid,
          sellerAddress: new PublicKey(listing.auction.seller_address),
          price: Number(listing.auction.reserve_price) * 1000000000,
        }
      })
    )
    dispatch({ type: 'set', isGetListedNFTs: true })
    dispatch({ type: 'set', liveAuctionNFTs: liveAuction })
    setLoading(false)
  }

  useEffect(() => {
    if (mx && !isGetListedNFTs) setMyListedNFTs()
  }, [mx, isGetListedNFTs])

  const onCancelList = async (mintAddress, tradeStateAddress) => {
    const result = await cancelList(mx, tradeStateAddress)
    if (result) {
      setShowListNFTModal(false)
      listingsAPI.unlistNft(mintAddress).then(response => console.log(response)),
        error => {
          console.log(error)
        }
      setMyListedNFTs()
      dispatch({ type: 'set', isGetMyNFTs: false })
    }
  }

  const onUpdatePrice = async (nftAddress, tradeStateAddress, price) => {
    const result = await updateList(mx, nftAddress, tradeStateAddress, price)
    if (result) {
      setShowListNFTModal(false)
      listingsAPI.updateNft(nftAddress, { amount: price }).then(
        response => console.log(response),
        error => {
          console.log(error)
        }
      )
      setMyListedNFTs()
    }
  }

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([
    {
      id: 0,
      title: 'Aunction Canceled!',
      description: `You've successfully canceled the auction for The Glass Banana #6921`,
      type: 'success',
    },
  ])

  const cancelAuction = async (mintAddress, sellerAddress, nftName) => {
    const { auction } = await cancelListing(mx, mintAddress, sellerAddress)
    auctionAPI.cancelAuction(auction.mintAddress.toBase58()).then(res => {
      if (res) {
        setAlertData([
          {
            id: 0,
            title: 'Aunction Canceled!',
            description: `You've successfully canceled the auction for ${nftName}`,
            type: 'success',
          },
        ])
        setShowAlert(true)
        setMyListedNFTs()
        dispatch({ type: 'set', isGetMyNFTs: false })
      }
    })
  }

  const finalizeSale = async (mintAddress, sellerAddress, buyerAddress, price) => {
    const { sale } = await executeSale(mx, mintAddress, sellerAddress, buyerAddress, price)
    await updateSolBalance()
    auctionAPI
      .executeSale(sale.mintAddress.toBase58(), {
        token_address: sale.mintAddress.toBase58(),
        buyer_wallet_id: sale.buyerAddress.toBase58(),
        sale_price: sale.price.toString(),
      })
      .then(res => {
        setMyListedNFTs()
      })
  }

  const handleGotoDetailPage = url => {
    router.push(url)
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
        {!loading &&
          nftList.map((item, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <ListedNFTCard
                data={item}
                type={active === 0 ? 'fixed' : 'auction'}
                onClick={url => handleGotoDetailPage(url)}
                onActionClick={item => handleSelectData(item)}
                cancelAuction={(mintAddress, sellerAddress, nftName) =>
                  cancelAuction(mintAddress, sellerAddress, nftName)
                }
                finalizeSale={(mintAddress, sellerAddress, buyerAddress, price) =>
                  finalizeSale(mintAddress, sellerAddress, buyerAddress, price)
                }
              />
            </div>
          ))}
        <div className="col-span-12">
          <LoadingModal open={loading} />
        </div>
      </div>
      {isGetListedNFTs && nftList.length === 0 && (
        <div className="mt-[10px] ml-[-2px] mr-[-2px] lg:mt-[30px]">
          <NoDataSection
            title="You don't have any active fixed-price listings"
            description="This tab displays your NFTs with an active fixed-price listing"
          />
        </div>
      )}
      {nftList.length > 0 && (
        <div className="w-full flex justify-end">
          <Pagination
            data={active === 0 ? fixedPriceNFTs : liveAuctionNFTs}
            getCurrentData={data => setNFTList(data)}
          />
        </div>
      )}
      <UpdateNFTModal
        data={selectedData}
        open={showListNFTModal}
        onClose={() => setShowListNFTModal(false)}
        onCancelList={(mintAddress, tradeStateAddress) => onCancelList(mintAddress, tradeStateAddress)}
        onUpdatePrice={(nftAddress, tradeStateAddress, price) => onUpdatePrice(nftAddress, tradeStateAddress, price)}
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

export default ListedNFTSection
