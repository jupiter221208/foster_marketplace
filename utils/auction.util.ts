import { Metaplex, sol } from "@metaplex-foundation/js";
import { AccountInfo, ParsedAccountData, PublicKey } from "@solana/web3.js";

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
  8; // canceled_at;

const ListingReceiptPosition = {
  Key: 0,
  TradeState: 8,
  BookKeeper: 8 + 32,
  AuctionHouse: 8 + 32 + 32,
  Seller: 8 + 32 + 32 + 32,
  Metadata: 8 + 32 + 32 + 32 + 32,
};

const filters: any = [
  {
    memcmp: {
      offset: ListingReceiptPosition.AuctionHouse,
      bytes: AUCTION_HOUSE_PUBLIC_KEY,
    },
  },

  {
    dataSize: LISTING_RECEIPT_SIZE,
  },
];

export async function getAuctionHouse(mx: Metaplex) {
  const auctionHouse = await mx
    .auctions()
    .findAuctionHouseByAddress(new PublicKey(AUCTION_HOUSE_PUBLIC_KEY))
    .run()

  return auctionHouse
}

export async function listNFT(mx: Metaplex, nftAddress: PublicKey, price: number) {
  try {
    const auctionHouse = await getAuctionHouse(mx)

    const listedNFT = await mx
      .auctions()
      .for(auctionHouse)
      .list(
        {
          mintAccount: nftAddress,
          price: sol(price),
        }
      )
      .run()

    if (listedNFT) return true
  } catch (e) {
    console.log(e)
  }
  return false
}

export async function getProgramAccounts(mx: Metaplex) {
  const accounts = await mx.connection.getParsedProgramAccounts(
    new PublicKey(AUCTION_HOUSE_ADDRESS),
    { filters: filters }
  );

  return accounts
}

export async function getListedNFTsFromAccounts(
  mx: Metaplex,
  accounts: {
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData>;
  }[]) 
{
  const auctionHouse = await getAuctionHouse(mx)

  const listedNFTs = [];

  for (let i = 0; i < accounts.length; i++) {
    const tradeState = new PublicKey(
      /*@ts-ignore to use slice function in Buffer*/
      accounts[i].account.data.slice(ListingReceiptPosition.TradeState, ListingReceiptPosition.BookKeeper)
    );
    try {
      const retrieveListing = await mx
        .auctions()
        .for(auctionHouse)
        .findListingByAddress(new PublicKey(tradeState))
        .run();

      if (
        retrieveListing.purchaseReceiptAddress == null &&
        retrieveListing.canceledAt == null
      ) {
        listedNFTs.push(retrieveListing)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return listedNFTs
}

export async function getListedNFTs(mx: Metaplex) {
  try {
    const accounts = await getProgramAccounts(mx)
    const listedNFTs = await getListedNFTsFromAccounts(mx, accounts)
    
    return listedNFTs
  } catch (error) {
    console.log(error);
  }
}

export async function getMyListedNFTs(mx: Metaplex) {
  try {
    const accounts = await (await getProgramAccounts(mx)).filter(account => {
      /*@ts-ignore to use slice function in Buffer*/
      const seller = new PublicKey(account.account.data.slice(ListingReceiptPosition.Seller, ListingReceiptPosition.Metadata))
      return seller.toBase58() === mx.identity().publicKey.toBase58()
    })
    const listedNFTs = await getListedNFTsFromAccounts(mx, accounts)

    return listedNFTs
  } catch (error) {
    console.log(error);
  }
}

export async function cancelList(mx: Metaplex, id: string) {
  try {
    const auctionHouse = await getAuctionHouse(mx)

    const listing = await mx
      .auctions()
      .for(auctionHouse)
      .findListingByAddress(new PublicKey(id))
      .run()

    const result = await mx
      .auctions()
      .for(auctionHouse)
      .cancelListing({ listing: listing })
      .run()
    
    if(result) return true
  } catch(e) {
    console.log(e)
  }
  return false
}

export async function buyNFT(mx: Metaplex, mintAddress: string, tradeStateAddress: string, price: number) {
  const auctionHouse = await mx
    .auctions()
    .findAuctionHouseByAddress(new PublicKey(AUCTION_HOUSE_PUBLIC_KEY))
    .run()

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

    if (
      bid.price.basisPoints.toNumber() >= listing.price.basisPoints.toNumber()
    ) {
      const tx = await mx
        .auctions()
        .for(auctionHouse)
        .executeSale({ bid, listing })
        .run();

      return true
    }
  } catch (error) {
    console.log(error);
  }
  return false
}