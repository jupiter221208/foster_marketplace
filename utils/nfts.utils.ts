import {
  Metaplex,
  TokenGpaBuilder,
  UnparsedAccount,
  lamports,
  toMetadataAccount,
  toMetadata,
  toOriginalOrPrintEditionAccount,
  toOriginalEditionAccount,
} from '@metaplex-foundation/js'
import type {
  Creator,
  Metadata,
  JsonMetadata,
  Nft,
  Sft,
  OriginalEditionAccountData,
  PrintEditionAccountData,
} from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, unpackAccount, Account } from '@solana/spl-token'
import { getListedNFTs, getMyListedNFTs } from './auction.util'
import { getShortAddress } from 'utils/wallet.util'
import { getMultipleAccountsInfoBatched } from 'utils'
import nftsAPI from 'apis/nfts'
import userAPI from 'apis/user'
import { bool } from 'aws-sdk/clients/signer'
import { Key } from '@metaplex-foundation/mpl-token-metadata'
import { NftData as NewNftData, NftCreator, NftData } from 'types/nft'

export async function getNFTOwner(metaplex: Metaplex, mintAddress: PublicKey): Promise<PublicKey | null> {
  let tokenAccounts = await new TokenGpaBuilder(metaplex)
    .whereMint(mintAddress)
    .whereAmount(1)
    .getAndMap(account =>
      unpackAccount(account.publicKey, {
        ...account,
        lamports: parseInt(account.lamports.basisPoints.toString()),
      })
    )

  if (tokenAccounts.length === 0) return null
  else {
    if (tokenAccounts.length > 1) {
      console.warn(`unexpected number of token accounts for ${mintAddress}: ${tokenAccounts.length}`)
      console.warn(tokenAccounts)
    }
    return tokenAccounts[0].owner
  }
}

export async function getNFTTokenAccount(metaplex: Metaplex, mint: PublicKey): Promise<Account> {
  let tokenAccounts = await new TokenGpaBuilder(metaplex)
    .whereAmount(1)
    .whereMint(mint)
    .getAndMap(account =>
      unpackAccount(account.publicKey, {
        ...account,
        lamports: parseInt(account.lamports.basisPoints.toString()),
      })
    )

  if (tokenAccounts.length !== 1) {
    console.log(tokenAccounts)
    throw new Error(`could not find token account for nft: ${mint}`)
  }

  return tokenAccounts[0]
}

export function shouldUseDas(metaplex: Metaplex): boolean {
  let rpcEndpoint = metaplex.connection.rpcEndpoint
  let hostname = new URL(rpcEndpoint).hostname
  return hostname.endsWith('helius.xyz') || hostname.endsWith('helius-rpc.com')
}

export function assertDasSupported(metaplex: Metaplex): void {
  if (!shouldUseDas(metaplex)) throw new Error(`needs DAS enabled rpc, found: ${metaplex.connection.rpcEndpoint}`)
}

export async function getMyNFTs(mx: Metaplex): Promise<NftData[]> {
  return shouldUseDas(mx) ? getMyNFTsDas(mx) : getMyNFTsMetaplex(mx)
}

export async function getMyNFTsMetaplex(mx: Metaplex): Promise<NftData[]> {
  let tokenAccounts = await mx.connection
    .getTokenAccountsByOwner(mx.identity().publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })
    .then(({ value }) => value.map(({ account, pubkey }) => unpackAccount(pubkey, account)))

  let metadataAddresses = tokenAccounts.map(({ mint }) => mx.nfts().pdas().metadata({ mint }))
  let metadataAccountInfos = await getMultipleAccountsInfoBatched(mx.connection, metadataAddresses)
  let metadatas = await Promise.all(
    metadataAccountInfos.map(async (accountInfo, index) => {
      if (!accountInfo) return null

      let nftAddress = tokenAccounts[index].mint
      try {
        let metadata = toMetadata(
          toMetadataAccount({
            ...accountInfo,
            publicKey: metadataAddresses[index],
            lamports: lamports(accountInfo.lamports),
          })
        )
        let json = await fetch(metadata.uri)
          .then(r => r.json())
          .catch(e => {
            console.warn(`failed to pull off-chain metadata for ${nftAddress}: ${metadata.uri}\n`, e)
          })

        if (json)
          metadata = {
            ...metadata,
            json,
            jsonLoaded: true,
          }

        return metadata
      } catch (e) {
        console.warn(`failed to parse metadata for ${nftAddress}\n`, e)
      }

      return null
    })
  )

  return metadatas
    .filter(metadata => metadata != null)
    .map(({ address, name, creators, collection, collectionDetails, json }, index) => {
      const creatorsInfo = creators
        ? creators.map(c => ({
            address: c.address.toBase58(),
            verified: c.verified,
            share: c.share,
          }))
        : null

      const collectionInfo = collection
        ? {
            address: collection.address?.toString(),
            verified: collection.verified,
          }
        : null

      return {
        mintAddress: tokenAccounts[index].mint?.toString(),
        metadataAddress: address.toBase58(),
        name: name || json?.name,
        description: json?.description,
        image: json?.image,
        animation_url: json?.animation_url as string | undefined,
        category: (json?.properties?.category || json?.category) as string | undefined,
        creators: creatorsInfo,
        collection: collectionInfo,
        collectionDetails: collectionDetails && {
          version: collectionDetails.version,
          size: collectionDetails.size?.toNumber(),
        },
        tokenAccount: {
          delegate: tokenAccounts[index].delegate?.toString(),
          isFrozen: tokenAccounts[index].isFrozen,
        },
      }
    })
}

export async function getMyNFTsDas(mx: Metaplex): Promise<NftData[]> {
  assertDasSupported(mx)

  let allNfts = []
  let limit = 1000
  for (let page = 1; ; page++) {
    let {
      result: { items },
    } = await fetch(mx.connection.rpcEndpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'getMyNFTsDas',
        method: 'getAssetsByOwner',
        params: {
          ownerAddress: mx.identity().publicKey,
          page,
          limit,
          options: {
            showUnverifiedCollections: true,
          },
        },
      }),
    }).then(r => r.json())

    allNfts.push(...items)

    if (items.length != limit) break
  }

  let nonCompressedNfts = allNfts.filter(({ burnt, compression }) => !burnt && !compression.compressed)

  // Fetch NFTs Edition Data
  const editionPdas = nonCompressedNfts.map(n =>
    mx
      .nfts()
      .pdas()
      .masterEdition({ mint: new PublicKey(n.id) })
  )

  const chunkedEditionPdas = chunkArray(editionPdas, 100)
  const chunkedNfts = chunkArray(nonCompressedNfts, 100)

  await Promise.all(
    chunkedEditionPdas.map(async (chunk, index) => {
      const editions = await mx.connection.getMultipleAccountsInfo(chunk)
      const parsedEditions = editions.map(e => toOriginalEditionAccount(e as unknown as UnparsedAccount))

      chunkedNfts[index] = chunkedNfts[index].map((n, i) => {
        return {
          ...n,
          supply: {
            max: parsedEditions[i].data.maxSupply ? Number(parsedEditions[i].data.maxSupply) : null,
          },
        }
      })
    })
  )
  const flattenedNfts = chunkedNfts.flat()

  return flattenedNfts.map(({ id, content, creators, grouping, ownership, supply }) => {
    let image = content.links.image
    let imageCdn = content.files.find(({ uri }) => uri == image)?.cdn_uri
    let animation_url = content.links.animation_url

    let collection = null
    for (let { group_key, group_value, verified } of grouping)
      if (group_key == 'collection') {
        collection = {
          address: new PublicKey(group_value),
          verified,
        }
        break
      }

    let collectionDetails = null
    if (false)
      collectionDetails = {
        size: 0,
      }

    // let maxSupply = supply.print_max_supply
    // let supply = supply.print_current_supply

    return {
      mintAddress: new PublicKey(id).toString(),
      metadataAddress: mx
        .nfts()
        .pdas()
        .metadata({ mint: new PublicKey(id) })
        .toBase58(),

      name: content.metadata.name,
      symbol: content.metadata.symbol,
      description: content.metadata.description,

      image: imageCdn ?? image,
      animation_url,
      original: {
        image,
        animation_url,
      },
      optimized: {
        image: imageCdn,
      },

      category: determineCategory(content.files),
      creators: creators.map(({ address, share, verified }) => ({
        address: new PublicKey(address)?.toString(),
        share,
        verified,
      })),
      attributes: content.metadata.attributes,
      collection,
      collectionDetails,
      tokenAccount: {
        delegate: ownership.delegate?.toString(),
        isFrozen: ownership.frozen,
      },

      supply,
    }
  })
}

export async function getMyCollectionNFTs(mx: Metaplex) {
  let nfts = await mx.nfts().findAllByOwner({ owner: mx.identity().publicKey })
  let identity = mx.identity().publicKey
  return nfts.filter(
    ({ updateAuthorityAddress, collectionDetails }) =>
      identity.equals(updateAuthorityAddress) && collectionDetails?.version === 'V1'
  )
}

export async function getNFTByAddress(mx: Metaplex, mintAddress: PublicKey) {
  const nft = await mx.nfts().findByMint({ mintAddress })

  const owner = await getNFTOwner(mx, mintAddress)

  return {
    owner,
    ...nft,
  }
}

export function getNFTCategories(nft): string[] {
  return nft?.attributes?.filter(({ trait_type }) => trait_type === 'category').map(({ value }) => value) ?? []
}

export function getNFTArtistPublicKey({ creators }: { creators: Creator[] }): PublicKey | null {
  // try first creator as artist
  // if it's a pda (candy machine) then use second creator as artist
  // else return null
  if (creators[0] && PublicKey.isOnCurve(creators[0].address)) return creators[0].address
  else if (creators[1]) return creators[1].address

  return null
}

export interface NFTArtistInfo {
  address: PublicKey
  name: string
}

export async function getNFTArtistInfo(nft: Sft | Nft): Promise<NFTArtistInfo | null> {
  let artist = getNFTArtistPublicKey(nft)
  if (!artist) return null

  let { username } = await userAPI.get(artist.toString())
  let name = username ?? getShortAddress(artist)

  return {
    address: artist,
    name,
  }
}

export interface NFTSocialInfo {
  likes: number
  shares: number
  saves: number
  liked: bool
  saved: bool
  sharedSocial: bool
}

export async function getNFTSocialInfo(mint: PublicKey): Promise<NFTSocialInfo> {
  let { likes, shares, saves, liked, saved, shared } = await nftsAPI.getDetail(mint.toBase58())
  let sharedSocial = shared.facebook || shared.twitter || shared.telegram
  return { likes, shares, saves, liked, saved, sharedSocial }
}

export async function getNftFromDAS(metaplex: Metaplex, address: string, maxRetries = 3): Promise<NftData> {
  assertDasSupported(metaplex)

  let dasResponse = null
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(metaplex.connection.rpcEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAsset',
        params: {
          id: address,
        },
      }),
    })
    const { result } = await response.json()
    if (result) {
      dasResponse = result
      break
    }
    console.log(`Attempt ${i + 1} did not return data.`)
    // If this isn't the last attempt, wait 1 second before trying again
    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  if (!dasResponse) {
    console.error('Failed to fetch NFT data after', maxRetries, 'attempts')
    return null
  }

  let { content, grouping, royalty, creators } = dasResponse
  let image = content.links.image
  let imageCdn = content.files.find(({ uri }) => uri == image)?.cdn_uri
  let animation_url = content.links.animation_url
  let category = determineCategory(content.files)
  return {
    mintAddress: address,
    metadataAddress: metaplex
      .nfts()
      .pdas()
      .metadata({ mint: new PublicKey(address) })
      .toBase58(),

    name: content.metadata.name,
    symbol: content.metadata.symbol,
    description: content.metadata.description,
    uri: content.json_uri,

    image: imageCdn ?? image,
    animation_url,
    original: {
      image,
      animation_url,
    },
    optimized: {
      image: imageCdn,
    },

    sellerFeeBasisPoints: royalty.basis_points,
    creators,
    category,
    attributes: content.metadata.attributes,

    collection: grouping
      .filter(({ group_key }) => group_key == 'collection')
      .map(({ group_value }) => ({
        address: group_value,
        verified: true,
      }))[0],

    content,
    properties: {
      category,
      files: content.files.map(({ mime, uri }) => ({ type: mime, uri })),
    },
  }
}

export async function getNftFromRpc(metaplex, address: string): Promise<NftData> {
  let nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(address) })

  return {
    mintAddress: address,
    metadataAddress: nft.metadataAddress.toBase58(),

    name: nft.name,
    symbol: nft.symbol,
    description: nft.json?.description,
    uri: nft.uri,

    image: nft.json?.image,
    animation_url: nft.json?.animation_url,
    original: {
      image: nft.json?.image,
      animation_url: nft.json?.animation_url,
    },

    sellerFeeBasisPoints: nft.sellerFeeBasisPoints,
    creators: nft.creators.map(({ address, share, verified }) => ({
      address: address.toBase58(),
      share,
      verified,
    })),
    attributes: nft?.json?.attributes ?? [],

    collection: nft.collection?.verified
      ? {
          address: nft.collection.address.toBase58(),
          verified: true,
        }
      : undefined,

    json: nft.json,
    properties: nft.json?.properties,
  }
}

type determineCategoryType = {
  uri: string
  mime: string
  cdn_uri: string
}[]

export function determineCategory(files: determineCategoryType) {
  let category: string
  if (files.length > 1) {
    files.map((file, index) => {
      if (index > 0 && (file.mime !== '' || file.mime !== undefined || file.mime !== null)) {
        category = file.mime.split('/')[0] === 'model' ? 'vr' : file.mime.split('/')[0]
      }
    })
  } else {
    if (files.length === 0) {
      category = 'image'
    } else {
      category = files[0].mime.split('/')[0]
    }
  }

  return category || 'image'
}

function chunkArray(array, chunkSize) {
  let result = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
}
