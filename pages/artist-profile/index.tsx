import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
import HeaderImage from 'assets/images/alexander-ant.png'
import AvatarImage from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

// call apis
import artistsAPI from 'apis/artists'
import authAPI from 'apis/auth'
import ArtistLayout from 'components/Layout/ArtistLayout'
import { isString } from 'utils/helpers'

const ArtistProfile = () => {
  const router = useRouter()
  const { connected, publicKey } = useWallet()

  const dispatch = useDispatch()
  dispatch({ type: 'set', isLoading: false })
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)

  const [artistInfo, setArtistInfo] = useState<any>({})
  const [statsInfo, setStatsInfo] = useState<any>({})
  const [categoryList, setCategoryList] = useState<any>([])
  const [nfts, setNfts] = useState<any>([])
  const [collections, setCollections] = useState<any>([])
  const [isOwn, setIsOwn] = useState<any>(false)
  const [artistEnable, setArtistEnable] = useState(true)
  const [artistName, setArtistName] = useState('')
  const [artistDescription, setArtistDescription] = useState('')
  const [artistImageUrl, setArtistImageUrl] = useState('')
  useEffect(() => {
    if (router.query.id !== undefined && router.query.id !== null) {
      getArtistData(router.query.id, true)
    }
  }, [router.query])

  useEffect(() => {
    if (connected && loginAndRefresh) {
      dispatch({ type: 'set', loginAndRefresh: false })
      authAPI.login({ wallet_id: publicKey?.toBase58() || '' }).then(
        response => {
          if (response.new_user === true) {
            dispatch({ type: 'set', profileSetup: true })
          }
          dispatch({ type: 'set', profileInfo: response.user })
          dispatch({ type: 'set', bidWalletLock: response.bid_wallet_lock })
          dispatch({ type: 'set', offerWalletLock: response.offer_wallet_lock })

          if (artistEnable) {
            getArtistData(router.query.id, true)
          } else {
            getCollectorData(router.query.id, true)
          }
        },
        error => {
          console.log(error)
        }
      )
    }
  }, [connected, loginAndRefresh])

  useEffect(() => {
    if (router.query.id !== undefined && router.query.id !== null) {
      resetData()
      if (artistEnable) {
        getArtistData(router.query.id, false)
      } else {
        getCollectorData(router.query.id, false)
      }
    }
  }, [artistEnable])

  const getArtistData = (id, refresh) => {
    artistsAPI.getArtist(id).then(
      response => {
        if (isString(response)) return
        let artist = response.artist

        if (refresh && artist !== undefined && artist !== null) {
          if (
            artist.profile_picture === null ||
            artist.profile_picture === '' ||
            artist.profile_picture === undefined
          ) {
            artist.profile_picture = AvatarImage.src
          }
          if (artist.banner_picture === null || artist.banner_picture === '' || artist.banner_picture === undefined) {
            artist.banner_picture = HeaderImage.src
          }
          setArtistName(`${artist.username} | Foster Marketplace`)
          setArtistDescription(
            "Solana's first DAO governed NFT marketplace for art and music.\n" +
              'Create, collect and curate the flavor.'
          )
          setArtistImageUrl(artist?.profile_picture ?? '')
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

  const getCollectorData = (id, refresh) => {
    artistsAPI.getCollector(id).then(
      response => {
        if (isString(response)) return
        let artist = response.collector
        if (refresh && artist !== undefined && artist !== null) {
          if (
            artist.profile_picture === null ||
            artist.profile_picture === '' ||
            artist.profile_picture === undefined
          ) {
            artist.profile_picture = AvatarImage.src
          }
          if (artist.banner_picture === null || artist.banner_picture === '' || artist.banner_picture === undefined) {
            artist.banner_picture = HeaderImage.src
          }
          setArtistName(`${artist.username} | Foster Marketplace`)
          setArtistDescription(
            "Solana's first DAO governed NFT marketplace for art and music.\n" +
              'Create, collect and curate the flavor.'
          )
          setArtistImageUrl(artist?.profile_picture ?? '')
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
    if (publicKey) setIsOwn(artistInfo.wallet_id === publicKey?.toBase58())
  }, [artistInfo, publicKey])

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
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className={styles.container}>
        <div className={styles.bottomLeftEllipse}>
          <Image src={EllipseGreen} width={2021} height={2021} alt="" objectFit="cover" />
        </div>
        <MainSection
          artistInfo={artistInfo}
          statsInfo={statsInfo}
          categoryList={categoryList}
          isOwn={isOwn}
          artistEnable={artistEnable}
          setArtistEnable={enabled => setArtistEnable(enabled)}
        />
        <NFTSection nfts={nfts} collections={collections} wallet={artistInfo.wallet_id} />
      </div>
    </div>
  )
}

export default ArtistProfile

ArtistProfile.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}
