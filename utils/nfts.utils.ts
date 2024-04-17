import {
  Metaplex,
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
import { TOKEN_PROGRAM_ID, getAccount, unpackAccount, Account } from '@solana/spl-token'
import { getListedNFTs, getMyListedNFTs } from './auction.util'
import { getShortAddress } from 'utils/wallet.util'
import { getMultipleAccountsInfoBatched } from 'utils'
import nftsAPI from 'apis/nfts'
import userAPI from 'apis/user'
import { bool } from 'aws-sdk/clients/signer'
import { Key } from '@metaplex-foundation/mpl-token-metadata'
import { NftData as NewNftData, NftCreator, NftData } from 'types/nft'

export async function getNFTOwner(metaplex: Metaplex, mint: PublicKey): Promise<PublicKey | null> {
  try {
    let tokenAccount = await getNFTTokenAccount(metaplex, mint)
    return tokenAccount.owner
  } catch (e: any) {
    console.warn(`could not fetch owner for ${mint}: ${e?.message ?? e}`)
    return null
  }
}

export async function getNFTTokenAccount(metaplex: Metaplex, mint: PublicKey): Promise<Account> {
  let { value: largestAccounts } = await metaplex.connection.getTokenLargestAccounts(mint)
  let ata = largestAccounts.find(({ amount }) => amount == '1')?.address
  if (!ata) throw new Error(`could not find token owner for ${mint}`)

  return getAccount(metaplex.connection, ata)
}

export async function getTokenAccountsByOwner(
  metaplex: Metaplex,
  owner: PublicKey = metaplex.identity().publicKey
): Promise<Account[]> {
  let response = await metaplex.connection.getTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  })
  return response.value.map(({ account, pubkey }) => unpackAccount(pubkey, account))
}

export function shouldUseDas(metaplex: Metaplex): boolean {
  let rpcEndpoint = metaplex.connection.rpcEndpoint
  let hostname = new URL(rpcEndpoint).hostname
  return hostname.endsWith('helius.xyz') || hostname.endsWith('helius-rpc.com') || hostname.endsWith('extrnode.com')
}

export function assertDasSupported(metaplex: Metaplex): void {
  if (!shouldUseDas(metaplex)) throw new Error(`needs DAS enabled rpc, found: ${metaplex.connection.rpcEndpoint}`)
}

export async function getMyNFTs(mx: Metaplex): Promise<NftData[]> {
  return shouldUseDas(mx) ? getMyNFTsDas(mx) : getMyNFTsMetaplex(mx)
}

export async function getMyNFTsMetaplex(mx: Metaplex): Promise<NftData[]> {
  let tokenAccounts = await getTokenAccountsByOwner(mx)

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

  return nonCompressedNfts.map(({ id, content, creators, grouping, group_definition, ownership, supply }) => {
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
    if (group_definition)
      collectionDetails = {
        size: group_definition.size,
      }

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

      image: imageCdn || image,
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

      supply: supply && {
        edition: supply.edition_number ?? null,
        current: supply.print_current_supply ?? null,
        max: supply.print_max_supply ?? null,
        parent: supply.master_edition_mint ?? null,
      },
    }
  })
}

export async function getMyCollectionNFTs(mx: Metaplex) {
  let nfts = await mx.nfts().findAllByOwner({ owner: mx.identity().publicKey })
  let identity = mx.identity().publicKey
  return nfts.filter(
    ({ updateAuthorityAddress, collectionDetails }) => identity.equals(updateAuthorityAddress) && collectionDetails
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
  profile_image: string
}

// export async function getNFTArtistInfo(nft: Sft | Nft): Promise<NFTArtistInfo | null> {
//   let artist = getNFTArtistPublicKey(nft)
//   if (!artist) return null

//   let response = await userAPI.get(artist.toString())
//   console.log(response, '============response==========')
//   let { username, profile_image } = response
//   // let { username, profile_image } = await userAPI.get(artist.toString())
//   let name = username ?? getShortAddress(artist)

//   return {
//     address: artist,
//     name,
//     profile_image
//   }
// }

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
          options: {
            showUnverifiedCollections: true,
          },
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

  let { content, grouping, group_definition, royalty, creators, supply } = dasResponse
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

    image: imageCdn || image,
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

    supply: supply && {
      edition: supply.edition_number ?? null,
      current: supply.print_current_supply ?? null,
      max: supply.print_max_supply ?? null,
      parent: supply.master_edition_mint ?? null,
    },

    collection: grouping
      .filter(({ group_key }) => group_key == 'collection')
      .map(({ group_value, verified }) => ({
        address: group_value,
        verified,
      }))[0],

    collectionDetails: group_definition && {
      size: group_definition.size,
    },

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

export async function getEditionDataOfNFTs(nfts: NftData[], mx: Metaplex): Promise<NftData[]> {
  const masterEditionAddresses = nfts.map(n =>
    mx
      .nfts()
      .pdas()
      .masterEdition({ mint: new PublicKey(n.mintAddress) })
  )
  const masterEditions = await getMultipleAccountsInfoBatched(mx.connection, masterEditionAddresses)

  for (let i = 0; i < nfts.length; i++) {
    if (!masterEditions[i]) continue
    const masterEditionData = toOriginalOrPrintEditionAccount({
      publicKey: masterEditionAddresses[i],
      ...masterEditions[i],
      lamports: lamports(masterEditions[i].lamports),
    }).data
    if ('maxSupply' in masterEditionData) {
      nfts[i].supply = {
        edition: 0,
        current: 0,
        max: masterEditionData.maxSupply ? Number(masterEditionData.maxSupply) : null,
        parent: null,
      }
    } else {
      nfts[i].supply = {
        edition: Number(masterEditionData.edition),
        current: 0,
        max: null,
        parent: null,
      }
    }
  }

  return nfts
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
      if (index > 0) {
        if (file.mime !== '' && file.mime !== undefined && file.mime !== null) {
          category = file.mime.split('/')[0] === 'model' ? 'vr' : file.mime
        } else if (file.uri.includes('ext=glb')) {
          category = 'vr'
        }
      }
    })
  } else {
    if (files.length === 0) {
      category = 'uknown'
    } else {
      category = files[0].mime
    }
  }
  return category || 'unknown'
}
