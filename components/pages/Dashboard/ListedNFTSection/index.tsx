import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

import { useWallets } from 'hooks/useWallets'

// third party components
import { useSelector, useDispatch } from 'react-redux'

// components
import ListedNFTCard, { ListedNFTCardData } from 'components/Card/ListedNFTCard'
import UpdateNFTModal from 'components/Modal/UpdateNFTModal'
import LoadingModal from 'components/Modal/LoadingModal'

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
import ProgressingModal from 'components/Modal/ProgressingModal'
import { useAuthentication } from 'hooks/useAuthentication'
import TimeSlotButton from 'components/Button/TimeSlotButton'
import LoadingComponent from 'pages/explore/LoadingComponent'

const ListedNFTSection = props => {
  const { filter } = props

  const router = useRouter()
  const dispatch = useDispatch()
  const { refreshToken } = useAuthentication()

  const [showListNFTModal, setShowListNFTModal] = useState(false)
  const [openProgressingModal, setOpenProgressingModal] = useState(false)

  const [selectedData, setSelectedData] = useState()
  const handleSelectData = item => {
    setSelectedData(item)
    setShowListNFTModal(true)
  }

  const isGetListedNFTs = useSelector<any>(state => state.isGetListedNFTs)
  const fixedPriceNFTs: any = useSelector<any>(state => state.fixedPriceNFTs)
  const liveAuctionNFTs: any = useSelector<any>(state => state.liveAuctionNFTs)
  const [active, setActive] = useState(0)
  const [rowCount, setRowCount] = useState(12)

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
            price: Number(highest_bid?.amount ?? auction.reserve_price) * 1000000000,
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
    setOpenProgressingModal(true)
    try {
      await refreshToken()

      const result = await cancelList(mx, tradeStateAddress)
      if (result) {
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
            setOpenProgressingModal(false)
            setTimeout(() => {
              setShowListNFTModal(false)
              setTimeout(() => {
                setShowAlert(true)
                setTimeout(() => {
                  setMyListedNFTs()
                  dispatch({ type: 'set', isGetMyNFTs: false })
                }, 800)
              }, 800)
            }, 800)
          }
        }),
          error => {
            console.log(error)
            setOpenProgressingModal(false)
          }
      }
    } catch (e) {
      setOpenProgressingModal(false)
    }
  }

  const onUpdatePrice = async ({ address, tradeStateAddress }: ListedNFTCardData, price: number) => {
    setOpenProgressingModal(true)
    try {
      await refreshToken()

      const result = await updateList(mx, address, tradeStateAddress, price)
      if (result) {
        listingsAPI.updateNft(address.toBase58(), { amount: (price / 1000000000).toString() }).then(
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
              setOpenProgressingModal(false)
              setTimeout(() => {
                setShowListNFTModal(false)
                setTimeout(() => {
                  setShowAlert(true)
                  setTimeout(() => {
                    setMyListedNFTs()
                  }, 500)
                }, 500)
              }, 500)
            }
          },
          error => {
            console.log(error)
            setOpenProgressingModal(false)
          }
        )
      }
    } catch (e) {
      setOpenProgressingModal(false)
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
    setOpenProgressingModal(true)
    try {
      await refreshToken()

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
          setOpenProgressingModal(false)
          setTimeout(() => {
            setShowAlert(true)
            setTimeout(() => {
              setMyListedNFTs()
              dispatch({ type: 'set', isGetMyNFTs: false })
            }, 500)
          }, 500)
        }
      })
    } catch (e) {
      setOpenProgressingModal(false)
    }
  }

  const finalizeSale = async ({ address, sellerAddress, price, highestBid }: ListedNFTCardData) => {
    setTimeout(() => {
      setOpenProgressingModal(true)
    }, 500)

    try {
      await refreshToken()

      const { sale } = await executeSale(mx, address, sellerAddress, new PublicKey(highestBid?.buyer_address), price)
      await updateSolBalance()
      auctionAPI
        .executeSale(sale.mintAddress.toBase58(), {
          token_address: sale.mintAddress.toBase58(),
          buyer_wallet_id: sale.buyerAddress.toBase58(),
          sale_price: sale.price.toString(),
        })
        .then(res => {
          setAlertData([
            {
              id: 0,
              title: 'Auction Finalized!',
              description: `You've successfully finalized your auction!`,
              type: 'success',
            },
          ])
          setOpenProgressingModal(false)
          setTimeout(() => {
            setShowAlert(true)
            setTimeout(() => {
              setMyListedNFTs()
              dispatch({ type: 'set', isGetMyNFTs: false })
            }, 800)
          }, 800)
        })
    } catch (e) {
      setOpenProgressingModal(false)
    }
  }

  const handleGotoDetailPage = url => {
    router.push(url)
  }

  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)

  useEffect(() => {
    if (active === 0) {
      let new_list = fixedPriceNFTs as any[]
      if (new_list.length > rowCount) setIsVisibleFetching(true)
      setNFTList(new_list.slice(0, rowCount))
    } else {
      let new_list = liveAuctionNFTs as any[]
      if (new_list.length > rowCount) setIsVisibleFetching(true)
      setNFTList(new_list.slice(0, rowCount))
    }
  }, [fixedPriceNFTs, liveAuctionNFTs, active])

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false)
      if (active === 0) {
        if (nftList.length + rowCount > fixedPriceNFTs.length) {
          setNFTList([...nftList, ...fixedPriceNFTs.slice(nftList.length, fixedPriceNFTs.length)])
          setIsVisibleFetching(false)
        } else {
          setNFTList([...nftList, ...fixedPriceNFTs.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      } else {
        if (nftList.length + rowCount > liveAuctionNFTs.length) {
          setNFTList([...nftList, ...liveAuctionNFTs.slice(nftList.length, liveAuctionNFTs.length)])
          setIsVisibleFetching(false)
        } else {
          setNFTList([...nftList, ...liveAuctionNFTs.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      }
    }
  }, [isFetching])

  return (
    <section className={styles.container}>
      <div className="w-full lg:w-[300px] flex h-[54px] mt-[15px] z-10">
        <div className={styles.slotBG}>
          <TimeSlotButton
            label="Fixed-Price"
            onClick={() => handleChangeActive(0)}
            fontFamily={'Muli-SemiBold'}
            color={active === 0 ? '#1A1A1A' : '#979EA2'}
            backgroundColor01={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
            backgroundColor02={active === 0 ? 'var(--toggle-bg-color)' : 'transparent'}
            gradientDirection="bottom"
            width={160}
            boxShadow={active === 0 ? '0px 0px 10px rgba(32, 36, 39, 0.15)' : ''}
          />
          <TimeSlotButton
            label="Live&nbsp;Auction"
            onClick={() => handleChangeActive(1)}
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
      {!loading && isVisibleFetching && (
        <div className="w-full mt-[-100px] mb-[40px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
        </div>
      )}

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
      <ProgressingModal open={openProgressingModal} />
    </section>
  )
}

export default ListedNFTSection
