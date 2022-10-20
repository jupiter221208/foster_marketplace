import { Metaplex, sol } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'
import { getListedNFTs, getMyListedNFTs } from './auction.util'

export async function getMyNFTs(mx: Metaplex) {
  var nfts = await mx.nfts().findAllByOwner({ owner: mx.identity().publicKey }).run()

  const listedNFTs = await getMyListedNFTs(mx)

  nfts = nfts.filter(
    nft =>
      /* @ts-ignore to get mintAddress*/
      !listedNFTs.some(listedNFT => listedNFT.asset.address.toString() === nft.mintAddress.toString()) &&
      !nft.collectionDetails
  )

  const myNFTs = (
    await Promise.all(
      nfts.map(async nft => {
        var item = { ...nft, offchainMetadata: null }

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
  const listedNFTs = await (await getListedNFTs(mx)).filter(nft => nft.asset.address.toString() === id)

  if (listedNFTs.length <= 0) {
    const nft = await mx
      .nfts()
      .findByMint({ mintAddress: new PublicKey(id) })
      .run()

    return {
      asset: nft,
    }
  }

  return listedNFTs[0]
}

export async function getGeneralNFTDetails(mx: Metaplex, id: string) {
  const nft = await mx
    .nfts()
    .findByMint({ mintAddress: new PublicKey(id) })
    .run()

  return {
    asset: nft,
  }
}
