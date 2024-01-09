import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// next components
import { useRouter } from 'next/router'

// third party components
// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// components
import NFTCard from 'components/Card/NFTCard'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import LoadingComponent from 'pages/explore/LoadingComponent'
import TimeSlotButton from 'components/Button/TimeSlotButton'

const NFTSwiperSection = ({ nfts, collectionName, showHideButton }) => {
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
      const listeNfts = nfts.filter(item => item.list_price != null)
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
            width={60}
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
        <div className="w-full mt-[15px] lg:mt-[34px] z-10">
          <div className="grid grid-cols-12 gap-[11px] lg:gap-[20px] xl:gap-[34px]">
            {nftList.map((item, index) => (
              <div className="col-span-6 lg:col-span-3" key={index}>
                <NFTCard
                  token_id={item.token_id}
                  image={item.asset_url}
                  nftName={item.nft_name}
                  assetType={item.asset_type}
                  coverImage={item.cover_image_url}
                  artistName={item.artist_username}
                  collectionName={collectionName}
                  artistId={item.artist_id}
                  price={item.list_price}
                  showHideButton={showHideButton}
                  onClick={() => {
                    let token_id = item.mintAddress
                    if (token_id === null || token_id === undefined) token_id = item.token_id
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
