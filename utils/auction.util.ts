import { Metaplex, sol } from '@metaplex-foundation/js'
import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js'
import { getNFTOwner } from './nfts.utils'

const AUCTION_HOUSE_ADDRESS = process.env.AUCTION_HOUSE_ADDRESS
const AUCTION_HOUSE_PUBLIC_KEY = process.env.AUCTION_HOUSE_PUBLIC_KEY

const LISTING_RECEIPT_SIZE =
  8 + //key
  32 + // trade_state
  32 + // bookkeeper
  32 + // auction_house
  32 + // seller
  32 + // metadata
  1 +
  32 + // purchase_receipt
  8 + // price
  8 + // token_size
  1 + // bump
  1 + // trade_state_bump
  8 + // created_at
  1 +
  8 // canceled_at;

const ListingReceiptPosition = {
  Key: 0,
  TradeState: 8,
  BookKeeper: 8 + 32,
  AuctionHouse: 8 + 32 + 32,
  Seller: 8 + 32 + 32 + 32,
  Metadata: 8 + 32 + 32 + 32 + 32,
}

const BID_RECEIPT_SIZE =
  8 + //key
  32 + // trade_state
  32 + // bookkeeper
  32 + // auction_house
  32 + // buyer
  32 + // metadata
  1 +
  32 + // token_account
  1 +
  32 + // purchase_receipt
  8 + // price
  8 + // token_size
  1 + // bump
  1 + // trade_state_bump
  8 + // created_at
  1 +
  8 // canceled_at

const BidReceiptPosition = {
  Key: 0,
  TradeState: 8,
  BookKeeper: 8 + 32,
  AuctionHouse: 8 + 32 + 32,
  Buyer: 8 + 32 + 32 + 32,
  Metadata: 8 + 32 + 32 + 32 + 32,
}

const listingFilters: any = [
  {
    memcmp: {
      offset: ListingReceiptPosition.AuctionHouse,
      bytes: AUCTION_HOUSE_PUBLIC_KEY,
    },
  },

  {
    dataSize: LISTING_RECEIPT_SIZE,
  },
]

const bidFilters: any = [
  {
    memcmp: {
      offset: BidReceiptPosition.AuctionHouse,
      bytes: AUCTION_HOUSE_PUBLIC_KEY,
    },
  },

  {
    dataSize: BID_RECEIPT_SIZE,
  },
]

export async function getAuctionHouse(mx: Metaplex) {
  const auctionHouse = await mx.auctions().findAuctionHouseByAddress(new PublicKey(AUCTION_HOUSE_PUBLIC_KEY)).run()

  return auctionHouse
}

export async function listNFT(mx: Metaplex, nftAddress: PublicKey, price: number) {
  try {
    const auctionHouse = await getAuctionHouse(mx)

    const listedNFT = await mx
      .auctions()
      .for(auctionHouse)
      .list({
        mintAccount: nftAddress,
        price: sol(price),
      })
      .run()

    if (listedNFT) return true
  } catch (e) {
    console.log(e)
  }
  return false
}

export async function getProgramAccounts(mx: Metaplex, filters: any) {
  const accounts = await mx.connection.getParsedProgramAccounts(new PublicKey(AUCTION_HOUSE_ADDRESS), {
    filters: filters,
  })

  return accounts
}

export async function getListedNFTsFromAccounts(
  mx: Metaplex,
  accounts: {
    pubkey: PublicKey
    account: AccountInfo<Buffer | ParsedAccountData>
  }[]
) {
  const auctionHouse = await getAuctionHouse(mx)

  const listedNFTs = []

  for (let i = 0; i < accounts.length; i++) {
    const tradeState = new PublicKey(
      /*@ts-ignore to use slice function in Buffer*/
      accounts[i].account.data.slice(ListingReceiptPosition.TradeState, ListingReceiptPosition.BookKeeper)
    )
    try {
      const retrieveListing = await mx
        .auctions()
        .for(auctionHouse)
        .findListingByAddress(new PublicKey(tradeState))
        .run()

      if (retrieveListing.purchaseReceiptAddress == null && retrieveListing.canceledAt == null) {
        listedNFTs.push(retrieveListing)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return listedNFTs
}

export async function getListedNFTs(mx: Metaplex) {
  try {
    const accounts = await getProgramAccounts(mx, listingFilters)
    const listedNFTs = await getListedNFTsFromAccounts(mx, accounts)

    return listedNFTs
  } catch (error) {
    console.log(error)
  }
}

export async function getMyListedNFTs(mx: Metaplex) {
  try {
    const accounts = await (
      await getProgramAccounts(mx, listingFilters)
    ).filter(account => {
      const seller = new PublicKey(
        /*@ts-ignore to use slice function in Buffer*/
        account.account.data.slice(ListingReceiptPosition.Seller, ListingReceiptPosition.Metadata)
      )
      return seller.toBase58() === mx.identity().publicKey.toBase58()
    })
    const listedNFTs = await getListedNFTsFromAccounts(mx, accounts)

    return listedNFTs
  } catch (error) {
    console.log(error)
  }
}

export async function cancelList(mx: Metaplex, tradeStateAddress: PublicKey) {
  try {
    const auctionHouse = await getAuctionHouse(mx)

    const listing = await mx.auctions().for(auctionHouse).findListingByAddress(tradeStateAddress).run()

    const result = await mx.auctions().for(auctionHouse).cancelListing({ listing: listing }).run()

    if (result) return true
  } catch (e) {
    console.log(e)
  }
  return false
}

export async function updateList(mx: Metaplex, nftAddress: PublicKey, tradeStateAddress: PublicKey, price: number) {
  try {
    const isCanceled = await cancelList(mx, tradeStateAddress)
    const isListed = await listNFT(mx, nftAddress, price)
    return isCanceled && isListed
  } catch (e) {
    console.log(e)
  }
  return false
}

export async function buyNFT(mx: Metaplex, mintAddress: string, tradeStateAddress: string, price: number) {
  const auctionHouse = await mx.auctions().findAuctionHouseByAddress(new PublicKey(AUCTION_HOUSE_PUBLIC_KEY)).run()

  try {
    const listing = await mx
      .auctions()
      .for(auctionHouse)
      .findListingByAddress(
        new PublicKey(tradeStateAddress) //TradeState
      )
      .run()

    const { bid } = await mx
      .auctions()
      .for(auctionHouse)
      .bid({
        mintAccount: new PublicKey(
          mintAddress // NFT mintAddress
        ),
        price: sol(price),
        printReceipt: true,
      })
      .run()

    if (bid.price.basisPoints.toNumber() >= listing.price.basisPoints.toNumber()) {
      const tx = await mx.auctions().for(auctionHouse).executeSale({ bid, listing }).run()

      return true
    }
  } catch (error) {
    console.log(error)
  }
  return false
}

export async function offerNFT(mx: Metaplex, id: string, price: number) {
  try {
    const auctionHouse = await getAuctionHouse(mx)

    const result = await mx
      .auctions()
      .for(auctionHouse)
      .bid({
        mintAccount: new PublicKey(id),
        price: sol(price),
        printReceipt: true,
      })
      .run()

    if (result) return true
  } catch (e) {
    console.log(e)
  }
  return false
}

export async function getOffersFromAccounts(
  mx: Metaplex,
  accounts: {
    pubkey: PublicKey
    account: AccountInfo<Buffer | ParsedAccountData>
  }[]
) {
  const auctionHouse = await getAuctionHouse(mx)

  const bids = []

  const listedNFTs = await getListedNFTs(mx)

  for (let i = 0; i < accounts.length; i++) {
    const tradeState = new PublicKey(
      /*@ts-ignore*/
      accounts[i].account.data.slice(BidReceiptPosition.TradeState, BidReceiptPosition.BookKeeper)
    )

    try {
      const bid = await mx.auctions().for(auctionHouse).findBidByTradeState(new PublicKey(tradeState)).run()

      let isListed = false
      let listingTradeStateAddress = null
      const myListedNFTs = listedNFTs.filter(
        nft => nft.asset.mint.address.toString() === bid.asset.mint.address.toString()
      )
      if (myListedNFTs.length > 0) {
        isListed = true
        listingTradeStateAddress = myListedNFTs[0].tradeStateAddress
      }
      const owner = await getNFTOwner(mx, bid.asset.mint.address.toString())
      const buyer = bid.buyerAddress.toBase58()
      const isIncoming = owner === mx.identity().publicKey.toBase58()
      const isOutgoing = buyer === mx.identity().publicKey.toBase58()

      if ((isIncoming || isOutgoing) && bid.purchaseReceiptAddress == null && bid.canceledAt == null) {
        bids.push({
          ...bid,
          owner,
          buyer,
          isIncoming,
          isOutgoing,
          isListed,
          listingTradeStateAddress,
        })
      }
    } catch (error) {
      console.log(error)
      return []
    }
  }

  /*@ts-ignore*/
  bids.sort((bid1, bid2) => (bid1.createdAt.toNumber() < bid2.createdAt.toNumber() ? 1 : -1))

  return bids
}

export async function getMyOffers(mx: Metaplex) {
  try {
    const accounts = await getProgramAccounts(mx, bidFilters)
    const bids = await getOffersFromAccounts(mx, accounts)
    return bids
  } catch (error) {
    console.log(error)
  }
}

export async function cancelOffer(mx: Metaplex, tradeStateAddress: PublicKey) {
  try {
    const auctionHouse = await getAuctionHouse(mx)

    const bid = await mx.auctions().for(auctionHouse).findBidByTradeState(tradeStateAddress).run()

    const result = await mx.auctions().for(auctionHouse).cancelBid({ bid: bid }).run()

    if (result) return true
  } catch (e) {
    console.log(e)
  }

  return false
}

export async function acceptOffer(mx: Metaplex, tradeStateAddress: PublicKey, listingTradeStateAddress: PublicKey) {
  const auctionHouse = await mx.auctions().findAuctionHouseByAddress(new PublicKey(AUCTION_HOUSE_PUBLIC_KEY)).run()

  try {
    const bid = await mx.auctions().for(auctionHouse).findBidByTradeState(tradeStateAddress).run()

    let listing = null
    let isListingCanceled = false

    if (listingTradeStateAddress) {
      listing = await mx.auctions().for(auctionHouse).findListingByAddress(listingTradeStateAddress).run()
      if (bid.price.basisPoints.toNumber() < listing.price.basisPoints.toNumber()) {
        const result = await mx.auctions().for(auctionHouse).cancelListing({ listing: listing }).run()

        if (result) isListingCanceled = true
      }
    }

    if (!listingTradeStateAddress || isListingCanceled) {
      const { listing: newListing } = await mx
        .auctions()
        .for(auctionHouse)
        .list({
          mintAccount: bid.asset.address,
          price: bid.price,
        })
        .run()
      listing = newListing
    }

    const tx = await mx.auctions().for(auctionHouse).executeSale({ bid, listing }).run()

    console.log(tx)

    return true
  } catch (error) {
    console.log(error)
  }
  return false
}
