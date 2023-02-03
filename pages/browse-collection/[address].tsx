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

const BrowseCollection = () => {
  const router = useRouter()
  const { address } = router.query
  const { connected, publicKey } = useWallet()

  const dispatch = useDispatch()

  const isLoading = useSelector<any>(state => state.isLoading)
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)

  const [data, setData] = useState({})
  const [nfts, setNfts] = useState([])
  const [collectionTitle, setCollectionTitle] = useState('')
  const [collectionImageUrl, setCollectionImageUrl] = useState('')
  const [collectionDescription, setCollectionDescription] = useState('')

  useEffect(() => {
    if (address !== undefined) {
      getCollectionData()
    }
  }, [address])

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
          getCollectionData()
        },
        error => {
          console.log(error)
        }
      )
    }
  }, [connected, loginAndRefresh])

  const getCollectionData = () => {
    collectionsAPI.getCollection(address).then(response => {
      if (!isString(response)) {
        setData(response)
        setCollectionTitle(`${response?.collection_name} | Foster Marketplace`)
        setCollectionImageUrl(response?.cover_image ?? '')
        setCollectionDescription(
          "Solana's first DAO governed NFT marketplace for art and music.\n" + 'Create, collect and curate the flavor.'
        )
      }
      dispatch({ type: 'set', isLoading: false })
    }),
      error => console.log(error)

    collectionsAPI.getCollectionNft(address).then(response => {
      if (response instanceof Array) {
        setNfts(response)
      }
    }),
      error => console.log(error)
  }

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
        <MainSection nfts={nfts} data={data} />
        <CollectionSection
          nfts={nfts}
          collectionId={address}
          artistId={data['minter_id']}
          artistName={data['artist_username']}
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
