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

export interface NftData {
  mintAddress: PublicKey
  name?: string
  description?: string
  image?: string
  animation_url?: string
  category?: string
  creators?: NftCreator[]
  collection?: {
    address: PublicKey
    verified: boolean
  }
  collectionDetails?: {
    version: string
    size: number
  }
  tokenAccount: {
    address: PublicKey
    delegate: PublicKey | null
    isFrozen: boolean
  }
}

export interface NftCreator {
  address: PublicKey
  share: number
  verified: boolean
}

export interface NftAndCollectionData extends NftData {
  // TODO: add collection info
  // collectionName
}

export async function getMyNFTs(mx: Metaplex): Promise<NftData[]> {
  let tokenAccounts = await mx.connection
    .getTokenAccountsByOwner(mx.identity().publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })
    .then(({ value }) => value.map(({ account, pubkey }) => unpackAccount(pubkey, account)))

  let metadataAddresses = tokenAccounts.map(({ mint }) => mx.nfts().pdas().metadata({ mint }))
  let metadataAccountInfos = await getMultipleAccountsInfoBatched(mx.connection, metadataAddresses)
  let metadatas: (Metadata<JsonMetadata<string>> | null)[] = await Promise.all(
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
    .map(({ name, creators, collection, collectionDetails, json }, index) => ({
      mintAddress: tokenAccounts[index].mint,
      name: name || json?.name,
      description: json?.description,
      image: json?.image,
      animation_url: json?.animation_url as string | undefined,
      category: (json?.properties?.category || json?.category) as string | undefined,
      creators,
      collection,
      collectionDetails: collectionDetails && {
        version: collectionDetails.version,
        size: collectionDetails.size?.toNumber(),
      },
      tokenAccount: {
        address: tokenAccounts[index].address,
        delegate: tokenAccounts[index].delegate,
        isFrozen: tokenAccounts[index].isFrozen,
      },
    }))
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

export function getNFTCategories(nft: Sft | Nft | null): string[] {
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
