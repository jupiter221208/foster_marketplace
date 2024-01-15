import { Metaplex } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import collectionsAPI from 'apis/collections'
import { getListedNFTs } from './auction.util'

export async function getCollectionByAddress(mx: Metaplex, address: string) {
  try {
    const nft = await mx
      .nfts()
      .findByMint({
        mintAddress: new PublicKey(address),
      })

    let collection = { ...nft, nfts: [] }

    const nfts = (
      await mx
        .nfts()
        .findAllByCreator({
          creator: collection.creators[0].address,
        })
    ).filter(nft => nft.collection?.verified && nft.collection?.address.toBase58() === address)

    const listedNFTs = await getListedNFTs(mx)

    collection.nfts = (
      await Promise.all(
        nfts.map(async nft => {
          let item = { ...nft, owner: null, json: null, price: null }

          item.json = await fetch(nft.uri).then(r => r.json())

          listedNFTs.map(listedNFT => {
            /* @ts-ignore to get mintAddress*/
            if (listedNFT.asset.address.toString() === nft.mintAddress.toString())
              item.price = listedNFT.price.basisPoints.toNumber()
          })

          /* @ts-ignore to get mintAddress*/
          const largestAccounts = await mx.connection.getTokenLargestAccounts(nft.mintAddress)
          const largestAccountInfo = await mx.connection.getParsedAccountInfo(largestAccounts.value[0].address)

          /* @ts-ignore to get Parsed Account Info*/
          item.owner = largestAccountInfo.value.data.parsed.info.owner

          return item
        })
      )
    ).filter(nft => nft.json)

    return collection
  } catch (e) {
    console.log('failed to get collection', e)
  }

  return []
}

export async function getMyCollections(mx: Metaplex) {
  try {
    const nfts = await (
      await mx.nfts().findAllByOwner({ owner: mx.identity().publicKey })
    ).filter(nft => nft.collectionDetails)

    const collections = (
      await Promise.all(
        nfts.map(async nft => {
          let item = { ...nft, json: null }
          try {
            item.json = await fetch(nft.uri).then(r => r.json())
          } catch (e) {
            console.log('failed to pull off chain metadata for collection', e)
          }
          return item
        })
      )
    ).filter(collection => collection.json)

    return collections
  } catch (e) {
    console.log('failed to get collections', e)
  }

  return []
}

export interface EACollectionInfo {
  artist: {
    id: string
    name: string
    slug: string
  }
  assets: {
    bannerPath: string
    thumbnailPath: string
  }
  flags: {
    isCertified: boolean
    isCurated: boolean
    isNsfw: boolean
    isOneOfOne: boolean
  }
  info: {
    name: string
    description: string
    primaryCategory: string
    tags: string[]
  }
  createdAt: string
  lastVersionNumMints: number
  lastVersionTimestamp: string
  mints: string[]
  ordinal: number
  seriesId: string
  status: string
}

export async function getEACollectionInfo(eaCollectionUrl: string): Promise<EACollectionInfo> {
  let { hostname, pathname } = new URL(eaCollectionUrl)
  if (hostname != 'exchange.art') throw new Error(`expected url hostname to be exchange.art, got ${hostname}`)

  let [eaSeriesName] = pathname.match(/(?<=\/series\/)[^/]+/) ?? []
  if (!eaSeriesName) throw new Error(`could not extract series name from ${pathname}`)
  eaSeriesName = decodeURIComponent(eaSeriesName)

  // fix asset urls
  let [collectionInfo] = await collectionsAPI.exchangeArtInfo(eaSeriesName)
  for (let asset in collectionInfo.assets)
    collectionInfo.assets[asset] = new URL(collectionInfo.assets[asset], 'https://images-cdn.exchange.art/').toString()

  return collectionInfo
}
