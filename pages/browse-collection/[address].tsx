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

// redux
import { useWallet } from '@solana/wallet-adapter-react'

// call apis
import authAPI from 'apis/auth'
import collectionsAPI from 'apis/collections'
import { isString } from 'utils/helpers'

type BrowseCollectionProps = {
  collectionData?: any
  error?: string
}

const BrowseCollection = ({ collectionData }: BrowseCollectionProps) => {
  const dispatch = useDispatch()
  const { connected, publicKey } = useWallet()

  const isLoading = useSelector<any>(state => state.isLoading)
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)

  const [nfts, setNfts] = useState([])

  const address = collectionData?.collection_id

  useEffect(() => {
    if (address) {
      collectionsAPI
        .getCollectionNft(address)
        .then(response => {
          if (response instanceof Array) {
            setNfts(response)
            dispatch({ type: 'set', isLoading: false })
          }
        })
        .catch(console.error)
    }
  }, [address])

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
  // TODO: add default image url for broken images
  let collectionImageUrl = collectionData?.cover_image ?? ''
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
    return {
      collectionData: await fetch(`${process.env.BACKEND_URL}v1/collections/${collectionId}/public`).then(r =>
        r.json()
      ),
    }
  } catch (e: any) {
    console.error(`could not load collection: ${collectionId}: ${e.message}`)
    return {
      error: e.toString(),
    }
  }
}
