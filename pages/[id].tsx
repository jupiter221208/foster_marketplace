import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

// next components
import Head from 'next/head'
import Image from 'next/image'

// third party components
import { useDispatch } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'

// components
import MainSection from 'components/pages/ArtistProfile/MainSection'

// images and icons
import HeaderImage from 'assets/images/banner-image.png'
import AvatarImage from 'assets/images/dashboard-avatar.png'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import CloseIcon from 'assets/icons/close-screen.svg'

// styles
import styles from './id.module.scss'

// call apis
import artistsAPI from 'apis/artists'
import ArtistLayout from 'components/Layout/ArtistLayout'
import { isString } from 'utils/helpers'
import { useAuthentication } from 'hooks/useAuthentication'
import { getAbsoluteOgUrl } from 'utils/seo'
import TabSection from './profile/TabSection'
import { ArtistsAPIData } from 'types/nft'

interface ArtistProfileProps {
  artistPublicKey?: string
  publicArtistData?: any
  error?: string
}

const ArtistProfile = ({ artistPublicKey, publicArtistData, error }: ArtistProfileProps) => {
  useAuthentication()
  const { connected, publicKey } = useWallet()

  const dispatch = useDispatch()
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)
  const hideNftToken = useSelector(state => (state as any).hideNftToken)

  const [artistInfo, setArtistInfo] = useState<any>(publicArtistData?.artist)
  const [artistStatsInfo, setArtistStatsInfo] = useState<any>({})
  const [collectorStatsInfo, setCollectorStatsInfo] = useState<any>({})
  const [categoryList, setCategoryList] = useState<any>([])
  const [createdNfts, setCreatedNfts] = useState<ArtistsAPIData[]>([])
  const [collectedNfts, setCollectedNfts] = useState<ArtistsAPIData[]>([])
  const [merchNfts, setMerchNfts] = useState<ArtistsAPIData[]>([])
  const [collections, setCollections] = useState([])
  const [artistEnable, setArtistEnable] = useState(true)
  const [merchEnable, setMerchEnable] = useState(false)
  const [collectorEnable, setCollectorEnable] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [userProfileUrl, setUserProfileUrl] = useState('')
  const [fullScreenMode, setFullScreenMode] = useState(false)
  const [artistCurrentPage, setArtistCurrentPage] = useState(1)
  const [artistRowCount, setArtistRowCount] = useState(12)
  const [collectorCurrentPage, setCollectorCurrentPage] = useState(1)
  const [collectorRowCount, setCollectorRowCount] = useState(12)
  const [collectorTotalCount, setCollectorTotalCount] = useState(0)
  const [merchCurrentPage, setMerchCurrentPage] = useState(1)
  const [merchRowCount, setMerchRowCount] = useState(12)
  const [activeListingLoaded, setActiveListingLoaded] = useState(false)
  const [liveAuctionLoaded, setLiveAuctionLoaded] = useState(false)
  const [isFetchingCreated, setIsFetchingCreated] = useState(false)
  const [isVisibleFetchingCreated, setIsVisibleFetchingCreated] = useState(false)
  const [isFetchingMerch, setIsFetchingMerch] = useState(false)
  const [isVisibleFetchingMerch, setIsVisibleFetchingMerch] = useState(false)
  const [isFetchingCollected, setIsFetchingCollected] = useState(false)
  const [isVisibleFetchingCollected, setIsVisibleFetchingCollected] = useState(false)
  const [hasLoading, setHasLoading] = useState(true)

  const setFullScreenView = url => {
    window.scrollTo({
      top: 0,
    })
    document.body.style.overflow = 'hidden'
    setFullScreenMode(true)
    setUserProfileUrl(url)
  }

  const [isOwn, setIsOwn] = useState<any>(false)
  useEffect(() => {
    if (publicKey) setIsOwn(artistInfo?.wallet_id === publicKey?.toBase58())
  }, [artistInfo, publicKey])

  useEffect(() => {
    setTimeout(
      () =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        }),
      500
    )
    dispatch({ type: 'set', isLoading: false })
  }, [])

  useEffect(() => {
    if (hideNftToken.length > 0) {
      let newNfts = createdNfts.filter(item => item.token_id !== hideNftToken)
      setCreatedNfts(newNfts)
      let newNfts2 = collectedNfts.filter(item => item.token_id !== hideNftToken)
      setCollectedNfts(newNfts2)
      dispatch({ type: 'set', hideNftToken: '' })
    }
  }, [hideNftToken])

  useEffect(() => {
    ;async () => {
      if (!connected || !loginAndRefresh) return
      dispatch({ type: 'set', loginAndRefresh: false })
      await getArtistData(artistPublicKey, artistRowCount, artistCurrentPage, true, true)
      await getCollectorData(artistPublicKey, collectorRowCount, collectorCurrentPage, true, true)
      await getMerchNftData(artistPublicKey, merchRowCount, merchCurrentPage, true, true)
    }
  }, [connected, loginAndRefresh, publicArtistData])

  const reloadPage = () => {
    getArtistData(artistPublicKey, artistRowCount, artistCurrentPage, false, true)
    getCollectorData(artistPublicKey, artistRowCount, artistCurrentPage, false, true)
    getMerchNftData(artistPublicKey, artistRowCount, artistCurrentPage, false, true)
  }

  const handleNextPage = () => {
    if (artistEnable) {
      const nextPage = artistCurrentPage + 1
      getArtistData(artistPublicKey, artistRowCount, nextPage)
    } else if (merchEnable) {
      const nextPage = merchCurrentPage + 1
      getMerchNftData(artistPublicKey, merchRowCount, nextPage)
    } else if (collectorEnable) {
      const nextPage = collectorCurrentPage + 1
      getCollectorData(artistPublicKey, collectorRowCount, nextPage)
    }
  }

  const resetData = () => {
    setArtistStatsInfo({
      nfts_collected: 'N/A',
      collections_collected: 'N/A',
      unique_artists_owned: 'N/A',
      purchase_volume: 'N/A',
      nfts_created: 'N/A',
      collections_created: 'N/A',
      unique_collectors: 'N/A',
      sales_volume: 'N/A',
    })
    setCollectorStatsInfo({
      nfts_collected: 'N/A',
      collections_collected: 'N/A',
      unique_artists_owned: 'N/A',
      purchase_volume: 'N/A',
      nfts_created: 'N/A',
      collections_created: 'N/A',
      unique_collectors: 'N/A',
      sales_volume: 'N/A',
    })
    setCollections([])
    setCategoryList([])
  }

  const getMerchNftData = (id, row_count, current_page, refresh = false, reset = false) => {
    artistsAPI.getMerchNfts(id, row_count, current_page).then(
      response => {
        setIsLoaded(true)
        setIsFetchingMerch(false)
        if (isString(response)) return

        if (response.length === merchRowCount) setIsVisibleFetchingMerch(true)
        else setIsVisibleFetchingMerch(false)

        if (reset === true) setMerchNfts(response)
        else setMerchNfts([...merchNfts, ...response])

        setMerchCurrentPage(current_page)
        fetchNftData(response)
      },
      error => {
        setIsLoaded(true)
        setIsFetchingMerch(false)
        setIsVisibleFetchingMerch(false)
        console.log(error)
      }
    )
  }

  const getArtistData = (id, row_count, current_page, refresh = false, reset = false) => {
    artistsAPI.getArtist(id, row_count, current_page).then(
      response => {
        setIsLoaded(true)
        setHasLoading(false)

        setIsFetchingCreated(false)
        if (isString(response)) return
        let artist = response.artist

        if (refresh && artist) {
          artist.profile_picture ||= AvatarImage.src
          artist.banner_picture ||= HeaderImage.src
          setArtistInfo(artist)
        }
        setArtistStatsInfo(response.stats)

        if (response.nfts.length === artistRowCount) setIsVisibleFetchingCreated(true)
        else setIsVisibleFetchingCreated(false)

        let newNfts = []
        if (reset === true) newNfts = response.nfts
        else {
          newNfts = [...createdNfts, ...response.nfts]
        }
        var filteredNfts = newNfts.filter(
          (arr, index, self) =>
            index === self.findIndex(t => t.nft_name === arr.nft_name && t.asset_url === arr.asset_url)
        )
        setCreatedNfts(filteredNfts)
        setArtistCurrentPage(current_page)
        setCollections(response.collections)

        if (categoryList.length === 0) setCategoryList(response.categories)

        fetchNftData(filteredNfts)
      },
      error => {
        setIsLoaded(true)
        setHasLoading(false)
        setIsFetchingCreated(false)
        setIsVisibleFetchingCreated(false)
      }
    )
  }

  const getCollectorData = (id, row_count, current_page, refresh = false, reset = false) => {
    artistsAPI.getCollector(id, row_count, current_page).then(
      response => {
        setIsLoaded(true)
        setIsFetchingCollected(false)
        if (isString(response)) return
        let artist = response.collector
        if (refresh && artist) {
          artist.profile_picture ||= AvatarImage.src
          artist.banner_picture ||= HeaderImage.src
          setArtistInfo(artist)
        }
        setCollectorStatsInfo(response.stats)
        setCollectorTotalCount(response.total_nfts)

        if (response.nfts.length === collectorRowCount) setIsVisibleFetchingCollected(true)
        else setIsVisibleFetchingCollected(false)

        if (reset === true) setCollectedNfts(response.nfts)
        else setCollectedNfts([...collectedNfts, ...response.nfts])

        setCollectorCurrentPage(current_page)
        fetchNftData(response.nfts)
      },
      error => {
        setIsLoaded(true)
        setIsFetchingCollected(false)
        setIsVisibleFetchingCollected(false)
      }
    )
  }

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const fetchNftData = nfts => {
    if (nfts.length > 0) {
      ;(async () => {
        for (let index = 0; index < nfts.length; index++) {
          let data = nfts[index]
          fetch(`/nft/${data.token_id}`).then(e => e.text())
          if (index % 3 == 2) {
            await sleep(1000)
          }
        }
      })()
    }
  }

  useEffect(() => {
    if (!artistPublicKey) return
    setHasLoading(true)
    resetData()
    getArtistData(artistPublicKey, artistRowCount, artistCurrentPage, true, true)
    getCollectorData(artistPublicKey, collectorRowCount, collectorCurrentPage, true, true)
    getMerchNftData(artistPublicKey, merchRowCount, merchCurrentPage, true, true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [artistPublicKey])

  let artistName = `${artistInfo?.username} | Foster Marketplace`
  let artistImageUrl = getAbsoluteOgUrl(artistInfo?.profile_picture ?? DefaultNftBG.src)
  let artistDescription = artistInfo?.bio ?? ''

  return (
    <div className="w-full">
      <Head>
        <title>{artistName}</title>
        <meta property="description" content={artistDescription} />

        <meta name="og:title" content={artistName} />
        <meta property="og:description" content={artistDescription} />
        <meta name="og:image" content={artistImageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={artistName} />
        <meta property="twitter:description" content={artistDescription} />
        <meta property="twitter:image" content={artistImageUrl} />

        <link rel="icon" href="/logo.png" />
      </Head>
      <div className={styles.container}>
        <MainSection
          artistInfo={artistInfo}
          categoryList={categoryList}
          isOwn={isOwn}
          isLoaded={isLoaded}
          setFullScreenView={setFullScreenView}
          wallet={artistInfo?.wallet_id}
          reloadPage={reloadPage}
          hasLoading={hasLoading}
        />
        <div className="w-full flex justify-center">
          <div className="g-container">
            <TabSection
              createdNfts={createdNfts}
              collectedNfts={collectedNfts}
              merchNfts={merchNfts}
              collections={collections}
              wallet={artistInfo?.wallet_id}
              description={artistDescription}
              categoryList={categoryList}
              isOwn={isOwn}
              isLoaded={isLoaded}
              handleNextPage={() => handleNextPage()}
              reloadPage={reloadPage}
              setArtistEnable={setArtistEnable}
              setMerchEnable={setMerchEnable}
              setCollectorEnable={setCollectorEnable}
              artistStatsInfo={artistStatsInfo}
              collectorStatsInfo={collectorStatsInfo}
              setActiveListingLoaded={setActiveListingLoaded}
              setLiveAuctionLoaded={setLiveAuctionLoaded}
              isVisibleFetchingCreated={isVisibleFetchingCreated}
              isFetchingCreated={isFetchingCreated}
              setIsFetchingCreated={setIsFetchingCreated}
              isVisibleFetchingCollected={isVisibleFetchingCollected}
              isFetchingCollected={isFetchingCollected}
              setIsFetchingCollected={setIsFetchingCollected}
              isVisibleFetchingMerch={isVisibleFetchingMerch}
              isFetchingMerch={isFetchingMerch}
              setIsFetchingMerch={setIsFetchingMerch}
            />
          </div>
        </div>

        {fullScreenMode && (
          <div className={styles.fullScreen}>
            <img
              src={userProfileUrl}
              alt=""
              className="w-[260px] h-[260px] lg:w-[500px] lg:h-[500px] rounded-full object-fit"
            />
            <div
              className={styles.closeScreen}
              onClick={() => {
                setFullScreenMode(false)
                document.body.style.overflow = 'unset'
              }}
            >
              <Image src={CloseIcon} alt="" width={18} height={18} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtistProfile

ArtistProfile.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}

ArtistProfile.getInitialProps = async function ({ res, query }): Promise<ArtistProfileProps> {
  let artistUsername = encodeURIComponent(query.id)

  try {
    let publicArtistData = await fetch(`${process.env.BACKEND_URL}v1/artists/${artistUsername}/username`).then(r =>
      r.json()
    )
    publicArtistData.artist.profile_picture ||= AvatarImage.src
    publicArtistData.artist.banner_picture ||= HeaderImage.src
    let artistPublicKey = publicArtistData.artist.wallet_id
    return {
      artistPublicKey,
      publicArtistData,
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load artist details: ${artistUsername}: ${e.message}`,
    }
  }
}
