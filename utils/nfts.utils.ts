import { Metaplex, TokenGpaBuilder, UnparsedAccount } from '@metaplex-foundation/js'
import type { Metadata, Nft, Sft } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { unpackAccount } from '@solana/spl-token'
import { getListedNFTs, getMyListedNFTs } from './auction.util'
import nftsAPI from 'apis/nfts'

export async function getNFTOwner(mx: Metaplex, mintAddress: string) {
  /* @ts-ignore to get mintAddress*/
  const largestAccounts = await mx.connection.getTokenLargestAccounts(new PublicKey(mintAddress))
  const largestAccountInfo = await mx.connection.getParsedAccountInfo(largestAccounts.value[0].address)

  /* @ts-ignore to get Parsed Account Info*/
  return largestAccountInfo.value.data.parsed.info.owner
}

type GetMyNFTsOutputElement = ((Metadata | Nft | Sft) & { offchainMetadata?: any })
type GetMyNFTsOutput = GetMyNFTsOutputElement[]

export async function getMyNFTs(mx: Metaplex): Promise<GetMyNFTsOutput> {
  let tokenAccounts = await new TokenGpaBuilder(mx)
    .whereOwner(mx.identity().publicKey)
    .whereAmount(1)
    .getAndMap(
      (account) => unpackAccount(
        account.publicKey,
        {
          ...account,
          lamports: parseInt(account.lamports.basisPoints.toString())
        }
      )
    )

  let nfts = await mx
    .nfts()
    .findAllByMintList({ mints: tokenAccounts.map(({ mint }) => mint) })

  let userNfts: GetMyNFTsOutput = []
  for(let i = 0; i < tokenAccounts.length; i++){
    if(!nfts[i] || tokenAccounts[i].delegate)
      continue;

    userNfts.push(nfts[i])
  }

  await Promise.all(
    userNfts.map(async (nft) => {
      nft.offchainMetadata = null
      try{
        nft.offchainMetadata = await fetch(nft.uri).then((r) => r.json())
      }
      catch(e){
        console.error(`failed to pull off chain metadata for ${nft.address}: ${nft.uri}`)
        console.error(e)
      }
    })
  )

  return userNfts.filter(({ offchainMetadata }) => offchainMetadata)
}

export async function getMyCollectionNFTs(mx: Metaplex) {
  let nfts = await mx.nfts().findAllByOwner({ owner: mx.identity().publicKey })
  let identity = mx.identity().publicKey
  return nfts.filter(
    ({ updateAuthorityAddress, collectionDetails }) =>
      identity.equals(updateAuthorityAddress) &&
      collectionDetails?.version === 'V1'
  )
}

export async function getNFTDetailsByAddress(mx: Metaplex, id: string) {
  const res = await getListedNFTs(mx)
  const listedNFTs = (res === undefined ? [] : res).filter(nft => nft.asset.address.toString() === id)

  const owner = await getNFTOwner(mx, id)

  if (listedNFTs.length <= 0) {
    const nft = await mx
      .nfts()
      .findByMint({ mintAddress: new PublicKey(id) })

    return {
      asset: {
        ...nft,
        owner,
      },
    }
  }

  return {
    ...listedNFTs[0],
    asset: {
      ...listedNFTs[0].asset,
      owner,
    },
  }
}

export async function getGeneralNFTDetails(mx: Metaplex, id: string) {
  const nft = await mx
    .nfts()
    .findByMint({ mintAddress: new PublicKey(id) })
  const owner = await getNFTOwner(mx, id)
  return {
    asset: {
      ...nft,
      owner,
    },
  }
}

export async function getNFTByAddress(mx: Metaplex, mintAddress: PublicKey) {
  const nft = await mx.nfts().findByMint({ mintAddress })

  const owner = await getNFTOwner(mx, mintAddress.toString())

  return {
    owner,
    ...nft,
  }
}
