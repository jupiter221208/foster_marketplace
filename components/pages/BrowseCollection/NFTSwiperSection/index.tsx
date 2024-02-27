import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// next components
import { useRouter } from 'next/router'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import NFTCard from 'components/Card/NFTCard'

// custom functions
import { useViewport } from 'utils'

import DefaultNftBG from 'assets/images/default-nft-bg.png'

// styles
import styles from './index.module.scss'
import LoadingComponent from 'pages/explore/LoadingComponent'
import TimeSlotButton from 'components/Button/TimeSlotButton'
import { NftData } from 'types/nft'

type NFTSwiperSectionTypes = {
  nfts: NftData[]
  collectionName: string
  showHideButton: any
}

const NFTSwiperSection = ({ nfts, collectionName, showHideButton }: NFTSwiperSectionTypes) => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [rowCount, setRowCount] = useState(10)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [nftList, setNFTList] = useState<any[]>([])
  const [artworkType, setArtworkType] = useState('all')
  const [quickBuyNfts, setQuickBuyNfts] = useState([])

  useEffect(() => {
    if (nfts) {
      const listeNfts = nfts.filter(item => item.auction?.list_price != null)
      setQuickBuyNfts(listeNfts)

      setNFTList(nfts.slice(0, rowCount))
      if (nfts.length > rowCount) setIsVisibleFetching(true)
      setLoading(true)
    }
  }, [nfts])

  useEffect(() => {
    if (artworkType === 'all') {
      setNFTList(nfts.slice(0, rowCount))
      if (nfts.length > rowCount) setIsVisibleFetching(true)
    } else {
      setNFTList(quickBuyNfts.slice(0, rowCount))
      if (quickBuyNfts.length > rowCount) setIsVisibleFetching(true)
    }
    setLoading(true)
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
      } else {
        if (quickBuyNfts.length + rowCount > quickBuyNfts.length) {
          setNFTList([...nftList, ...quickBuyNfts.slice(nftList.length, quickBuyNfts.length)])
          setIsVisibleFetching(false)
        } else {
          setNFTList([...nftList, ...quickBuyNfts.slice(nftList.length, nftList.length + rowCount)])
          setIsVisibleFetching(true)
        }
      }
    }
  }, [isFetching])

  console.log(nftList)

  return (
    nftList !== undefined && (
      <section className={styles.container}>
        <div className="w-full flex overflow-x-scroll no-scrollbar mt-0 gap-2 lg:gap-4">
          <TimeSlotButton
            label="All"
            height={42}
            fontFamily={'Muli-Regular'}
            color={artworkType === 'all' ? '#1A1A1A' : 'var(--time-slot-deselect-color)'}
            backgroundColor01={artworkType === 'all' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
            backgroundColor02={artworkType === 'all' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
            width={80}
            onClick={() => {
              setArtworkType('all')
            }}
          />

          <TimeSlotButton
            label="Quick&nbsp;Buy"
            height={42}
            fontFamily={'Muli-Regular'}
            color={artworkType === 'listed' ? '#1A1A1A' : 'var(--time-slot-deselect-color)'}
            backgroundColor01={artworkType === 'listed' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
            backgroundColor02={artworkType === 'listed' ? 'var(--toggle-bg-color)' : 'var(--time-slot-bg)'}
            onClick={() => {
              setArtworkType('listed')
            }}
          />
        </div>
        <div className="w-full mt-[15px] lg:mt-[45px] z-10">
          <div className="grid grid-cols-12 gap-[11px] lg:gap-[20px] xl:gap-[34px]">
            {nftList.map((item, index) => (
              <div className="col-span-6 lg:col-span-3" key={index}>
                <NFTCard
                  token_id={item.id}
                  image={item.content.files[1]?.uri}
                  nftName={item.content.metadata.name}
                  assetType={item.category}
                  coverImage={
                    item.content.files[0]?.cdn_uri ||
                    item.content.files[0]?.uri ||
                    item.content.links.image ||
                    DefaultNftBG.src
                  }
                  fallBack={item.content.links.image || DefaultNftBG.src}
                  artistName={item.creators[0].artist_username}
                  collectionName={collectionName}
                  artistId={item.creators[0].address}
                  price={item.auction?.list_price}
                  showHideButton={showHideButton}
                  onClick={() => {
                    let token_id = item.id
                    if (token_id === null || token_id === undefined) token_id = item.id
                    if (token_id !== null && token_id !== undefined) {
                      dispatch({ type: 'set', isLoading: true })
                      router.push(`/nft/${token_id.toString()}`)
                    }
                  }}
                />
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
