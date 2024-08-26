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

interface ArtistProfileProps {
  artistPublicKey?: string
  publicArtistData?: any
  error?: string
}

const ArtistProfile = ({ artistPublicKey, publicArtistData, error }: ArtistProfileProps) => {
  useAuthentication()
  const { connected, publicKey } = useWallet()

  const dispatch = useDispatch()
  const removeCollectionId = useSelector(state => (state as any).removeCollectionId)
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)

  const [artistInfo, setArtistInfo] = useState<any>(publicArtistData)
  const [artistStatsInfo, setArtistStatsInfo] = useState<any>({})
  const [collectorStatsInfo, setCollectorStatsInfo] = useState<any>({})
  const [categoryList, setCategoryList] = useState<any>([])
  const [collections, setCollections] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isColletorLoaded, setIsColletorLoaded] = useState(false)
  const [userProfileUrl, setUserProfileUrl] = useState('')
  const [fullScreenMode, setFullScreenMode] = useState(false)
  const [artistCurrentPage, setArtistCurrentPage] = useState(1)
  const [artistRowCount, setArtistRowCount] = useState(12)
  const [collectorCurrentPage, setCollectorCurrentPage] = useState(1)
  const [collectorRowCount, setCollectorRowCount] = useState(12)
  const [isFetchingCreated, setIsFetchingCreated] = useState(false)
  const [isVisibleFetchingCreated, setIsVisibleFetchingCreated] = useState(false)
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
  }, [])

  useEffect(() => {
    ;async () => {
      if (!connected || !loginAndRefresh) return
      dispatch({ type: 'set', loginAndRefresh: false })
      await getArtistData(artistPublicKey, artistRowCount, artistCurrentPage, true, true)
      await getCollectorData(artistPublicKey, collectorRowCount, collectorCurrentPage, true, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, loginAndRefresh, publicArtistData])

  useEffect(() => {
    if (removeCollectionId.length > 0) {
      let newCollections = collections.filter(item => item.collection_id !== removeCollectionId)
      setCollections(newCollections)
      dispatch({ type: 'set', removeCollectionId: '' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeCollectionId])

  const reloadPage = () => {
    getArtistData(artistPublicKey, artistRowCount, artistCurrentPage, false, true)
    getCollectorData(artistPublicKey, artistRowCount, artistCurrentPage, false, true)
  }

  const handleNextPage = () => {
    const nextPage = artistCurrentPage + 1
    getArtistData(artistPublicKey, artistRowCount, nextPage)
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

        setArtistCurrentPage(current_page)

        if (collections.length > 0 && collections.length === response.collections.length)
          setIsVisibleFetchingCreated(false)

        setCollections(response.collections)

        if (categoryList.length === 0) setCategoryList(response.categories)
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
        setIsColletorLoaded(true)
        if (isString(response)) return
        setCollectorStatsInfo(response.stats)
      },
      error => {
        setIsColletorLoaded(true)
      }
    )
  }

  useEffect(() => {
    if (!artistPublicKey) return
    setHasLoading(true)
    resetData()
    getArtistData(artistPublicKey, artistRowCount, artistCurrentPage, true, true)
    getCollectorData(artistPublicKey, collectorRowCount, collectorCurrentPage, true, true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          artistStatsInfo={artistStatsInfo}
          collectorStatsInfo={collectorStatsInfo}
          categoryList={categoryList}
          isOwn={isOwn}
          isLoaded={isLoaded}
          isColletorLoaded={isColletorLoaded}
          setFullScreenView={setFullScreenView}
          wallet={artistInfo?.wallet_id}
          reloadPage={reloadPage}
          hasLoading={hasLoading}
        />
        <div className="w-full flex justify-center">
          <div className="g-container">
            <TabSection
              collections={collections}
              wallet={artistInfo?.wallet_id}
              isOwn={isOwn}
              handleNextPage={() => handleNextPage()}
              reloadPage={reloadPage}
              isVisibleFetchingCreated={isVisibleFetchingCreated}
              isFetchingCreated={isFetchingCreated}
              setIsFetchingCreated={setIsFetchingCreated}
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
    let publicArtistData = await fetch(`${process.env.BACKEND_URL}v1/users/username/${artistUsername}`).then(r =>
      r.json()
    )
    publicArtistData.profile_picture ||= AvatarImage.src
    publicArtistData.banner_picture ||= HeaderImage.src
    let artistPublicKey = publicArtistData.wallet_id
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
