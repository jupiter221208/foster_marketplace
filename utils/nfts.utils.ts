import { Metaplex } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { getListedNFTs, getMyListedNFTs } from './auction.util'
import nftsAPI from 'apis/nfts'

export async function getNFTOwner(mx: Metaplex, mintAddress: string) {
  /* @ts-ignore to get mintAddress*/
  const largestAccounts = await mx.connection.getTokenLargestAccounts(new PublicKey(mintAddress))
  const largestAccountInfo = await mx.connection.getParsedAccountInfo(largestAccounts.value[0].address)

  /* @ts-ignore to get Parsed Account Info*/
  return largestAccountInfo.value.data.parsed.info.owner
}

export async function getMyNFTs(mx: Metaplex) {
  let nfts = await mx.nfts().findAllByOwner({ owner: mx.identity().publicKey })

  const res = await nftsAPI.filteredNfts().then(res => res)
  const listedNFTs = res === undefined ? [] : res

  nfts = nfts.filter(
    nft =>
      /* @ts-ignore to get mintAddress*/
      !listedNFTs.some(listedNFT => listedNFT.toString() === nft.mintAddress.toString()) && !nft.collectionDetails
  )

  const myNFTs = (
    await Promise.all(
      nfts.map(async nft => {
        let item = { ...nft, offchainMetadata: null }

        try {
          item.offchainMetadata = await fetch(nft.uri).then(r => r.json())
        } catch (e) {
          console.log('failed to pull off chain metadata for collection')
          console.log(e)
        }

        return item
      })
    )
  ).filter(nft => nft.offchainMetadata)

  return myNFTs
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
