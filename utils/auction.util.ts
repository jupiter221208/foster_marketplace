import type { AuctionHouse } from '@metaplex-foundation/js'
import { Metaplex, sol, WRAPPED_SOL_MINT } from '@metaplex-foundation/js'
import { PROGRAM_ID as AUCTION_HOUSE_ADDRESS } from '@metaplex-foundation/mpl-auction-house'
import { AccountInfo, ParsedAccountData, PublicKey, Transaction } from '@solana/web3.js'
import { getNFTOwner } from './nfts.utils'

const AUCTION_HOUSE_PUBLIC_KEY = new PublicKey(process.env.AUCTION_HOUSE_PUBLIC_KEY ?? 0)
const AUCTION_HOUSE_OWNER_ADDRESS = new PublicKey(process.env.AUCTION_HOUSE_OWNER_ADDRESS ?? 0)

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

let cachedAuctionHouse: AuctionHouse | null = null;
export async function getAndCacheAuctionHouse(
  mx: Metaplex,
  forceRefresh: boolean = false
): Promise<AuctionHouse> {
  if(!cachedAuctionHouse || forceRefresh){
    cachedAuctionHouse = await mx.auctionHouse().findByAddress({
      address: AUCTION_HOUSE_PUBLIC_KEY
    })
    if(!cachedAuctionHouse)
      throw new Error(`could not load auction house: ${AUCTION_HOUSE_PUBLIC_KEY}`);
  }

  return cachedAuctionHouse
}

export async function listNFT(mx: Metaplex, nftAddress: PublicKey, price: number) {
  try {
    const auctionHouse = await getAndCacheAuctionHouse(mx)

    const listedNFT = await mx
      .auctionHouse()
      .list({
        auctionHouse,
        mintAccount: nftAddress,
        price: sol(price),
      })

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
  const auctionHouse = await getAndCacheAuctionHouse(mx)

  const listedNFTs = []

  for (let i = 0; i < accounts.length; i++) {
    const tradeState = new PublicKey(
      /*@ts-ignore to use slice function in Buffer*/
      accounts[i].account.data.slice(ListingReceiptPosition.TradeState, ListingReceiptPosition.BookKeeper)
    )
    try {
      const retrieveListing = await mx
        .auctionHouse()
        .findListingByTradeState({ auctionHouse, tradeStateAddress: new PublicKey(tradeState) })

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
    const auctionHouse = await getAndCacheAuctionHouse(mx)

    const listing = await mx.auctionHouse().findListingByTradeState({ auctionHouse, tradeStateAddress })

    const result = await mx.auctionHouse().cancelListing({ auctionHouse, listing: listing })

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
  const auctionHouse = await getAndCacheAuctionHouse(mx)

  try {
    const listing = await mx
      .auctionHouse()
      .findListingByTradeState({
        auctionHouse,
        tradeStateAddress: new PublicKey(tradeStateAddress) //TradeState
      })

    const { bid } = await mx
      .auctionHouse()
      .bid({
        auctionHouse,
        mintAccount: new PublicKey(
          mintAddress // NFT mintAddress
        ),
        price: sol(price),
        printReceipt: true,
      })

    if (bid.price.basisPoints.toNumber() >= listing.price.basisPoints.toNumber()) {
      const tx = await mx.auctionHouse().executeSale({ auctionHouse, bid, listing })

      return true
    }
  } catch (error) {
    console.log(error)
  }
  return false
}

export async function offerNFT(mx: Metaplex, id: string, price: number) {
  try {
    const auctionHouse = await getAndCacheAuctionHouse(mx)

    const result = await mx
      .auctionHouse()
      .bid({
        auctionHouse,
        mintAccount: new PublicKey(id),
        price: sol(price),
        printReceipt: true,
      })

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
  const auctionHouse = await getAndCacheAuctionHouse(mx)

  const bids = []

  const listedNFTs = await getListedNFTs(mx)

  for (let i = 0; i < accounts.length; i++) {
    const tradeState = new PublicKey(
      /*@ts-ignore*/
      accounts[i].account.data.slice(BidReceiptPosition.TradeState, BidReceiptPosition.BookKeeper)
    )

    try {
      const bid = await mx.auctionHouse().findBidByTradeState({ auctionHouse, tradeStateAddress: new PublicKey(tradeState) })

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
    const auctionHouse = await getAndCacheAuctionHouse(mx)

    const bid = await mx.auctionHouse().findBidByTradeState({ auctionHouse, tradeStateAddress })

    const result = await mx.auctionHouse().cancelBid({ auctionHouse, bid })

    if (result) return true
  } catch (e) {
    console.log(e)
  }

  return false
}

export async function acceptOffer(mx: Metaplex, tradeStateAddress: PublicKey, listingTradeStateAddress: PublicKey) {
  const auctionHouse = await getAndCacheAuctionHouse(mx)

  try {
    const bid = await mx.auctionHouse().findBidByTradeState({ auctionHouse, tradeStateAddress })

    let listing = null
    let isListingCanceled = false

    if (listingTradeStateAddress) {
      listing = await mx.auctionHouse().findListingByTradeState({ auctionHouse, tradeStateAddress: listingTradeStateAddress })
      if (bid.price.basisPoints.toNumber() < listing.price.basisPoints.toNumber()) {
        const result = await mx.auctionHouse().cancelListing({ auctionHouse, listing })

        if (result) isListingCanceled = true
      }
    }

    if (!listingTradeStateAddress || isListingCanceled) {
      const { listing: newListing } = await mx
        .auctionHouse()
        .list({
          auctionHouse,
          mintAccount: bid.asset.address,
          price: bid.price,
        })
      listing = newListing
    }

    const tx = await mx.auctionHouse().executeSale({ auctionHouse, bid, listing })

    console.log(tx)

    return true
  } catch (error) {
    console.log(error)
  }
  return false
}

export async function getEscrowPaymentAccount(publicKey: PublicKey) {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from('auction_house'),
      new PublicKey(AUCTION_HOUSE_PUBLIC_KEY).toBuffer(),
      publicKey.toBuffer(),
    ],
    new PublicKey(AUCTION_HOUSE_ADDRESS)
  )
}

export async function getFeePayer() {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("auction_house"),
      new PublicKey(AUCTION_HOUSE_PUBLIC_KEY).toBuffer(),
      Buffer.from("fee_payer")
    ],
    new PublicKey(AUCTION_HOUSE_ADDRESS)
  );
}

export async function depositFunds(mx: Metaplex, price: number) {
  let auctionHouse = await getAndCacheAuctionHouse(mx);

  return mx
    .auctionHouse()
    .depositToBuyerAccount({
      auctionHouse,
      amount: sol(price)
    });
}

export async function withdrawFunds(mx: Metaplex, price: number) {
  let auctionHouse = await getAndCacheAuctionHouse(mx);

  return mx
    .auctionHouse()
    .withdrawFromBuyerAccount({
      auctionHouse,
      amount: sol(price)
    });
}
