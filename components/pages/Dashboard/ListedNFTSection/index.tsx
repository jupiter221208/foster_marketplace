import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

import { useWallets } from 'hooks/useWallets'

// third party components
import { useSelector, useDispatch } from 'react-redux'

// components
import Pagination from 'components/Button/Pagination'
import ListedNFTCard, { type ListedNFTCardData } from 'components/Card/ListedNFTCard'
import UpdateNFTModal from 'components/Modal/UpdateNFTModal'
import LoadingModal from 'components/Modal/LoadingModal'
import FilterButton from 'components/Button/FilterButton'

// styles
import styles from './index.module.scss'

// solana
import { getMyListedNFTs, cancelList, updateList } from 'utils/auction.util'
import { cancelListing, executeSale } from 'utils/auctioneer.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { getNFTArtistPublicKey } from 'utils/nfts.utils'
import { PublicKey } from '@solana/web3.js'
import type { Nft, Sft, Metadata } from '@metaplex-foundation/js'

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
  const fixedPriceNFTs: any = useSelector<any>(state => state.fixedPriceNFTs)
  const liveAuctionNFTs: any = useSelector<any>(state => state.liveAuctionNFTs)
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

  function getMintAddress(asset: Nft | Sft | Metadata): PublicKey {
    if ('mintAddress' in asset) return asset.mintAddress
    else return asset.mint.address
  }

  const setMyListedNFTs = async () => {
    setLoading(true)
    const listedNfts = await getMyListedNFTs(mx)
    if (listedNfts) {
      let fixedPriceNFTs: ListedNFTCardData[] = listedNfts.map(
        ({ asset, sellerAddress, tradeStateAddress, price }) => ({
          address: getMintAddress(asset),
          name: asset?.name,
          uri: asset?.uri,
          sellerAddress,
          tradeStateAddress,
          price: Number(price.basisPoints.toString()),
          creatorAddress: getNFTArtistPublicKey(asset)?.toString(),
        })
      )
      dispatch({ type: 'set', fixedPriceNFTs })
    }

    const listings = await auctionAPI.getListingsBySeller(mx.identity().publicKey.toBase58())
    const nfts = await mx
      .nfts()
      .findAllByMintList({ mints: listings.map(({ auction }) => new PublicKey(auction.mint_address)) })
    const liveAuction: ListedNFTCardData[] = listings
      .map(
        ({ auction, highest_bid }, index) =>
          nfts[index] && {
            address: getMintAddress(nfts[index]),
            name: nfts[index].name,
            uri: nfts[index].uri,
            sellerAddress: new PublicKey(auction.seller_address),
            tradeStateAddress: new PublicKey(auction.free_trade_state),
            price: Number(auction.reserve_price) * 1000000000,
            creatorAddress: getNFTArtistPublicKey(nfts[index])?.toString(),
            startTime: auction.start_time,
            endTime: auction.end_time,
            highestBid: highest_bid,
          }
      )
      .filter(listing => listing != null)
    dispatch({ type: 'set', isGetListedNFTs: true })
    dispatch({ type: 'set', liveAuctionNFTs: liveAuction })
    setLoading(false)
  }

  useEffect(() => {
    if (mx && !isGetListedNFTs) setMyListedNFTs()
  }, [mx, isGetListedNFTs])

  const onCancelList = async ({ address, tradeStateAddress }: ListedNFTCardData) => {
    const result = await cancelList(mx, tradeStateAddress)
    if (result) {
      setShowListNFTModal(false)
      listingsAPI.unlistNft(address.toBase58()).then(response => {
        if (response) {
          setAlertData([
            {
              id: 0,
              title: 'Listing Removed!',
              description: `You've successfully removed your fixed-price listing!`,
              type: 'success',
            },
          ])
          setShowAlert(true)
          setMyListedNFTs()
          dispatch({ type: 'set', isGetMyNFTs: false })
        }
      }),
        error => {
          console.log(error)
        }
    }
  }

  const onUpdatePrice = async ({ address, tradeStateAddress, price }: ListedNFTCardData) => {
    const result = await updateList(mx, address, tradeStateAddress, price)
    if (result) {
      setShowListNFTModal(false)
      listingsAPI.updateNft(address.toBase58(), { amount: price }).then(
        response => {
          if (response) {
            setAlertData([
              {
                id: 0,
                title: 'Listing Updated!',
                description: `You've successfully updated your fixed-price listing!`,
                type: 'success',
              },
            ])
            setShowAlert(true)
            setMyListedNFTs()
          }
        },
        error => {
          console.log(error)
        }
      )
    }
  }

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([
    {
      id: 0,
      title: 'Auction Canceled!',
      description: `You've successfully canceled the auction for The Glass Banana #6921`,
      type: 'success',
    },
  ])

  const cancelAuction = async ({ address, sellerAddress, name }: ListedNFTCardData) => {
    const { auction } = await cancelListing(mx, address, sellerAddress)
    auctionAPI.cancelAuction(auction.mintAddress.toBase58()).then(res => {
      if (res) {
        setAlertData([
          {
            id: 0,
            title: 'Auction Canceled!',
            description: `You've successfully canceled the auction for ${name}`,
            type: 'success',
          },
        ])
        setShowAlert(true)
        setMyListedNFTs()
        dispatch({ type: 'set', isGetMyNFTs: false })
      }
    })
  }

  const finalizeSale = async ({ address, sellerAddress, price, highestBid }: ListedNFTCardData) => {
    const { sale } = await executeSale(mx, address, sellerAddress, new PublicKey(highestBid?.buyer_address), price)
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
                cancelAuction={cancelAuction}
                finalizeSale={finalizeSale}
              />
            </div>
          ))}
        <div className="col-span-12">
          <LoadingModal open={loading} />
        </div>
      </div>
      {isGetListedNFTs &&
        ((active === 0 && fixedPriceNFTs.length === 0) || (active === 1 && liveAuctionNFTs.length === 0)) && (
          <div className="mt-[10px] ml-[-2px] mr-[-2px] lg:mt-[30px]">
            <NoDataSection
              title={
                active === 0
                  ? "You don't have any active fixed-price listings"
                  : "You don't have any active live auctions"
              }
              description={
                active === 0
                  ? 'This tab displays your NFTs with an active fixed-price listing'
                  : 'This tab displays your NFTs that are in a live auction'
              }
            />
          </div>
        )}
      <div className="w-full flex justify-end">
        <Pagination data={active === 0 ? fixedPriceNFTs : liveAuctionNFTs} getCurrentData={data => setNFTList(data)} />
      </div>

      <UpdateNFTModal
        data={selectedData}
        open={showListNFTModal}
        onClose={() => setShowListNFTModal(false)}
        onCancelList={onCancelList}
        onUpdatePrice={onUpdatePrice}
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
