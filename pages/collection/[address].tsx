import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// next components
import Head from 'next/head'

// components
import ArtistLayout from 'components/Layout/ArtistLayout'
import MainSection from 'components/pages/BrowseCollection/MainSection'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

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
import { getEACollectionInfo } from 'utils/collection.util'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import { parseCookies } from 'utils'
import TabSection from './TabSection'
import EASection from './EASection'
import { NftData } from 'types/nft'

type BrowseCollectionProps = {
  publicCollectionData?: any
  error?: string
}

const BrowseCollection = ({ publicCollectionData }: BrowseCollectionProps) => {
  const dispatch = useDispatch()
  const { connected, publicKey } = useWallet()

  const isLoading = useSelector<any>(state => state.isLoading)
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)

  const [collectionData, setCollectionData] = useState()
  const [nfts, setNfts] = useState<NftData[]>([])
  const [loaded, setLoaded] = useState(false)
  const address = publicCollectionData?.collection_id

  const [hasloading, setHasLoading] = useState(false)
  const [showEAPreview, setShowEAPreview] = useState(false)
  const [importMintList, setImportMintList] = useState<string[]>([])

  useEffect(() => {
    setTimeout(
      () =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        }),
      1000
    )
  }, [])

  useEffect(() => {
    ;(async () => {
      setCollectionData(publicCollectionData)
      dispatch({ type: 'set', isLoading: false })

      if (!address) return
      try {
        setLoaded(false)
        setHasLoading(true)

        const response = await fetch(process.env.PROVIDER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'my-id',
            method: 'getAssetsByGroup',
            params: {
              groupKey: 'collection',
              groupValue: address,
              page: 1,
              limit: 1000,
            },
          }),
        })
        const { result } = await response.json()

        let collectionNfts = await collectionsAPI.getCollectionNft(address)

        let sortedCollectionNfts = result.items
          .map(r => {
            return collectionNfts.find(nft => nft.token_id === r.id)
          })
          .filter(nft => nft !== undefined)

        if (sortedCollectionNfts && result) {
          let newNftsArr = [...result.items]
          sortedCollectionNfts.map((data, index) => {
            newNftsArr[index].artist_username = data.artist_username
            newNftsArr[index].artist_id = data.artist_id
            newNftsArr[index].list_price = data.list_price
            newNftsArr[index].start_time = data.start_time
            newNftsArr[index].end_time = data.end_time
            newNftsArr[index].current_bid = data.current_bid
          })
          setNfts(sortedCollectionNfts)
          fetchNftData(result.items)
        }

        setHasLoading(false)
      } catch (e: any) {
        console.error(e)
      } finally {
        setLoaded(true)
      }
    })()
  }, [address, publicCollectionData])

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const fetchNftData = nfts => {
    if (nfts.length > 0) {
      ;(async () => {
        for (let index = 0; index < nfts.length; index++) {
          let data = nfts[index]
          fetch(`/nft/${data.id}`).then(e => e.text())
          if (index % 3 == 2) {
            await sleep(1000)
          }
        }
      })()
    }
  }

  const handleCollectionImport = async ({ eaUrl, mintList }) => {
    if (eaUrl)
      try {
        let { mints } = await getEACollectionInfo(eaUrl)
        setImportMintList(mints)
      } catch (e: any) {
        console.error(`could not fetch EA collection info: ${e?.message}`)
        // TODO: show error
        return
      }
    else setImportMintList(Array.from(new Set(mintList)))

    setShowEAPreview(true)
  }

  const successImporting = () => {
    collectionsAPI.getCollectionNft(address).then(
      response => {
        setNfts(response)
        setShowEAPreview(false)
      },
      error => {}
    )
  }

  useEffect(() => {
    ;(async () => {
      if (!connected || !loginAndRefresh) return
      dispatch({ type: 'set', loginAndRefresh: false })
    })()
  }, [connected, loginAndRefresh])

  let collectionTitle = `${publicCollectionData?.collection_name} | Foster Marketplace`
  let collectionImageUrl = getAbsoluteOgUrl(publicCollectionData?.cover_image ?? DefaultNftBG.src)
  let collectionDescription = publicCollectionData?.description ?? ''
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
        {showEAPreview ? (
          <EASection
            mintList={importMintList}
            setMintList={setImportMintList}
            onBack={() => setShowEAPreview(false)}
            onSuccess={() => successImporting()}
            coverUrl={publicCollectionData?.cover_image}
          />
        ) : (
          <div className="w-full">
            <MainSection
              nfts={nfts}
              data={collectionData}
              hasloading={hasloading}
              publicKey={publicKey}
              loaded={loaded}
            />
            <div className="w-full flex justify-center">
              <div className="g-container">
                <TabSection
                  nfts={nfts}
                  collectionId={address}
                  minter={publicCollectionData?.minter_id}
                  collectionName={publicCollectionData?.collection_name}
                  coverUrl={publicCollectionData?.cover_image}
                  artistName={publicCollectionData?.artist_username}
                  description={publicCollectionData?.description}
                  categories={publicCollectionData?.categories}
                  handleCollectionImport={handleCollectionImport}
                />
              </div>
            </div>
          </div>
        )}
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

  let documentCookie = typeof document == 'undefined' ? undefined : document.cookie
  let cookies = parseCookies(req?.headers.cookie ?? documentCookie ?? '')
  let token = cookies.token

  let publicCollectionData
  try {
    if (token) {
      publicCollectionData = await fetch(`${process.env.BACKEND_URL}v1/collections/${collectionId}`, {
        headers: {
          accept: 'application/json',
          authorization: `Bearer ${token}`,
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
