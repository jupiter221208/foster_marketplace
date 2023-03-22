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
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import EllipseGreenLight from 'assets/icons/ellipse-green-light.svg'
import HeaderImage from 'assets/images/banner-image.png'
import AvatarImage from 'assets/images/dashboard-avatar.png'
import DefaultNftBG from 'assets/images/default-nft-bg.png'

// styles
import styles from './index.module.scss'

// call apis
import artistsAPI from 'apis/artists'
import authAPI from 'apis/auth'
import ArtistLayout from 'components/Layout/ArtistLayout'
import { isString, isLoggedIn } from 'utils/helpers'

interface ArtistProfileProps {
  artistPublicKey?: string
  publicArtistData?: any
  error?: string
}

const ArtistProfile = ({ artistPublicKey, publicArtistData, error }: ArtistProfileProps) => {
  const { connected, publicKey } = useWallet()

  const dispatch = useDispatch()
  dispatch({ type: 'set', isLoading: false })
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)

  const [artistInfo, setArtistInfo] = useState<any>(publicArtistData?.artist)
  const [statsInfo, setStatsInfo] = useState<any>({})
  const [categoryList, setCategoryList] = useState<any>([])
  const [nfts, setNfts] = useState<any>([])
  const [collections, setCollections] = useState<any>([])
  const [artistEnable, setArtistEnable] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const [isOwn, setIsOwn] = useState<any>(false)
  useEffect(() => {
    if (publicKey) setIsOwn(artistInfo?.wallet_id === publicKey?.toBase58())
  }, [artistInfo, publicKey])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (connected && loginAndRefresh) {
      dispatch({ type: 'set', loginAndRefresh: false })
      authAPI.login({ wallet_id: publicKey?.toBase58() || '' }).then(
        response => {
          if (response.new_user) dispatch({ type: 'set', profileSetup: true })
          dispatch({ type: 'set', profileInfo: response.user })
          dispatch({ type: 'set', bidWalletLock: response.bid_wallet_lock })
          dispatch({ type: 'set', offerWalletLock: response.offer_wallet_lock })

          if (artistEnable || isLoggedIn()) {
            getArtistData(artistPublicKey, true)
          } else {
            getCollectorData(artistPublicKey, true)
          }
        },
        error => {
          console.log(error)
        }
      )
    }
  }, [connected, loginAndRefresh, publicArtistData])

  const getArtistData = (id, refresh = false) => {
    artistsAPI.getArtist(id).then(
      response => {
        if (isString(response)) return
        let artist = response.artist

        if (refresh && artist) {
          artist.profile_picture ||= AvatarImage.src
          artist.banner_picture ||= HeaderImage.src
          setArtistInfo(artist)
        }
        setStatsInfo(response.stats)
        setNfts(response.nfts)
        setCollections(response.collections)
        if (categoryList.length === 0) setCategoryList(response.categories)
      },
      error => {
        console.log(error)
      }
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

  const getCollectorData = (id, refresh = false) => {
    artistsAPI.getCollector(id).then(
      response => {
        if (isString(response)) return
        let artist = response.collector
        if (refresh && artist) {
          artist.profile_picture ||= AvatarImage.src
          artist.banner_picture ||= HeaderImage.src
          setArtistInfo(artist)
        }
        setStatsInfo(response.stats)
        setNfts(response.nfts)
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
      if (artistEnable) {
        getArtistData(artistPublicKey)
      } else {
        getCollectorData(artistPublicKey)
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

      getArtistData(artistPublicKey, true)
    } else {
      getCollectorData(artistPublicKey, true)
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [artistPublicKey])

  let artistName = `${artistInfo?.username} | Foster Marketplace`
  let artistImageUrl = artistInfo?.profile_picture ?? DefaultNftBG.src
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
          <svg xmlns="http://www.w3.org/2000/svg" width="2321" height="2321" viewBox="0 0 2321 2321">
            <defs>
              <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="var(--ellipse-svg-1)" stopOpacity="0.404" />
                <stop offset="1" stopColor="var(--ellipse-svg-2)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle
              id="Ellipse_4322"
              data-name="Ellipse 4322"
              cx="1010.5"
              cy="1010.5"
              r="1010.5"
              transform="translate(150 150)"
              fill="url(#radial-gradient)"
            />
          </svg>
        </div>
        <div className={styles.topRightEllipse}>
          <svg xmlns="http://www.w3.org/2000/svg" width="2321" height="2321" viewBox="0 0 2321 2321">
            <defs>
              <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="var(--ellipse-svg-1)" stopOpacity="0.404" />
                <stop offset="1" stopColor="var(--ellipse-svg-2)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle
              id="Ellipse_4322"
              data-name="Ellipse 4322"
              cx="1010.5"
              cy="1010.5"
              r="1010.5"
              transform="translate(150 150)"
              fill="url(#radial-gradient)"
            />
          </svg>
        </div>
        <div className={styles.bottomLeftEllipse}>
          <svg xmlns="http://www.w3.org/2000/svg" width="2321" height="2321" viewBox="0 0 2321 2321">
            <defs>
              <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                <stop offset="0" stopColor="var(--ellipse-svg-1)" stopOpacity="0.404" />
                <stop offset="1" stopColor="var(--ellipse-svg-2)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle
              id="Ellipse_4322"
              data-name="Ellipse 4322"
              cx="1010.5"
              cy="1010.5"
              r="1010.5"
              transform="translate(150 150)"
              fill="url(#radial-gradient)"
            />
          </svg>
        </div>
        <MainSection
          artistInfo={artistInfo}
          statsInfo={statsInfo}
          categoryList={categoryList}
          isOwn={isOwn}
          artistEnable={artistEnable}
          setArtistEnable={enabled => setArtistEnable(enabled)}
        />
        <NFTSection nfts={nfts} collections={collections} wallet={artistInfo?.wallet_id} />
      </div>
    </div>
  )
}

export default ArtistProfile

ArtistProfile.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}

ArtistProfile.getInitialProps = async function ({ res, query }): Promise<ArtistProfileProps> {
  let artistPublicKey = query.id
  try {
    let publicArtistData = await fetch(`${process.env.BACKEND_URL}v1/artists/${artistPublicKey}/public`).then(r =>
      r.json()
    )
    publicArtistData.artist.profile_picture ||= AvatarImage.src
    publicArtistData.artist.banner_picture ||= HeaderImage.src

    return {
      artistPublicKey,
      publicArtistData,
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load artist details: ${artistPublicKey}: ${e.message}`,
    }
  }
}
