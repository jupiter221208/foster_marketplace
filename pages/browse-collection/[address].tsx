import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// next components
import Head from 'next/head'

// components
import ArtistLayout from 'components/Layout/ArtistLayout'
import MainSection from 'components/pages/BrowseCollection/MainSection'
import CollectionSection from 'components/pages/BrowseCollection/CollectionSection'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

// styles
import styles from './index.module.scss'

// router
import { useRouter } from 'next/router'

// solana
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex } from '@metaplex-foundation/js'
// redux
import { useWallet } from '@solana/wallet-adapter-react'

// call apis
import authAPI from 'apis/auth'
import collectionsAPI from 'apis/collections'
import { isString, isLoggedIn } from 'utils/helpers'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'

type BrowseCollectionProps = {
  publicCollectionData?: any
  error?: string
}

const BrowseCollection = ({ publicCollectionData }: BrowseCollectionProps) => {
  const dispatch = useDispatch()
  const { connected, publicKey } = useWallet()

  const isLoading = useSelector<any>(state => state.isLoading)
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)

  const [collectionData, setCollectionData] = useState(publicCollectionData)
  const [nfts, setNfts] = useState([])

  const address = collectionData?.collection_id

  useEffect(() => {
    ;(async () => {
      if (!address) return

      try {
        dispatch({ type: 'set', isLoading: true })
        let collectionNfts = await collectionsAPI.getCollectionNft(address)
        if (!isString(collectionNfts)) setNfts(collectionNfts)

        if (isLoggedIn()) {
          let collectionData = await collectionsAPI.getCollection(address)
          if (!isString(collectionData)) setCollectionData(collectionData)
        }
      } catch (e: any) {
        console.error(e)
      } finally {
        dispatch({ type: 'set', isLoading: false })
      }
    })()
  }, [address, publicCollectionData])

  useEffect(() => {
    if (connected && loginAndRefresh) {
      dispatch({ type: 'set', loginAndRefresh: false })
      authAPI.login({ wallet_id: publicKey?.toBase58() || '' }).then(
        response => {
          if (response.new_user) dispatch({ type: 'set', profileSetup: true })
          dispatch({ type: 'set', profileInfo: response.user })
          dispatch({ type: 'set', bidWalletLock: response.bid_wallet_lock })
          dispatch({ type: 'set', offerWalletLock: response.offer_wallet_lock })
        },
        error => {
          console.log(error)
        }
      )
    }
  }, [connected, loginAndRefresh])

  let collectionTitle = `${collectionData?.collection_name} | Foster Marketplace`
  let collectionImageUrl = collectionData?.cover_image ?? DefaultNftBG.src
  let collectionDescription =
    "Solana's first DAO governed NFT marketplace for art and music.\n" + 'Create, collect and curate the flavor.'

  return (
    <div className="g-container">
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

        <link rel="icon" href="/logo.svg" />
      </Head>

      <div className={styles.container}>
        <MainSection nfts={nfts} data={collectionData} />
        <CollectionSection
          nfts={nfts}
          collectionId={address}
          artistId={collectionData?.minter_id}
          artistName={collectionData?.artist_username}
        />
      </div>
      <FullScreenLoadingModal open={isLoading} />
    </div>
  )
}

export default BrowseCollection

BrowseCollection.getLayout = function getLayout(page) {
  return <ArtistLayout>{page}</ArtistLayout>
}

BrowseCollection.getInitialProps = async function ({ query }): Promise<BrowseCollectionProps> {
  let collectionId = query.address
  try {
    let publicCollectionData = await fetch(`${process.env.BACKEND_URL}v1/collections/${collectionId}/public`)
      .then(r => r.json())
      .catch(() => null)

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
