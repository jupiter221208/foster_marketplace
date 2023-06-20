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
import NFTSection from 'components/pages/ArtistProfile/NFTSection'

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
import { isString, isLoggedIn } from 'utils/helpers'
import { useViewport } from 'utils'
import { getAbsoluteOgUrl } from 'utils/seo'
import { loginWithSigned } from 'utils/auth'

interface ArtistProfileProps {
  artistPublicKey?: string
  publicArtistData?: any
  error?: string
}

const ArtistProfile = ({ artistPublicKey, publicArtistData, error }: ArtistProfileProps) => {
  const { connected, publicKey, signMessage } = useWallet()
  const viewport = useViewport()

  const dispatch = useDispatch()
  dispatch({ type: 'set', isLoading: false })
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)
  const hideNftToken = useSelector(state => (state as any).hideNftToken)

  const [artistInfo, setArtistInfo] = useState<any>(publicArtistData?.artist)
  const [statsInfo, setStatsInfo] = useState<any>({})
  const [categoryList, setCategoryList] = useState<any>([])
  const [nfts, setNfts] = useState<any>([])
  const [collections, setCollections] = useState<any>([])
  const [artistEnable, setArtistEnable] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [userProfileUrl, setUserProfileUrl] = useState('')
  const [fullScreenMode, setFullScreenMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(12)
  const [rowCount, setRowCount] = useState(12)

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
    setIsMounted(true)
    setTimeout(
      () =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        }),
      500
    )
  }, [])

  useEffect(() => {
    if (hideNftToken.length > 0) {
      let newNfts = nfts.filter(item => item.token_id !== hideNftToken)
      setNfts(newNfts)
      dispatch({ type: 'set', hideNftToken: '' })
      dispatch({ type: 'set', isLoading: false })
    }
  }, [hideNftToken])

  useEffect(() => {
    ;(async () => {
      if (!connected || !loginAndRefresh) return
      dispatch({ type: 'set', loginAndRefresh: false })

      let signature = await signMessage(Buffer.from('Foster Protocol'))
      loginWithSigned(publicKey, signature, dispatch)

      if (artistEnable || isLoggedIn()) {
        getArtistData(artistPublicKey, rowCount, currentPage, true)
      } else {
        getCollectorData(artistPublicKey, rowCount, currentPage, true)
      }
    })()
  }, [connected, loginAndRefresh, publicArtistData, signMessage])

  const selectRowCount = count => {
    setRowCount(count)
    if (artistEnable) getArtistData(artistPublicKey, count, currentPage)
    else getCollectorData(artistPublicKey, count, currentPage)
    setTimeout(
      () =>
        window.scrollTo({
          top: 900,
        }),
      100
    )
  }

  const handleNextPage = () => {
    // if (totalCount < (currentPage + 1) * rowCount) return
    const nextPage = currentPage + 1
    if (artistEnable) getArtistData(artistPublicKey, rowCount, nextPage)
    else getCollectorData(artistPublicKey, rowCount, nextPage)
    setTimeout(
      () =>
        window.scrollTo({
          top: 900,
        }),
      100
    )
  }

  const handlePreviousPage = () => {
    if (currentPage === 1) return
    const prevPage = currentPage - 1
    if (artistEnable) getArtistData(artistPublicKey, rowCount, prevPage)
    else getCollectorData(artistPublicKey, rowCount, prevPage)
    setTimeout(
      () =>
        window.scrollTo({
          top: 900,
        }),
      100
    )
  }

  const resetData = () => {
    setStatsInfo({
      nfts_collected: 'N/A',
      collections_collected: 'N/A',
      unique_artists_owned: 'N/A',
      purchase_volume: 'N/A',
      nfts_created: 'N/A',
      collections_created: 'N/A',
      unique_collectors: 'N/A',
      sales_volume: 'N/A',
    })
    setNfts([])
    setCollections([])
    setCategoryList([])
  }

  const getArtistData = (id, row_count, current_page, refresh = false) => {
    console.log('=========', id, row_count, current_page)
    setNfts([])
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
        console.log(response)
        setStatsInfo(response.stats)
        setNfts(response.nfts)
        if (response.nfts.length === 12) {
          setCurrentPage(current_page)
        }
        setCollections(response.collections)
        if (categoryList.length === 0) setCategoryList(response.categories)
      },
      error => {
        console.log(error)
      }
    )
  }

  const getCollectorData = (id, row_count, current_page, refresh = false) => {
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
        setStatsInfo(response.stats)
        setNfts(response.nfts)
        if (response.nfts.length === 12) {
          setCurrentPage(current_page)
        }
        setCollections(response.collections)
        if (categoryList.length === 0) setCategoryList(response.categories)
      },
      error => {
        console.log(error)
      }
    )
  }

  useEffect(() => {
    if (isMounted) {
      setIsLoaded(false)
      setRowCount(12)
      setCurrentPage(1)
      if (artistEnable) {
        getArtistData(artistPublicKey, 12, 1)
      } else {
        getCollectorData(artistPublicKey, 12, 1)
      }
    }
  }, [artistEnable])

  useEffect(() => {
    if (!artistPublicKey) return
    resetData()

    if (artistEnable) {
      setArtistInfo(publicArtistData?.artist ?? {})
      setStatsInfo(publicArtistData?.stats ?? {})
      setCategoryList(publicArtistData?.categories ?? [])
      setNfts(publicArtistData?.nfts ?? [])
      setCollections(publicArtistData?.collections ?? [])

      getArtistData(artistPublicKey, rowCount, currentPage, true)
    } else {
      getCollectorData(artistPublicKey, rowCount, currentPage, true)
    }
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
    <div className="g-container">
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
        <div className={styles.bottomLeftEllipse}>
          {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
        </div>
        <MainSection
          artistInfo={artistInfo}
          statsInfo={statsInfo}
          categoryList={categoryList}
          isOwn={isOwn}
          isLoaded={isLoaded}
          artistEnable={artistEnable}
          setArtistEnable={enabled => setArtistEnable(enabled)}
          setFullScreenView={setFullScreenView}
        />
        <NFTSection
          nfts={nfts}
          collections={collections}
          wallet={artistInfo?.wallet_id}
          isOwn={isOwn}
          currentPage={currentPage}
          rowCount={rowCount}
          selectRowCount={count => selectRowCount(count)}
          handleNextPage={() => handleNextPage()}
          handlePreviousPage={() => handlePreviousPage()}
        />
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
