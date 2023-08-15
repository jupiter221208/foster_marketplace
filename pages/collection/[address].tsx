import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// next components
import Head from 'next/head'

// components
import ArtistLayout from 'components/Layout/ArtistLayout'
import MainSection from 'components/pages/BrowseCollection/MainSection'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'

// styles
import styles from './index.module.scss'

// solana
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex } from '@metaplex-foundation/js'
// redux
import { useWallet } from '@solana/wallet-adapter-react'

// call apis
import collectionsAPI from 'apis/collections'
import { isString } from 'utils/helpers'
import { getAbsoluteOgUrl } from 'utils/seo'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import { useViewport } from 'utils'
import { getSignMessageVerbiage, loginWithSigned } from 'utils/auth'
import TabSection from './TabSection'

type BrowseCollectionProps = {
  publicCollectionData?: any
  error?: string
}

const BrowseCollection = ({ publicCollectionData }: BrowseCollectionProps) => {
  const dispatch = useDispatch()
  const { connected, publicKey, signMessage } = useWallet()
  const viewport = useViewport()

  const isLoading = useSelector<any>(state => state.isLoading)
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)

  const [collectionData, setCollectionData] = useState(publicCollectionData)
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState(false)
  const address = collectionData?.collection_id
  const [activeListingLoaded, setActiveListingLoaded] = useState(false)
  const [liveAuctionLoaded, setLiveAuctionLoaded] = useState(false)

  useEffect(() => {
    setTimeout(
      () =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        }),
      1000
    )
    dispatch({ type: 'set', isLoading: true })
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!address) return
      try {
        setLoaded(false)
        let collectionNfts = await collectionsAPI.getCollectionNft(address)
        if (!isString(collectionNfts)) setNfts(collectionNfts)

        // if (isLoggedIn()) {
        //   let otherCollections = await collectionsAPI.getOtherCollections(collectionData?.minter_id)
        //   setOtherList(otherCollections)
        // }
      } catch (e: any) {
        console.error(e)
      } finally {
        setLoaded(true)
      }
    })()
  }, [address, publicCollectionData])

  useEffect(() => {
    ;(async () => {
      if (!connected || !loginAndRefresh) return
      dispatch({ type: 'set', loginAndRefresh: false })

      let signature = await signMessage(Buffer.from(getSignMessageVerbiage(publicKey)))
      loginWithSigned(publicKey, signature, dispatch)
    })()
  }, [connected, loginAndRefresh, signMessage])

  let collectionTitle = `${collectionData?.collection_name} | Foster Marketplace`
  let collectionImageUrl = getAbsoluteOgUrl(collectionData?.cover_image ?? DefaultNftBG.src)
  let collectionDescription =
    "Solana's first DAO governed NFT marketplace for art and music.\n" + 'Create, collect and curate the flavor.'

  useEffect(() => {
    if (activeListingLoaded && liveAuctionLoaded) {
      setTimeout(() => {
        dispatch({ type: 'set', isLoading: false })
      }, 1000)
    }
  }, [activeListingLoaded, liveAuctionLoaded])

  return (
    <div className="w-full">
      <Head>
        <title>{collectionTitle}</title>
        <meta property="description" content={collectionDescription} />

        <meta name="og:title" content={collectionTitle} />
        <meta property="og:description" content={collectionDescription} />
        <meta name="og:image" content={collectionImageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={collectionTitle} />
        <meta property="twitter:description" content={collectionDescription} />
        <meta property="twitter:image" content={collectionImageUrl} />

        <link rel="icon" href="/logo.png" />
      </Head>

      <div className={styles.container}>
        <div className={styles.topLeftEllipse}>
          {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
        </div>
        <div className={styles.topRightEllipse}>
          {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
        </div>

        <MainSection nfts={nfts} data={collectionData} publicKey={publicKey} loaded={loaded} />
        <div className="w-full flex justify-center">
          <div className="g-container">
            <TabSection
              nfts={nfts}
              collectionId={address}
              collectionName={collectionData?.collection_name}
              wallet={collectionData?.minter_id}
              artistName={collectionData?.artist_username}
              setActiveListingLoaded={setActiveListingLoaded}
              setLiveAuctionLoaded={setLiveAuctionLoaded}
            />
          </div>
        </div>
      </div>
      <FullScreenLoadingModal open={isLoading} />
    </div>
  )
}

export default BrowseCollection

BrowseCollection.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}

BrowseCollection.getInitialProps = async function ({ req, query }): Promise<BrowseCollectionProps> {
  let collectionId = query.address

  let cookies = req ? req.headers.cookie || '' : document.cookie
  let token = cookies ? cookies.split('token=')[1] : ''

  let publicCollectionData
  try {
    if (token && token.length > 0) {
      publicCollectionData = await fetch(`${process.env.BACKEND_URL}v1/collections/${collectionId}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(r => r.json())
        .catch(() => null)
    } else {
      publicCollectionData = await fetch(`${process.env.BACKEND_URL}v1/collections/${collectionId}/public`)
        .then(r => r.json())
        .catch(() => null)
    }
    if (!publicCollectionData) {
      let { name, json } = await Metaplex.make(new Connection(process.env.PROVIDER_URL))
        .nfts()
        .findByMint({ mintAddress: new PublicKey(collectionId) })
      publicCollectionData = {
        id: -1,
        collection_id: collectionId,
        minter_id: '',
        artist_username: '',
        collection_name: (name || json?.name) ?? '',
        description: json?.description ?? '',
        // TODO: use default banner image for collections not minted on foster
        banner_image: '',
        // TODO: use default cover image for collections with broken images
        cover_image: json?.image || '',
        minted_on_foster: false,
        views: 0,
        likes: 0,
        shares: 0,
        saves: 0,
        saved: null,
        categories: '',
        trading_volume: 0.0,
        created_at: '',
      }
    }

    return {
      publicCollectionData,
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load collection: ${collectionId}: ${e.message}`,
    }
  }
}
