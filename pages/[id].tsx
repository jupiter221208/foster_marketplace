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
// import NFTSection from 'components/pages/ArtistProfile/NFTSection'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'
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
import { useViewport } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'
import { getSignMessageVerbiage, loginWithSigned } from 'utils/auth'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'
import TabSection from './profile/TabSection'

interface ArtistProfileProps {
  artistPublicKey?: string
  publicArtistData?: any
  error?: string
}

const ArtistProfile = ({ artistPublicKey, publicArtistData, error }: ArtistProfileProps) => {
  const { connected, publicKey, signMessage } = useWallet()
  const viewport = useViewport()

  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)
  const hideNftToken = useSelector(state => (state as any).hideNftToken)

  const [artistInfo, setArtistInfo] = useState<any>(publicArtistData?.artist)
  const [artistStatsInfo, setArtistStatsInfo] = useState<any>({})
  const [collectorStatsInfo, setCollectorStatsInfo] = useState<any>({})
  const [categoryList, setCategoryList] = useState<any>([])
  const [createdNfts, setCreatedNfts] = useState<any>([])
  const [collectedNfts, setCollectedNfts] = useState<any>([])
  const [collections, setCollections] = useState<any>([])
  const [artistEnable, setArtistEnable] = useState(true)
  // const [isMounted, setIsMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [userProfileUrl, setUserProfileUrl] = useState('')
  const [fullScreenMode, setFullScreenMode] = useState(false)
  // const [totalCount, setTotalCount] = useState(12)
  const [artistCurrentPage, setArtistCurrentPage] = useState(1)
  const [artistRowCount, setArtistRowCount] = useState(12)
  const [collectorCurrentPage, setCollectorCurrentPage] = useState(1)
  const [collectorRowCount, setCollectorRowCount] = useState(12)
  const [artistToEnd, setArtistToEnd] = useState(false)
  const [collectorToEnd, setCollectorToEnd] = useState(false)
  const [activeListingLoaded, setActiveListingLoaded] = useState(false)
  const [liveAuctionLoaded, setLiveAuctionLoaded] = useState(false)

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
    // setIsMounted(true)
    setTimeout(
      () =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        }),
      500
    )
    dispatch({ type: 'set', isLoading: true })
  }, [])

  useEffect(() => {
    if (activeListingLoaded && liveAuctionLoaded) {
      setTimeout(() => {
        dispatch({ type: 'set', isLoading: false })
      }, 1000)
    }
  }, [activeListingLoaded, liveAuctionLoaded])

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
    ;(async () => {
      if (!connected || !loginAndRefresh) return
      dispatch({ type: 'set', loginAndRefresh: false })
      let signature = await signMessage(Buffer.from(getSignMessageVerbiage(publicKey)))
      loginWithSigned(publicKey, signature, dispatch)
      getArtistData(artistPublicKey, artistRowCount, artistCurrentPage, true)
      getCollectorData(artistPublicKey, collectorRowCount, collectorCurrentPage, true)
    })()
  }, [connected, loginAndRefresh, publicArtistData, signMessage])

  const selectRowCount = count => {
    if (artistEnable) {
      setArtistRowCount(count)
      setArtistCurrentPage(1)
      getArtistData(artistPublicKey, count, 1)
    } else {
      setCollectorRowCount(count)
      setCollectorCurrentPage(1)
      getCollectorData(artistPublicKey, count, 1)
    }
    setTimeout(
      () =>
        window.scrollTo({
          top: 900,
        }),
      100
    )
  }

  const reloadPage = () => {
    getArtistData(artistPublicKey, artistRowCount, artistCurrentPage, false)
    getCollectorData(artistPublicKey, artistRowCount, artistCurrentPage, false)
  }

  const handleNextPage = () => {
    // if (totalCount < (currentPage + 1) * rowCount) return

    if (artistEnable) {
      const nextPage = artistCurrentPage + 1
      getArtistData(artistPublicKey, artistRowCount, nextPage)
    } else {
      const nextPage = collectorCurrentPage + 1
      getCollectorData(artistPublicKey, collectorRowCount, nextPage)
    }

    setTimeout(
      () =>
        window.scrollTo({
          top: 900,
        }),
      100
    )
  }

  const handlePreviousPage = () => {
    if (artistEnable) {
      if (artistCurrentPage === 1) return
      if (artistToEnd) setArtistToEnd(false)
      const prevPage = artistCurrentPage - 1
      getArtistData(artistPublicKey, artistRowCount, prevPage)
    } else {
      if (collectorCurrentPage === 1) return
      if (collectorToEnd) setCollectorToEnd(false)
      const prevPage = collectorCurrentPage - 1
      getCollectorData(artistPublicKey, collectorRowCount, prevPage)
    }
    setTimeout(
      () =>
        window.scrollTo({
          top: 900,
        }),
      100
    )
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

  const getArtistData = (id, row_count, current_page, refresh = false) => {
    if (artistToEnd) return
    setCreatedNfts([])
    artistsAPI.getArtist(id, row_count, current_page).then(
      response => {
        setIsLoaded(true)
        if (isString(response)) return
        let artist = response.artist

        if (refresh && artist) {
          artist.profile_picture ||= AvatarImage.src
          artist.banner_picture ||= HeaderImage.src
          setArtistInfo(artist)
        }
        setArtistStatsInfo(response.stats)
        setCreatedNfts(response.nfts)
        setArtistCurrentPage(current_page)
        if (response.nfts.length < row_count) {
          setArtistToEnd(true)
        }

        setCollections(response.collections)
        if (categoryList.length === 0) setCategoryList(response.categories)
      },
      error => {
        setIsLoaded(true)
        console.log(error)
      }
    )
  }

  const getCollectorData = (id, row_count, current_page, refresh = false) => {
    if (collectorToEnd) return
    setCollectedNfts([])
    artistsAPI.getCollector(id, row_count, current_page).then(
      response => {
        setIsLoaded(true)
        if (isString(response)) return
        let artist = response.collector
        if (refresh && artist) {
          artist.profile_picture ||= AvatarImage.src
          artist.banner_picture ||= HeaderImage.src
          setArtistInfo(artist)
        }
        setCollectorStatsInfo(response.stats)

        setCollectedNfts(response.nfts)
        setCollectorCurrentPage(current_page)
        if (response.nfts.length < row_count) {
          setCollectorToEnd(true)
        }

        // setCollections(response.collections)
        // if (categoryList.length === 0) setCategoryList(response.categories)
      },
      error => {
        setIsLoaded(true)
        console.log(error)
      }
    )
  }

  useEffect(() => {
    if (!artistPublicKey) return
    resetData()
    getArtistData(artistPublicKey, artistRowCount, artistCurrentPage, true)
    getCollectorData(artistPublicKey, collectorRowCount, collectorCurrentPage, true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [artistPublicKey])

  let artistName = `${artistInfo?.username} | Foster Marketplace`
  let artistImageUrl = getAbsoluteOgUrl(artistInfo?.profile_picture ?? DefaultNftBG.src)
  let artistDescription =
    "Solana's first DAO governed NFT marketplace for art and music.\n" + 'Create, collect and curate the flavor.'

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
        <div className={styles.topLeftEllipse}>
          {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
        </div>
        <div className={styles.topRightEllipse}>
          {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
        </div>
        <MainSection
          artistInfo={artistInfo}
          categoryList={categoryList}
          isOwn={isOwn}
          isLoaded={isLoaded}
          setFullScreenView={setFullScreenView}
          wallet={artistInfo?.wallet_id}
          reloadPage={reloadPage}
        />
        <div className="w-full flex justify-center">
          <div className="g-container">
            <TabSection
              createdNfts={createdNfts}
              collectedNfts={collectedNfts}
              collections={collections}
              wallet={artistInfo?.wallet_id}
              isOwn={isOwn}
              isLoaded={isLoaded}
              artistCurrentPage={artistCurrentPage}
              artistRowCount={artistRowCount}
              collectorCurrentPage={collectorCurrentPage}
              collectorRowCount={collectorRowCount}
              selectRowCount={count => selectRowCount(count)}
              handleNextPage={() => handleNextPage()}
              handlePreviousPage={() => handlePreviousPage()}
              reloadPage={reloadPage}
              setArtistEnable={setArtistEnable}
              artistStatsInfo={artistStatsInfo}
              collectorStatsInfo={collectorStatsInfo}
              setActiveListingLoaded={setActiveListingLoaded}
              setLiveAuctionLoaded={setLiveAuctionLoaded}
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

      <FullScreenLoadingModal open={isLoading} />
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
