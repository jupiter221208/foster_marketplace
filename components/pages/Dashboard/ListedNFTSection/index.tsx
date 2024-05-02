import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

import { useWallets } from 'hooks/useWallets'

// third party components
import { useSelector, useDispatch } from 'react-redux'

// components
import ListedNFTCard from 'components/Card/ListedNFTCard'
import UpdateNFTModal from 'components/Modal/UpdateNFTModal'
import LoadingModal from 'components/Modal/LoadingModal'

// styles
import styles from './index.module.scss'

// solana
import { getMyListedNFTs, cancelList, updateList } from 'utils/auction.util'
import { cancelListing, executeSale } from 'utils/auctioneer.util'
import { useMetaplex } from 'hooks/useMetaplex'
import { getNFTArtistPublicKey } from 'utils/nfts.utils'
import { PublicKey, Keypair } from '@solana/web3.js'

// call apis
import listingsAPI from 'apis/listings'
import auctionAPI from 'apis/auctions'
import { cancelListingEdition, getEditionList } from 'apis/editions'
import Alert from 'components/Alert'
import NoDataSection from '../NoDataSection'
import ProgressingModal from 'components/Modal/ProgressingModal'
import { useAuthentication } from 'hooks/useAuthentication'
import LoadingComponent from 'pages/explore/LoadingComponent'
import { ListingsAPIData, NftData } from 'types/nft'
import DropdownFilterMenu from 'components/Menu/DropdownFilterMenu'
import ListedEditionCard from 'components/Card/ListedEditionCard'
import DashboardSearchBox from 'components/Input/DashboardSearchBox'
import ListEditionModal from 'components/Modal/ListEditionModal'

type SelectedDataType = {
  category: string
  name: string
  animation_url: string
  image: string
  address: string
  tradeStateAddress: string
}

const ListedNFTSection = props => {
  const { filter } = props

  const router = useRouter()
  const dispatch = useDispatch()
  const { refreshToken } = useAuthentication()

  const [showListNFTModal, setShowListNFTModal] = useState(false)
  const [openProgressingModal, setOpenProgressingModal] = useState(false)
  const [filteredList, setFilteredList] = useState<any>([])
  const [showListEditionModal, setShowListEditionModal] = useState(false)
  const [selectedData, setSelectedData] = useState<SelectedDataType>()
  const [editionData, setEditionData] = useState<any>()

  const handleSelectData = item => {
    setSelectedData({
      category: item?.json.properties.category,
      name: item?.name,
      animation_url: item?.json.animation_url,
      image: item?.json.image,
      address: item.address.toString(),
      tradeStateAddress: item.tradeStateAddress.toString(),
    })
    setShowListNFTModal(true)
  }

  const handleEditionData = item => {
    setEditionData({
      category: item?.type ?? 'image',
      name: item?.name,
      animation_url: item?.assetUrl,
      image: item?.coverUrl,
      mintAddress: item?.address,
    })
    setShowListEditionModal(true)
  }

  const isGetListedNFTs = useSelector<any>(state => state.isGetListedNFTs)
  const fixedPriceNFTs: any = useSelector<any>(state => state.fixedPriceNFTs)
  const liveAuctionNFTs: any = useSelector<any>(state => state.liveAuctionNFTs)
  const [liveEditions, setLiveEditions] = useState([])
  const [active, setActive] = useState(0)
  const [rowCount, setRowCount] = useState(12)
  const [filterList, setFilterList] = useState([
    { id: 0, label: 'Buy Now' },
    { id: 1, label: 'Auction' },
    { id: 2, label: 'Live Editions', disabled: false },
  ])
  const [selectedItem, setSelectedItem] = useState({ id: 0, label: 'Buy Now' })

  useEffect(() => {
    if (filter !== undefined) {
      setActive(Number(filter))
    } else {
      setActive(0)
    }
  }, [filter])

  const [loading, setLoading] = useState(false)

  const { metaplex: mx } = useMetaplex()

  const { updateSolBalance } = useWallets()

  const [nftList, setNFTList] = useState<any>([])

  function getMintAddress(asset): PublicKey {
    if ('mintAddress' in asset) return asset.mintAddress
    else return asset.mint.address
  }

  const setMyListedNFTs = async () => {
    setLoading(true)
    const listedNfts = await getMyListedNFTs(mx)
    if (listedNfts) {
      let fixedPriceNFTs = listedNfts.map(({ asset, sellerAddress, tradeStateAddress, price }) => ({
        address: getMintAddress(asset),
        name: asset?.name,
        uri: asset?.uri,
        sellerAddress,
        tradeStateAddress,
        price: Number(price.basisPoints.toString()),
        creatorAddress: getNFTArtistPublicKey(asset)?.toString(),
      }))
      dispatch({ type: 'set', fixedPriceNFTs })
    }
    const listings = await auctionAPI.getListingsBySeller(mx.identity().publicKey.toBase58())
    const nfts = await mx
      .nfts()
      .findAllByMintList({ mints: listings.map(({ auction }) => new PublicKey(auction.mint_address)) })
    const liveAuction: ListingsAPIData[] = listings
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

  const getLiveEditions = async () => {
    const editions = await getEditionList(mx.identity().publicKey.toBase58())
    let lists = []
    editions.map(item => {
      lists.push({
        authority: item.listedMasterEdition.authority_keypair,
        address: item.nft.token_id,
        price: Number(item.listedMasterEdition.price),
        type: item.nft.asset_type,
        assetUrl: item.nft.asset_url,
        coverUrl: item.nft.cover_image_url,
        name: item.nft.nft_name,
        creatorAddress: item.nft.owner_id,
      })
    })
    setLiveEditions(lists)
  }

  useEffect(() => {
    if (mx) {
      if (!isGetListedNFTs) setMyListedNFTs()
      getLiveEditions()
    }
  }, [mx, isGetListedNFTs])

  const onCancelList = async ({ address, tradeStateAddress }: ListingsAPIData) => {
    setOpenProgressingModal(true)
    try {
      await refreshToken()

      const result = await cancelList(mx, new PublicKey(tradeStateAddress))
      if (result) {
        listingsAPI.unlistNft(address).then(response => {
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

  const handleSuccessListEdition = nftName => {
    getLiveEditions()
    setActive(2)
    setAlertData([
      {
        id: 0,
        title: 'Edition Listed!',
        description: `You've successfully listed an edition for ${nftName}`,
        type: 'success',
      },
    ])

    setTimeout(() => {
      setShowAlert(true)
    }, 500)
  }

  const handleSuccessCancelEdition = item => {
    getLiveEditions()
    setActive(2)
    setAlertData([
      {
        id: 0,
        title: 'Edition Listing Canceled!',
        description: `${item.name} is no longer available for purchase`,
        type: 'success',
      },
    ])

    setTimeout(() => {
      setShowAlert(true)
    }, 500)
  }

  const onUpdatePrice = async ({ address, tradeStateAddress }: ListingsAPIData, price: number) => {
    setOpenProgressingModal(true)
    try {
      await refreshToken()

      const result = await updateList(mx, new PublicKey(address), new PublicKey(tradeStateAddress), price)
      if (result) {
        listingsAPI.updateNft(address, { amount: (price / 1000000000).toString() }).then(
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

  const cancelAuction = async ({ address, sellerAddress, name }) => {
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

  const finalizeSale = async ({ address, sellerAddress, price, highestBid }) => {
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
    setNFTList([])
    setTimeout(() => {
      if (active === 0) {
        let new_list = fixedPriceNFTs as any[]
        if (new_list.length > rowCount) setIsVisibleFetching(true)
        setNFTList(new_list.slice(0, rowCount))
        setFilteredList(new_list.slice(0, rowCount))
        setSelectedItem(filterList[0])
      } else if (active === 1) {
        let new_list = liveAuctionNFTs as any[]
        if (new_list.length > rowCount) setIsVisibleFetching(true)
        setNFTList(new_list.slice(0, rowCount))
        setFilteredList(new_list.slice(0, rowCount))
        setSelectedItem(filterList[1])
      } else {
        // active === 2
        let new_list = liveEditions as any[]
        if (new_list.length > rowCount) setIsVisibleFetching(true)
        setNFTList(new_list.slice(0, rowCount))
        setFilteredList(new_list.slice(0, rowCount))
        setSelectedItem(filterList[2])
      }
    }, 500)
  }, [fixedPriceNFTs, liveAuctionNFTs, liveEditions, active])

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false)
      if (active === 0) {
        if (nftList.length + rowCount > fixedPriceNFTs.length) {
          setNFTList([...nftList, ...fixedPriceNFTs.slice(nftList.length, fixedPriceNFTs.length)])
          setFilteredList([...nftList, ...fixedPriceNFTs.slice(nftList.length, fixedPriceNFTs.length)])
          setIsVisibleFetching(false)
        } else {
          setNFTList([...nftList, ...fixedPriceNFTs.slice(nftList.length, nftList.length + rowCount)])
          setFilteredList([...nftList, ...fixedPriceNFTs.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      } else if (active === 1) {
        if (nftList.length + rowCount > liveAuctionNFTs.length) {
          setNFTList([...nftList, ...liveAuctionNFTs.slice(nftList.length, liveAuctionNFTs.length)])
          setFilteredList([...nftList, ...liveAuctionNFTs.slice(nftList.length, liveAuctionNFTs.length)])
          setIsVisibleFetching(false)
        } else {
          setNFTList([...nftList, ...liveAuctionNFTs.slice(nftList.length, nftList.length + rowCount)])
          setFilteredList([...nftList, ...liveAuctionNFTs.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      } else {
        if (nftList.length + rowCount > liveEditions.length) {
          setNFTList([...nftList, ...liveEditions.slice(nftList.length, liveEditions.length)])
          setFilteredList([...nftList, ...liveEditions.slice(nftList.length, liveEditions.length)])
          setIsVisibleFetching(false)
        } else {
          setNFTList([...nftList, ...liveEditions.slice(nftList.length, nftList.length + rowCount)])
          setFilteredList([...nftList, ...liveEditions.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      }
    }
  }, [isFetching])

  const searchNFT = key => {
    if (key === '') {
      setFilteredList(nftList)
    } else {
      let filtered = []
      setFilteredList([])
      nftList.forEach(element => {
        if (element.name.toLowerCase().includes(key.toLowerCase())) filtered.push(element)
      })
      setFilteredList(filtered)
    }
  }

  return (
    <section className={styles.container}>
      <div className="w-full flex justify-between z-10">
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

      <div className="w-full mt-[15px] lg:mt-[34px] gap-4 lg:gap-[34px] 2xl:gap-[60px] grid grid-cols-12 z-10">
        {!loading &&
          filteredList.map(item => (
            <div className="col-span-12 lg:col-span-4 2xl:col-span-3 gap-[34px]" key={item.address}>
              {active === 0 || active === 1 ? (
                <ListedNFTCard
                  data={item}
                  type={active === 0 ? 'fixed' : active === 1 ? 'auction' : 'edition'}
                  onClick={url => handleGotoDetailPage(url)}
                  onActionClick={item => handleSelectData(item)}
                  cancelAuction={cancelAuction}
                  finalizeSale={finalizeSale}
                />
              ) : (
                <ListedEditionCard
                  data={item}
                  onClick={url => handleGotoDetailPage(url)}
                  onUpdateList={() => handleEditionData(item)}
                  onCancelSuccess={() => handleSuccessCancelEdition(item)}
                />
              )}
            </div>
          ))}
        <div className="col-span-12">
          <LoadingModal open={loading} />
        </div>
      </div>
      {isGetListedNFTs &&
        ((active === 0 && fixedPriceNFTs.length === 0) ||
          (active === 1 && liveAuctionNFTs.length === 0) ||
          (active === 2 && liveEditions.length === 0)) && (
          <div className="mt-[10px] ml-[-2px] mr-[-2px] lg:mt-[20px]">
            <NoDataSection
              title={
                active === 0
                  ? "You don't have any active fixed-price listings"
                  : active === 1
                  ? "You don't have any active live auctions"
                  : "You don't have any active live editions"
              }
              description={
                active === 0
                  ? 'This tab displays your NFTs with an active fixed-price listing'
                  : active === 1
                  ? 'This tab displays your NFTs that are in a live auction'
                  : 'This tab displays your NFTs that are in a live editions'
              }
            />
          </div>
        )}
      {!loading && isVisibleFetching && (
        <div className="w-full mt-[-100px] mb-[40px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
        </div>
      )}

      <ListEditionModal
        data={editionData}
        open={showListEditionModal}
        listingType={'update'}
        onSuccess={nft => handleSuccessListEdition(nft)}
        onClose={() => setShowListEditionModal(false)}
      />

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
