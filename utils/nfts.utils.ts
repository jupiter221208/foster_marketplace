import {
  Metaplex,
  TokenGpaBuilder,
  UnparsedAccount,
  lamports,
  toMetadataAccount,
  toMetadata,
} from '@metaplex-foundation/js'
import type { Creator, Metadata, JsonMetadata, Nft, Sft } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, unpackAccount, Account } from '@solana/spl-token'
import { getListedNFTs, getMyListedNFTs } from './auction.util'
import { getShortAddress } from 'utils/wallet.util'
import { getMultipleAccountsInfoBatched } from 'utils'
import nftsAPI from 'apis/nfts'
import userAPI from 'apis/user'
import { bool } from 'aws-sdk/clients/signer'
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
  return new URL(rpcEndpoint).hostname.endsWith('helius.xyz')
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
    .map(({ name, creators, collection, collectionDetails, json }, index) => {
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

      console.log(collection)
      console.log(collectionInfo)

      return {
        mintAddress: tokenAccounts[index].mint?.toString(),
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

  return nonCompressedNfts.map(({ id, content, creators, grouping, ownership, supply }) => {
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
      mintAddress: new PublicKey(id)?.toString(),
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

      category: '',
      creators: creators.map(({ address, share, verified }) => ({
        address: new PublicKey(address)?.toString(),
        share,
        verified,
      })),
      attributes: content.metadata.attributes,
      collection,
      collectionDetails,
      tokenAccount: {
        delegate: ownership.delegated?.toString(),
        isFrozen: ownership.frozen,
      },
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
  return nft?.json?.attributes?.filter(({ trait_type }) => trait_type === 'category').map(({ value }) => value) ?? []
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

export async function getNftFromDAS(address): Promise<NftData> {
  try {
    const response = await fetch(process.env.PROVIDER_URL, {
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

    return result
  } catch (error) {
    console.log('Error while fetching nft: ', error)
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
    category = files[0].mime.split('/')[0]
  }

  return category || 'image'
}
