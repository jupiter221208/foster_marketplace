import bs58 from 'bs58'
import {
  LAMPORTS_PER_SOL,

  AccountInfo,
  ParsedAccountData,
  PublicKey,
  Transaction,
  sendAndConfirmRawTransaction,
} from '@solana/web3.js'
import { unpackAccount, getAssociatedTokenAddressSync } from '@solana/spl-token'
import {
  WRAPPED_SOL_MINT,
  Metaplex,
  sol,
  TokenGpaBuilder,
  GmaBuilder,
  isKeypairSigner,
  toAuctioneerAccount,
  toAuctionHouseAccount,
  toBidReceiptAccount,
  toLazyBid,
  toMetadata,
  toMetadataAccount,
  toToken,
  toTokenAccount,
  type AuctionHouse,
  type Listing,
  type LazyListing,
  type LazyBid,
  type Metadata,
  type NftWithToken,
  type TransactionBuilder,
} from '@metaplex-foundation/js'
import { PROGRAM_ID as AUCTION_HOUSE_ADDRESS } from '@metaplex-foundation/mpl-auction-house'
import { getNFTOwner } from './nfts.utils'

import authAPI from 'apis/auth'

export const AUCTION_HOUSE_PUBLIC_KEY = new PublicKey(process.env.AUCTION_HOUSE_PUBLIC_KEY ?? 0)
const AUCTION_HOUSE_OWNER_ADDRESS = new PublicKey(process.env.AUCTION_HOUSE_OWNER_ADDRESS ?? 0)

export type LazyBidWithAsset = LazyBid & { asset: Metadata }

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

const listingFilters: any = [
  {
    memcmp: {
      offset: ListingReceiptPosition.AuctionHouse,
      bytes: AUCTION_HOUSE_PUBLIC_KEY.toBase58(),
    },
  },

  {
    dataSize: LISTING_RECEIPT_SIZE,
  },
]

const loadAuctionHousePromiseCache: Map<string, Promise<AuctionHouse>> = new Map()
export async function loadAuctionHouse(
  metaplex: Metaplex,
  auctionHouseAddress: PublicKey,
  force: boolean = false
): Promise<AuctionHouse> {
  let auctionHousePromise = loadAuctionHousePromiseCache.get(auctionHouseAddress.toBase58())
  if (!auctionHousePromise || force) {
    // TODO: remove once PR is merged: https://github.com/metaplex-foundation/js/pull/451
    let auctionHouseAccount = await metaplex
      .rpc()
      .getAccount(auctionHouseAddress)
      .then(toAuctionHouseAccount)
    let auctioneerAuthority: PublicKey | undefined = undefined
    if (auctionHouseAccount.data.hasAuctioneer) {
      let auctioneerAccount = await metaplex
        .rpc()
        .getAccount(auctionHouseAccount.data.auctioneerAddress)
        .then(toAuctioneerAccount)
      auctioneerAuthority = auctioneerAccount.data.auctioneerAuthority
    }

    auctionHousePromise = metaplex.auctionHouse().findByAddress({
      address: auctionHouseAddress,
      auctioneerAuthority,
    })

    if (!auctionHousePromise) throw new Error(`could not load auction house: ${auctionHouseAddress}`)
    loadAuctionHousePromiseCache.set(auctionHouseAddress.toBase58(), auctionHousePromise)
  }

  return auctionHousePromise
}

export async function listNFT(mx: Metaplex, nftAddress: PublicKey, price: number) {
  try {
    const auctionHouse = await loadAuctionHouse(mx, AUCTION_HOUSE_PUBLIC_KEY)

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
  const accounts = await mx.connection.getParsedProgramAccounts(
    new PublicKey(AUCTION_HOUSE_ADDRESS),
    {
      filters: filters,
    }
  )

  return accounts
}

export async function getListedNFTsFromAccounts(
  mx: Metaplex,
  accounts: {
    pubkey: PublicKey
    account: AccountInfo<Buffer | ParsedAccountData>
  }[]
) {
  const auctionHouse = await loadAuctionHouse(mx, AUCTION_HOUSE_PUBLIC_KEY)

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
    const auctionHouse = await loadAuctionHouse(mx, AUCTION_HOUSE_PUBLIC_KEY)

    const listing = await mx.auctionHouse().findListingByTradeState({ auctionHouse, tradeStateAddress })

    const result = await mx.auctionHouse().cancelListing({ auctionHouse, listing: listing })

    if (result) return true
  } catch (e) {
    console.log(e)
  }
  return false
}

export async function updateList(
  mx: Metaplex,
  nftAddress: PublicKey,
  tradeStateAddress: PublicKey,
  price: number
) {
  try {
    const isCanceled = await cancelList(mx, tradeStateAddress)
    const isListed = await listNFT(mx, nftAddress, price)
    return isCanceled && isListed
  } catch (e) {
    console.log(e)
  }
  return false
}

export async function buyNFT(
  mx: Metaplex,
  mintAddress: string,
  tradeStateAddress: string,
  price: number
) {
  const auctionHouse = await loadAuctionHouse(mx, AUCTION_HOUSE_PUBLIC_KEY)

  try {
    const listing = await mx
      .auctionHouse()
      .findListingByTradeState({
        auctionHouse,
        tradeStateAddress: new PublicKey(tradeStateAddress), //TradeState
      })

    const receipt = await offerNFT(mx, mintAddress, price)
    if(!receipt)
      throw new Error(`could not place bid on ${mintAddress} for ${price}`)
    const bid = await mx
      .auctionHouse()
      .findBidByReceipt({
        auctionHouse,
        receiptAddress: receipt,
        loadJsonMetadata: false,
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
    const auctionHouse = await loadAuctionHouse(mx, AUCTION_HOUSE_PUBLIC_KEY)

    const operation = await mx
      .auctionHouse()
      .builders()
      .bid({
        auctionHouse,
        mintAccount: new PublicKey(id),
        price: sol(price),
      })

    let publicKey = mx.identity().publicKey
    let escrowPaymentAccount = mx
      .auctionHouse()
      .pdas()
      .buyerEscrow({
        auctionHouse: auctionHouse.address,
        buyer: publicKey
      })
    let currentBalance = await mx.connection.getBalance(escrowPaymentAccount) / LAMPORTS_PER_SOL
    // TODO: replace with endpoint to only fetch lockups
    let { offer_wallet_lock } = await authAPI.login({ wallet_id: publicKey.toBase58() })
    let delta = (offer_wallet_lock + price + 0.0001) - currentBalance;
    if (delta > 0)
      operation.prepend(
        mx
          .auctionHouse()
          .builders()
          .depositToBuyerAccount({
            auctionHouse,
            amount: sol(delta)
          })
      )
    console.log({ offer_wallet_lock, price, currentBalance, delta })

    const { response, receipt } = await operation.sendAndConfirm(mx)

    if (response) return receipt
  } catch (e) {
    console.log(e)
  }
  return false
}

export async function getMyBids(mx: Metaplex): Promise<LazyBidWithAsset[]> {
  let auctionHouse = await loadAuctionHouse(mx, AUCTION_HOUSE_PUBLIC_KEY)
  let bids = (await mx.auctionHouse().findBids({
    auctionHouse,
    buyer: mx.identity().publicKey,
  })) as LazyBid[]
  bids = bids.filter(
    ({ canceledAt, purchaseReceiptAddress }) =>
      canceledAt === null && purchaseReceiptAddress === null
  )

  return populateLazyBidsWithAssets(mx, bids)
}

export async function populateLazyBidsWithAssets(
  mx: Metaplex,
  bids: LazyBid[]
): Promise<LazyBidWithAsset[]> {
  let metadatas: (Metadata | null)[] = await new GmaBuilder(
    mx,
    bids.map(({ metadataAddress }) => metadataAddress)
  ).getAndMap(account => (account.exists ? toMetadata(toMetadataAccount(account)) : null))

  return bids
    .map((bid, index) => {
      if (metadatas[index]) {
        let bidWithAsset = bid as LazyBidWithAsset
        bidWithAsset.asset = metadatas[index]
        return bidWithAsset
      } else {
        console.warn(
          `could not load metadata for bid ${bid.receiptAddress}: ${bid.metadataAddress}`
        )
        return null
      }
    })
    .filter(bid => bid != null)
    .sort((a, b) => a.createdAt.toNumber() - b.createdAt.toNumber())
}

export async function getReceivedBids(mx: Metaplex): Promise<LazyBidWithAsset[]> {
  let auctionHouse = await loadAuctionHouse(mx, AUCTION_HOUSE_PUBLIC_KEY)

  let tokenAccounts = await new TokenGpaBuilder(mx)
    .whereOwner(mx.identity().publicKey)
    .whereAmount(1)
    .getAndMap(account =>
      unpackAccount(account.publicKey, {
        ...account,
        lamports: parseInt(account.lamports.basisPoints.toString()),
      })
    )

  const bidReceiptDiscriminator = [186, 150, 141, 135, 59, 122, 39, 99]
  let batchRequest = tokenAccounts.map(({ mint }, index) => ({
    jsonrpc: '2.0',
    id: index,
    method: 'getProgramAccounts',
    params: [
      AUCTION_HOUSE_ADDRESS.toBase58(),
      {
        encoding: 'base64',
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: bs58.encode(bidReceiptDiscriminator),
            },
          },
          {
            memcmp: {
              offset: 72,
              bytes: auctionHouse.address.toBase58(),
            },
          },
          {
            memcmp: {
              offset: 136,
              bytes: mx.nfts().pdas().metadata({ mint }).toBase58(),
            },
          },
        ],
      },
    ],
  }))

  // set max request entires to 100 for public devnet rpc, 500 otherwise
  let MAX_BATCH_REQUEST_ENTRIES = mx.connection.rpcEndpoint.includes('api.devnet.solana.com') ? 100 : 500
  let batchResponse = []
  while (batchRequest.length > 0)
    batchResponse.push(
      await fetch(mx.connection.rpcEndpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(batchRequest.splice(0, MAX_BATCH_REQUEST_ENTRIES)),
      }).then(r => r.json())
    )

  let bids = batchResponse
    .flat()
    .flatMap(({ result }) => result)
    .map(({ pubkey, account: { data, executable, owner, lamports } }) =>
      toLazyBid(
        toBidReceiptAccount({
          publicKey: new PublicKey(pubkey),
          executable,
          owner: new PublicKey(owner),
          data: Buffer.from(data[0], 'base64'),
          lamports: sol(lamports),
        }),
        auctionHouse
      )
    )
    .filter(
      ({ canceledAt, purchaseReceiptAddress }) =>
        canceledAt === null && purchaseReceiptAddress === null
    )

  return populateLazyBidsWithAssets(mx, bids)
}

export async function cancelOffer(mx: Metaplex, tradeStateAddress: PublicKey) {
  try {
    const auctionHouse = await loadAuctionHouse(mx, AUCTION_HOUSE_PUBLIC_KEY)

    const bid = await mx.auctionHouse().findBidByTradeState({ auctionHouse, tradeStateAddress })

    const result = await mx.auctionHouse().cancelBid({ auctionHouse, bid })

    if (result) return true
  } catch (e) {
    console.log(e)
  }

  return false
}

export async function acceptOffer(mx: Metaplex, bid: LazyBid): Promise<boolean> {
  try {
    const auctionHouse = await loadAuctionHouse(mx, AUCTION_HOUSE_PUBLIC_KEY)

    let listings = (await mx
      .auctionHouse()
      .findListings({
        auctionHouse,
        seller: mx.identity().publicKey,
        metadata: bid.metadataAddress,
      })) as LazyListing[]
    let activeListings: Listing[] = await Promise.all(
      listings
        .filter(
          ({ canceledAt, purchaseReceiptAddress }) =>
            canceledAt === null && purchaseReceiptAddress === null
        )
        .map(lazyListing => mx.auctionHouse().loadListing({ lazyListing }))
    )

    let matchinglisting: Listing | null = null
    // cancel all active listings
    let operations: TransactionBuilder[] = []
    for (let listing of activeListings)
      if (
        matchinglisting === null &&
        bid.price.currency.symbol === listing.price.currency.symbol &&
        bid.price.basisPoints.eq(listing.price.basisPoints)
      )
        matchinglisting = listing
      else
        operations.push(
          mx
            .auctionHouse()
            .builders()
            .cancelListing({
              auctionHouse,
              listing,
            })
        )

    let loadedBid = await mx
      .auctionHouse()
      .loadBid({
        lazyBid: bid,
        loadJsonMetadata: false,
      });

    let [sellerToken] = await new TokenGpaBuilder(mx)
      .whereMint(loadedBid.asset.mint.address)
      .whereAmount(1)
      .getAndMap(account => toToken(toTokenAccount(account)))

    console.log({loadedBid, sellerToken, operations})

    // if matching listing exists, execute sale
    if (matchinglisting) {
      operations.push(
        mx
          .auctionHouse()
          .builders()
          .executeSale({
            auctionHouse,
            bid: loadedBid,
            listing: matchinglisting,
          })
      )
    }
    // else, list and sell nft
    else
      operations.push(
        await mx
          .auctionHouse()
          .builders()
          .sell({
            auctionHouse,
            sellerToken,
            bid: loadedBid,
          })
      )

    let blockhashWithExpiryBlockHeight = await mx.connection.getLatestBlockhash()
    let txs = await mx.identity().signAllTransactions(
      operations.map(operation => {
        let tx = operation.toTransaction(blockhashWithExpiryBlockHeight)
        for (let signer of operation.getSigners())
          if (isKeypairSigner(signer))
            tx.partialSign(signer)
        return tx
      })
    )
    await Promise.all(
      txs.map(tx =>
        sendAndConfirmRawTransaction(
          mx.connection,
          tx.serialize({ requireAllSignatures: false })
        )
      )
    )

    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export async function getEscrowPaymentAccount(publicKey: PublicKey) {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from('auction_house'),
      AUCTION_HOUSE_PUBLIC_KEY.toBuffer(),
      publicKey.toBuffer()
    ],
    new PublicKey(AUCTION_HOUSE_ADDRESS)
  )
}

export async function depositFunds(mx: Metaplex, price: number) {
  let auctionHouse = await loadAuctionHouse(mx, AUCTION_HOUSE_PUBLIC_KEY)

  return mx
    .auctionHouse()
    .depositToBuyerAccount({
      auctionHouse,
      amount: sol(price),
    })
}

export async function withdrawFunds(mx: Metaplex, price: number) {
  let auctionHouse = await loadAuctionHouse(mx, AUCTION_HOUSE_PUBLIC_KEY)

  return mx
    .auctionHouse()
    .withdrawFromBuyerAccount({
      auctionHouse,
      amount: sol(price),
    })
}
