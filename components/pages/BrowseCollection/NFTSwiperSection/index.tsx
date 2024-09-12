import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components

// custom functions
import DefaultNftBG from 'assets/images/default-nft-bg.png'

// styles
import styles from './index.module.scss'
import LoadingComponent from 'pages/explore/LoadingComponent'
import TimeSlotButton from 'components/Button/TimeSlotButton'
import { NftData } from 'types/nft'
import HomeNftCard from 'components/Card/HomeNFTCard'
import HomeEditionCard from 'components/Card/HomeEditionCard'
import LiveAuctionCard from 'components/Card/LiveAuctionCard'
import { getTimeDifference } from 'utils/helpers'

type NFTSwiperSectionTypes = {
  nfts: NftData[]
  collectionName: string
  showHideButton: any
}

const NFTSwiperSection = ({ nfts, collectionName, showHideButton }: NFTSwiperSectionTypes) => {
  const router = useRouter()
  const [rowCount, setRowCount] = useState(10)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [nftList, setNFTList] = useState<any[]>([])
  const [artworkType, setArtworkType] = useState('all')
  const [quickBuyNfts, setQuickBuyNfts] = useState([])
  const [liveEditionNfts, setLiveEditionNfts] = useState([])
  const [liveAuctionNfts, setLiveAuctionNfts] = useState([])

  useEffect(() => {
    if (nfts) {
      const listeNfts = nfts.filter(item => item.list_price != null)
      setQuickBuyNfts(listeNfts)

      const editionNfts = nfts.filter(
        item =>
          item.master_edition != null &&
          (item.master_edition?.endTime === null || getTimeDifference(item.master_edition?.endTime) > 0)
      )
      setLiveEditionNfts(editionNfts)

      const auctionNfts = nfts.filter(item => item.auction != null)
      setLiveAuctionNfts(auctionNfts)

      setNFTList(nfts.slice(0, rowCount))
      if (nfts.length > rowCount) setIsVisibleFetching(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nfts])

  useEffect(() => {
    if (artworkType === 'all') {
      setNFTList(nfts.slice(0, rowCount))
      if (nfts.length > rowCount) setIsVisibleFetching(true)
    } else if (artworkType === 'listed') {
      setNFTList(quickBuyNfts.slice(0, rowCount))
      if (quickBuyNfts.length > rowCount) setIsVisibleFetching(true)
    } else if (artworkType === 'edition') {
      setNFTList(liveEditionNfts.slice(0, rowCount))
      if (liveEditionNfts.length > rowCount) setIsVisibleFetching(true)
    } else if (artworkType === 'auction') {
      setNFTList(liveAuctionNfts.slice(0, rowCount))
      if (liveAuctionNfts.length > rowCount) setIsVisibleFetching(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artworkType])

  useEffect(() => {
    if (isFetching) {
      setIsFetching(false)
      if (artworkType === 'all') {
        if (nftList.length + rowCount > nfts.length) {
          setNFTList([...nftList, ...nfts.slice(nftList.length, nfts.length)])
          setIsVisibleFetching(false)
        } else {
          setNFTList([...nftList, ...nfts.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      } else if (artworkType === 'listed') {
        if (quickBuyNfts.length + rowCount > quickBuyNfts.length) {
          setNFTList([...nftList, ...quickBuyNfts.slice(nftList.length, quickBuyNfts.length)])
          setIsVisibleFetching(false)
        } else {
          setNFTList([...nftList, ...quickBuyNfts.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      } else if (artworkType === 'edition') {
        if (liveEditionNfts.length + rowCount > liveEditionNfts.length) {
          setNFTList([...nftList, ...liveEditionNfts.slice(nftList.length, liveEditionNfts.length)])
          setIsVisibleFetching(false)
        } else {
          setNFTList([...nftList, ...liveEditionNfts.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      } else if (artworkType === 'auction') {
        if (liveAuctionNfts.length + rowCount > liveAuctionNfts.length) {
          setNFTList([...nftList, ...liveAuctionNfts.slice(nftList.length, liveAuctionNfts.length)])
          setIsVisibleFetching(false)
        } else {
          setNFTList([...nftList, ...liveAuctionNfts.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  const gotoNftPage = item_id => {
    let token_id = item_id
    if (token_id === null || token_id === undefined) token_id = item_id
    if (token_id !== null && token_id !== undefined) {
      router.push(`/nft/${token_id.toString()}`)
    }
  }

  return (
    nftList !== undefined && (
      <section className={styles.container}>
        <div className="w-full flex overflow-x-scroll no-scrollbar mt-0 gap-2 lg:gap-4">
          <TimeSlotButton
            label="All"
            height={42}
            fontFamily={'Muli-Regular'}
            selected={artworkType === 'all'}
            width={80}
            onClick={() => {
              setArtworkType('all')
            }}
          />

          <TimeSlotButton
            label="Quick&nbsp;Buy"
            height={42}
            fontFamily={'Muli-Regular'}
            selected={artworkType === 'listed'}
            onClick={() => {
              setArtworkType('listed')
            }}
          />

          <TimeSlotButton
            label="Live&nbsp;Auction"
            height={42}
            fontFamily={'Muli-Regular'}
            selected={artworkType === 'auction'}
            onClick={() => {
              setArtworkType('auction')
            }}
          />

          <TimeSlotButton
            label="Live&nbsp;Edition"
            height={42}
            fontFamily={'Muli-Regular'}
            selected={artworkType === 'edition'}
            onClick={() => {
              setArtworkType('edition')
            }}
          />
        </div>
        <div className="w-full mt-[15px] lg:mt-[45px] z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-[10px] lg:gap-[20px] xl:gap-[30px]">
            {nftList.map((item, index) => (
              <div className="w-full" key={index}>
                {item.master_edition ? (
                  <HomeEditionCard
                    data={{
                      tokenId: item.id,
                      nftName: item.content.metadata.name,
                      artistUsername: item.creators[0].artist_username,
                      artistProfilePicture: item.creators[0].artist_profile_picture,
                      coverImageUrl:
                        item.content.files[0]?.cdn_uri ||
                        item.content.files[0]?.uri ||
                        item.content.links.image ||
                        DefaultNftBG.src,
                      assetUrl: item.content.files[1]?.uri,
                      endTime: item.master_edition?.endTime,
                      startTime: item.master_edition?.startTime,
                      price: item.master_edition?.price,
                      currentSupply: item.supply?.print_current_supply,
                      maxSupply: item.max_supply,
                    }}
                    type={item.max_supply === null ? 'open' : 'limit'}
                    onClick={() => {
                      gotoNftPage(item.id)
                    }}
                  />
                ) : item.auction ? (
                  <LiveAuctionCard
                    data={{
                      token_id: item.id,
                      asset_url: item.content.files[1]?.uri,
                      artist_username: item.creators[0].artist_username,
                      asset_type: item.category,
                      artist_profile_picture: item.creators[0].artist_profile_picture,
                      cover_image_url:
                        item.content.files[0]?.cdn_uri ||
                        item.content.files[0]?.uri ||
                        item.content.links.image ||
                        DefaultNftBG.src,
                      current_bid: item.auction?.current_bid,
                      reserve_price: item.auction?.list_price,
                      start_time: item.auction?.start_time,
                      end_time: item.auction?.end_time,
                    }}
                    onClick={() => {
                      gotoNftPage(item.id)
                    }}
                  />
                ) : (
                  <HomeNftCard
                    image={item.content.files[1]?.uri}
                    token_id={item.id}
                    nftName={item.content.metadata.name}
                    assetType={item.category}
                    coverImage={
                      item.content.files[0]?.cdn_uri ||
                      item.content.files[0]?.uri ||
                      item.content.links.image ||
                      DefaultNftBG.src
                    }
                    artistName={item.creators[0].artist_username}
                    artistImage={item.creators[0].artist_profile_picture}
                    collectionName={collectionName}
                    price={item.list_price}
                    showHideButton={showHideButton}
                    onClick={() => {}}
                  />
                )}
              </div>
            ))}
          </div>
          {isVisibleFetching && (
            <div className="w-full mt-[-50px] mb-[40px]">
              <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
            </div>
          )}
        </div>
      </section>
    )
  )
}

export default NFTSwiperSection
