import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { getListedNFTs } from "./auction.util";

export async function getCollectionByAddress(mx: Metaplex, address: string) {
  try {
    const nft = await mx.nfts().findByMint({
      mintAddress: new PublicKey(address)
    }).run()

    var collection = { ...nft, nfts: [] }

    const nfts = (await mx.nfts().findAllByCreator({
      creator: collection.creators[0].address
    }).run()).filter(nft => nft.collection?.verified && nft.collection?.address.toBase58() === address)

    const listedNFTs = await getListedNFTs(mx)

    collection.nfts = (
      await Promise.all(
        nfts.map(async nft => {
          var item = { ...nft, owner: null, offchainMetadata: null, price: null }
                   
          item.offchainMetadata = await fetch(nft.uri).then(r => r.json())
          
          listedNFTs.map(listedNFT => {
            /* @ts-ignore to get mintAddress*/
            if(listedNFT.asset.address.toString() === nft.mintAddress.toString())
              item.price = listedNFT.price.basisPoints.toNumber()
          })
          
          /* @ts-ignore to get mintAddress*/
          const largestAccounts = await mx.connection.getTokenLargestAccounts(nft.mintAddress)
          const largestAccountInfo = await mx.connection.getParsedAccountInfo(
            largestAccounts.value[0].address
          );

          /* @ts-ignore to get Parsed Account Info*/
          item.owner = largestAccountInfo.value.data.parsed.info.owner
          
          return item
        })
      )
    ).filter(nft => nft.offchainMetadata)

    return collection

  } catch(e) {
    console.log('failed to get collection')
    console.log(e)
  }

  return []
}

export async function getMyCollections(mx: Metaplex) {
  try {
    const nfts = await (await mx.nfts().findAllByOwner({ owner: mx.identity().publicKey }).run()).filter(nft => nft.collectionDetails)

    const listedNFTs = await getListedNFTs(mx)

    const collections = (
      await Promise.all(
        nfts.map(async nft => {
          var item = { ...nft, offchainMetadata: null, floorPrice: 0 }
          
          const listedCollection = listedNFTs.filter(listedNFT => 
            /* @ts-ignore to get mintAddress */
            listedNFT.asset.collection && (listedNFT.asset.collection.address.toString() === nft.mintAddress.toString())
          )

          var prices = [];

          if(listedCollection.length > 0)
            listedCollection.forEach(listedNFT => {
              if(listedNFT.price) prices.push(listedNFT.price.basisPoints.toNumber())
            });

          item.floorPrice = prices.length > 0 ? Math.min.apply(Math, prices) : 0

          try {
            item.offchainMetadata = await fetch(nft.uri).then(r => r.json())
          } catch (e) {
            console.log("failed to pull off chain metadata for collection")
            console.log(e)
          }

          return item
        })
      )
    ).filter(collection => collection.offchainMetadata)
    
    return collections
  } catch(e) {
    console.log('failed to get collections')
    console.log(e)
  }

  return []
}