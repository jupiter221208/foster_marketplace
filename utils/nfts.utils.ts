import { Metaplex, TokenGpaBuilder, UnparsedAccount } from '@metaplex-foundation/js'
import type { Creator, Metadata, Nft, Sft } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { unpackAccount, Account } from '@solana/spl-token'
import { getListedNFTs, getMyListedNFTs } from './auction.util'
import { getShortAddress } from 'utils/wallet.util'
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

export type GetMyNFTsOutputElement = Metadata | Nft | Sft
export type GetMyNFTsOutput = GetMyNFTsOutputElement[]

export async function getMyNFTs(mx: Metaplex): Promise<GetMyNFTsOutput> {
  let tokenAccounts = await new TokenGpaBuilder(mx)
    .whereOwner(mx.identity().publicKey)
    .whereAmount(1)
    .whereDoesntHaveDelegate()
    .getAndMap(account =>
      unpackAccount(account.publicKey, {
        ...account,
        lamports: parseInt(account.lamports.basisPoints.toString()),
      })
    )

  let nfts = await mx.nfts().findAllByMintList({ mints: tokenAccounts.map(({ mint }) => mint) })

  let userNfts: GetMyNFTsOutput = []
  for (let i = 0; i < tokenAccounts.length; i++) {
    if (!nfts[i] || tokenAccounts[i].isFrozen) continue

    userNfts.push(nfts[i])
  }

  await Promise.all(
    userNfts.map(async nft => {
      try {
        if (new URL(nft.uri).origin.includes('ftx.us')) {
          console.warn(`skipping ftx nft ${nft.address}: ${nft.uri}`)
          return
        }
        // @ts-ignore
        nft.json = await fetch(nft.uri).then(r => r.json())
        // @ts-ignore
        nft.jsonLoaded = true
      } catch (e) {
        console.warn(`failed to pull off chain metadata for ${nft.address}: ${nft.uri}\n`, e)
      }
    })
  )

  return userNfts.filter(({ jsonLoaded }) => jsonLoaded)
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
