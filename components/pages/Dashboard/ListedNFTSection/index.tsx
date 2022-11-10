import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// redux
import { useDispatch, useSelector } from 'react-redux'

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
import { useWallets } from 'hooks/useWallets'

const ListedNFTSection = () => {
  const router = useRouter()

  const [myNFTftList, setMyNFTList] = useState<any[]>([])

  const [showListNFTModal, setShowListNFTModal] = useState(false)

  const [selectedData, setSelectedData] = useState()
  const handleSelectData = item => {
    setSelectedData(item)
    setShowListNFTModal(true)
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

  const { updateSolBalance } = useWallets()

  const [nftList, setNFTList] = useState([])

  const setMyListedNFTs = async () => {
    dispatch({ type: 'set', isLoading: true })
    const listedNfts = await getMyListedNFTs(mx)
    let fixedPrice = []
    if (listedNfts) {
      fixedPrice = listedNfts.map(nft => {
        return {
          mintAddress: nft.asset.address,
          image: nft.asset.json.image,
          name: nft.asset.json.name,
          creator: nft.asset.creators[0].address.toString(),
          url: `/browse-nft?id=${nft.asset.address.toString()}`,
          price: nft.price.basisPoints,
          tradeStateAddress: nft.tradeStateAddress,
        }
      })
      setFixedPriceNFTs(fixedPrice)
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

  const cancelAuction = async (mintAddress, sellerAddress) => {
    const { auction } = await cancelListing(mx, mintAddress, sellerAddress)
    auctionAPI.cancelAuction(auction.mintAddress.toBase58()).then(res => {
      if (res) setMyListedNFTs()
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
        {!isLoading &&
          nftList.map((item, index) => (
            <div className="col-span-6 lg:col-span-3 gap-[34px]" key={index}>
              <ListedNFTCard
                data={item}
                type={active === 0 ? 'fixed' : 'auction'}
                onClick={url => handleGotoDetailPage(url)}
                onActionClick={item => handleSelectData(item)}
                cancelAuction={(mintAddress, sellerAddress) => cancelAuction(mintAddress, sellerAddress)}
                finalizeSale={(mintAddress, sellerAddress, buyerAddress, price) =>
                  finalizeSale(mintAddress, sellerAddress, buyerAddress, price)
                }
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
