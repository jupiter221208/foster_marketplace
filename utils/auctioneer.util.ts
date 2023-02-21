import {
  createSellInstruction,
  createDepositInstruction,
  createBuyInstruction,
  createCancelInstruction,
  createExecuteSaleInstruction,
  createWithdrawInstruction,

  AUCTIONEER_PROGRAM_ID
} from "@metaplex-foundation/mpl-auctioneer";
import { PROGRAM_ID as AUCTION_HOUSE_ADDRESS } from '@metaplex-foundation/mpl-auction-house';
import { PublicKey, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { Metaplex, WRAPPED_SOL_MINT } from "@metaplex-foundation/js";

import authAPI from 'apis/auth'

export const TIMED_AUCTION_HOUSE_PUBLIC_KEY = new PublicKey(process.env.TIMED_AUCTION_HOUSE_PUBLIC_KEY ?? 0)
const TIMED_AUCTION_HOUSE_OWNER_ADDRESS = new PublicKey(process.env.TIMED_AUCTION_HOUSE_OWNER_ADDRESS ?? 0)

export async function getAuctioneerAuthority() {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("auctioneer"),
      TIMED_AUCTION_HOUSE_PUBLIC_KEY.toBuffer()
    ],
    AUCTIONEER_PROGRAM_ID
  );
}

export async function getPda(auctioneerAuthority) {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("auctioneer"),
      TIMED_AUCTION_HOUSE_PUBLIC_KEY.toBuffer(),
      auctioneerAuthority.toBuffer(),
    ],
    AUCTION_HOUSE_ADDRESS
  );
}

export async function getListingConfig(publicKey, associatedAddress, mintAddress) {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("listing_config"),
      publicKey.toBuffer(),
      TIMED_AUCTION_HOUSE_PUBLIC_KEY.toBuffer(),
      associatedAddress.toBuffer(),
      WRAPPED_SOL_MINT.toBuffer(),
      mintAddress.toBuffer(),
      new BN(1).toArrayLike(Buffer, "le", 8),
    ],
    AUCTIONEER_PROGRAM_ID
  );
}

async function getAuctionHouseTradeState(
  wallet,
  tokenAccount,
  tokenMint,
  buyPrice
) {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("auction_house"),
      wallet.toBuffer(),
      TIMED_AUCTION_HOUSE_PUBLIC_KEY.toBuffer(),
      tokenAccount.toBuffer(),
      WRAPPED_SOL_MINT.toBuffer(),
      tokenMint.toBuffer(),
      new BN(buyPrice).toArrayLike(Buffer, "le", 8),
      new BN(1).toArrayLike(Buffer, "le", 8),
    ],
    AUCTION_HOUSE_ADDRESS
  );
}

export async function getFeePayer() {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from("auction_house"),
      TIMED_AUCTION_HOUSE_PUBLIC_KEY.toBuffer(),
      Buffer.from("fee_payer")
    ],
    AUCTION_HOUSE_ADDRESS
  );
}

export function getMetadata(mx: Metaplex, mint: PublicKey): PublicKey {
  return mx
    .nfts()
    .pdas()
    .metadata({ mint });
}

export async function getSigner() {
  return await PublicKey.findProgramAddress(
    [Buffer.from("auction_house"), Buffer.from("signer")],
    AUCTION_HOUSE_ADDRESS
  );
}

export async function getEscrowPaymentAccount(publicKey: PublicKey) {
  return await PublicKey.findProgramAddress(
    [
      Buffer.from('auction_house'),
      TIMED_AUCTION_HOUSE_PUBLIC_KEY.toBuffer(),
      publicKey.toBuffer(),
    ],
    AUCTION_HOUSE_ADDRESS
  )
}

export async function getAuctionHouseTreasury() {
  return await PublicKey.findProgramAddress(
    [Buffer.from("auction_house"),
    TIMED_AUCTION_HOUSE_PUBLIC_KEY.toBuffer(),
    Buffer.from("treasury")],
    AUCTION_HOUSE_ADDRESS
  )
}

export async function startAuction(
  mx: Metaplex,
  mintAddress: PublicKey,
  startDate: Date,
  endDate: Date,
  price: number
) {

  const startTime = Math.floor(startDate.getTime() / 1000)
  const endTime = Math.floor(endDate.getTime() / 1000)

  const publicKey = mx.identity().publicKey

  const [auctioneerAuthority, auctioneerAuthorityBump] = await getAuctioneerAuthority()

  const [pda] = await getPda(auctioneerAuthority)

  const associatedAddress = await getAssociatedTokenAddress(mintAddress, publicKey);

  const [listingConfig] = await getListingConfig(publicKey, associatedAddress, mintAddress)

  const [sellerTradeState, sellerTradeStateBump] = await getAuctionHouseTradeState(
    publicKey,
    associatedAddress,
    mintAddress,
    "18446744073709551615"
  );

  const [freeTradeState, freeTradeBump] = await getAuctionHouseTradeState(
    publicKey,
    associatedAddress,
    mintAddress,
    "0"
  );

  const [feePayer] = await getFeePayer()

  const [signer, signerBump] = await getSigner()

  const accounts = {
    auctionHouseProgram: AUCTION_HOUSE_ADDRESS,
    listingConfig: listingConfig,
    wallet: publicKey,
    tokenAccount: associatedAddress,
    metadata: getMetadata(mx, mintAddress),
    authority: TIMED_AUCTION_HOUSE_OWNER_ADDRESS,
    auctionHouse: TIMED_AUCTION_HOUSE_PUBLIC_KEY,
    auctionHouseFeeAccount: feePayer,
    sellerTradeState: sellerTradeState,
    freeSellerTradeState: freeTradeState,
    auctioneerAuthority: auctioneerAuthority,
    ahAuctioneerPda: pda,
    programAsSigner: signer,
  };

  const args = {
    tradeStateBump: sellerTradeStateBump,
    freeTradeStateBump: freeTradeBump,
    programAsSignerBump: signerBump,
    auctioneerAuthorityBump: auctioneerAuthorityBump,
    tokenSize: new BN(Math.ceil(1 * 1)),
    startTime: startTime,
    endTime: endTime,
    reservePrice: price * 1000000000,
    minBidIncrement: 1,
    timeExtPeriod: 1,
    timeExtDelta: 1,
    allowHighBidCancel: true,
  };

  const sellInstruction = await createSellInstruction(accounts, args);

  let tx = new Transaction();
  tx.add(sellInstruction);
  tx.recentBlockhash = (await mx.connection.getLatestBlockhash()).blockhash;
  tx.feePayer = publicKey;

  const response = await mx.rpc().sendAndConfirmTransaction(tx, null, [mx.identity()])

  return {
    response,
    auction: {
      mintAddress,
      associatedAddress,
      freeTradeState,
      metadata: getMetadata(mx, mintAddress),
      signer,
      sellerAddress: publicKey,
      startTime,
      endTime,
      reservePrice: price
    }
  }
}

export async function cancelListing(
  mx: Metaplex,
  mintAddress: PublicKey,
  sellerAddress: PublicKey
) {

  const publicKey = mx.identity().publicKey;

  const [auctioneerAuthority, auctioneerAuthorityBump] = await getAuctioneerAuthority()

  const [pda] = await getPda(auctioneerAuthority)

  const associatedAddress = await getAssociatedTokenAddress(mintAddress, sellerAddress)

  const [listingConfig] = await getListingConfig(sellerAddress, associatedAddress, mintAddress)

  const [feePayer] = await getFeePayer()

  const [sellerTradeState] = await getAuctionHouseTradeState(
    sellerAddress,
    associatedAddress,
    mintAddress,
    "18446744073709551615"
  )

  const cancelArgs = {
    auctioneerAuthorityBump: auctioneerAuthorityBump,
    buyerPrice: new BN("18446744073709551615").toArrayLike(Buffer, "le", 8),
    tokenSize: 1,
  };

  const cancelAccounts = {
    auctionHouseProgram: AUCTION_HOUSE_ADDRESS,
    listingConfig: listingConfig,
    seller: sellerAddress,
    wallet: publicKey,
    tokenAccount: associatedAddress,
    tokenMint: mintAddress,
    authority: TIMED_AUCTION_HOUSE_OWNER_ADDRESS,
    auctionHouse: TIMED_AUCTION_HOUSE_PUBLIC_KEY,
    auctionHouseFeeAccount: feePayer,
    tradeState: sellerTradeState,
    auctioneerAuthority: auctioneerAuthority,
    ahAuctioneerPda: pda
  };

  /**@ts-ignore for buyerPrice */
  const cancelInstruction = await createCancelInstruction(cancelAccounts, cancelArgs);

  let tx = new Transaction();
  tx.add(cancelInstruction);
  tx.recentBlockhash = (await mx.connection.getLatestBlockhash()).blockhash;
  tx.feePayer = publicKey;

  const response = await mx.rpc().sendAndConfirmTransaction(tx, null, [mx.identity()])

  return {
    response,
    auction: {
      mintAddress
    }
  }
}

export async function depositFunds(
  mx: Metaplex,
  price: number
) {
  let tx = await createDepositFundsTransaction(mx, price)
  tx.recentBlockhash = (await mx.connection.getLatestBlockhash()).blockhash;

  const response = await mx.rpc().sendAndConfirmTransaction(tx, null, [mx.identity()])

  return {
    response
  }
}

export async function createDepositFundsTransaction(
  mx: Metaplex,
  price: number
) {

  const publicKey = mx.identity().publicKey;

  const [auctioneerAuthority, auctioneerAuthorityBump] = await getAuctioneerAuthority()

  const [pda] = await getPda(auctioneerAuthority)

  const [feePayer] = await getFeePayer()

  const [escrowPaymentAccount, escrowPaymentBump] = await getEscrowPaymentAccount(publicKey)

  const depositArgs = {
    escrowPaymentBump: escrowPaymentBump,
    auctioneerAuthorityBump: auctioneerAuthorityBump,
    amount: price * 1000000000,
  };

  const depositAccounts = {
    auctionHouseProgram: AUCTION_HOUSE_ADDRESS,
    wallet: publicKey,
    paymentAccount: publicKey,
    transferAuthority: publicKey,
    escrowPaymentAccount: escrowPaymentAccount,
    treasuryMint: WRAPPED_SOL_MINT,
    authority: TIMED_AUCTION_HOUSE_OWNER_ADDRESS,
    auctionHouse: TIMED_AUCTION_HOUSE_PUBLIC_KEY,
    auctionHouseFeeAccount: feePayer,
    auctioneerAuthority: auctioneerAuthority,
    ahAuctioneerPda: pda,
  };

  const depositInstruction = await createDepositInstruction(depositAccounts, depositArgs);

  let tx = new Transaction();
  tx.add(depositInstruction);
  tx.feePayer = publicKey;

  return tx
}

export async function withdrawFunds(
  mx: Metaplex,
  price: number
) {

  const publicKey = mx.identity().publicKey;

  const [auctioneerAuthority, auctioneerAuthorityBump] = await getAuctioneerAuthority()

  const [pda] = await getPda(auctioneerAuthority)

  const [feePayer] = await getFeePayer()

  const [escrowPaymentAccount, escrowPaymentBump] = await getEscrowPaymentAccount(publicKey)

  const withdrawArgs = {
    escrowPaymentBump: escrowPaymentBump,
    auctioneerAuthorityBump: auctioneerAuthorityBump,
    amount: price * 1000000000,
  };

  const withdrawAccounts = {
    auctionHouseProgram: AUCTION_HOUSE_ADDRESS,
    wallet: publicKey,
    receiptAccount: publicKey,
    escrowPaymentAccount: escrowPaymentAccount,
    treasuryMint: WRAPPED_SOL_MINT,
    authority: TIMED_AUCTION_HOUSE_OWNER_ADDRESS,
    auctionHouse: TIMED_AUCTION_HOUSE_PUBLIC_KEY,
    auctionHouseFeeAccount: feePayer,
    auctioneerAuthority: auctioneerAuthority,
    ahAuctioneerPda: pda,
  };

  const withdrawInstruction = await createWithdrawInstruction(withdrawAccounts, withdrawArgs);

  let tx = new Transaction();
  tx.add(withdrawInstruction);
  tx.recentBlockhash = (await mx.connection.getLatestBlockhash()).blockhash;
  tx.feePayer = publicKey;

  const response = await mx.rpc().sendAndConfirmTransaction(tx, null, [mx.identity()])

  return {
    response
  }
}

export async function placeBid(
  mx: Metaplex,
  mintAddress: PublicKey,
  sellerAddress: PublicKey,
  price: number
) {

  const publicKey = mx.identity().publicKey;

  const [escrowPaymentAccount, escrowPaymentBump] = await getEscrowPaymentAccount(publicKey);
  let currentBalance = await mx.connection.getBalance(escrowPaymentAccount) / LAMPORTS_PER_SOL;

  // TODO: replace with endpoint to only fetch lockups
  let { bid_wallet_lock } = await authAPI.login({ wallet_id: publicKey.toBase58() });
  let fundTx: Transaction | null = null;
  let delta = (bid_wallet_lock + price + 0.0001) - currentBalance;
  if (delta > 0) fundTx = await createDepositFundsTransaction(mx, delta);
  console.log({ bid_wallet_lock, price, currentBalance, delta })

  const [auctioneerAuthority, auctioneerAuthorityBump] = await getAuctioneerAuthority()

  const [pda] = await getPda(auctioneerAuthority)

  const associatedAddress = await getAssociatedTokenAddress(mintAddress, sellerAddress)

  const [listingConfig] = await getListingConfig(sellerAddress, associatedAddress, mintAddress)

  const [feePayer] = await getFeePayer()

  const [buyerTradeState, buyerTradeStateBump] = await getAuctionHouseTradeState(
    publicKey,
    associatedAddress,
    mintAddress,
    price * 1000000000
  )

  const buyArgs = {
    tradeStateBump: buyerTradeStateBump,
    escrowPaymentBump: escrowPaymentBump,
    auctioneerAuthorityBump: auctioneerAuthorityBump,
    buyerPrice: price * 1000000000,
    tokenSize: 1,
  };

  const buyAccounts = {
    auctionHouseProgram: AUCTION_HOUSE_ADDRESS,
    listingConfig: listingConfig,
    seller: sellerAddress,
    wallet: publicKey,
    paymentAccount: publicKey,
    transferAuthority: sellerAddress,
    treasuryMint: WRAPPED_SOL_MINT,
    tokenAccount: associatedAddress,
    metadata: getMetadata(mx, mintAddress),
    escrowPaymentAccount: escrowPaymentAccount,
    authority: TIMED_AUCTION_HOUSE_OWNER_ADDRESS,
    auctionHouse: TIMED_AUCTION_HOUSE_PUBLIC_KEY,
    auctionHouseFeeAccount: feePayer,
    buyerTradeState: buyerTradeState,
    auctioneerAuthority: auctioneerAuthority,
    ahAuctioneerPda: pda
  };

  const buyInstruction = await createBuyInstruction(buyAccounts, buyArgs);

  let tx = fundTx ?? new Transaction();
  tx.add(buyInstruction);
  tx.recentBlockhash = (await mx.connection.getLatestBlockhash()).blockhash;
  tx.feePayer = publicKey;

  const response = await mx.rpc().sendAndConfirmTransaction(tx, null, [mx.identity()])

  return {
    response,
    bid: {
      mintAddress,
      buyerAddress: publicKey,
      amount: price
    }
  }
}

export async function executeSale(
  mx: Metaplex,
  mintAddress: PublicKey,
  sellerAddress: PublicKey,
  buyerAddress: PublicKey,
  price: number
) {

  const publicKey = mx.identity().publicKey;

  const [auctioneerAuthority, auctioneerAuthorityBump] = await getAuctioneerAuthority()

  const [pda] = await getPda(auctioneerAuthority)

  const associatedAddress = await getAssociatedTokenAddress(mintAddress, sellerAddress)

  const buyerAssociatedAddress = await getAssociatedTokenAddress(mintAddress, buyerAddress);

  const [listingConfig] = await getListingConfig(sellerAddress, associatedAddress, mintAddress)

  const [feePayer] = await getFeePayer()

  const [escrowPaymentAccount, escrowPaymentBump] = await getEscrowPaymentAccount(buyerAddress)

  const [buyerTradeState] = await getAuctionHouseTradeState(
    buyerAddress,
    associatedAddress,
    mintAddress,
    price
  )

  const [sellerTradeState] = await getAuctionHouseTradeState(
    sellerAddress,
    associatedAddress,
    mintAddress,
    "18446744073709551615"
  );

  const [freeTradeState, freeTradeBump] = await getAuctionHouseTradeState(
    sellerAddress,
    associatedAddress,
    mintAddress,
    "0"
  );

  const [signer, signerBump] = await getSigner()

  const [auctionHouseTreasury] = await getAuctionHouseTreasury()

  let remainingAccounts = [];
  const nft = await mx.nfts().findByMint({ mintAddress });

  for (let i = 0; i < nft.creators.length; i++) {
    let creator = { pubkey: nft.creators[i].address, isWritable: true, isSigner: false };
    remainingAccounts.push(creator);
  }

  const executeSaleArgs = {
    escrowPaymentBump: escrowPaymentBump,
    freeTradeStateBump: freeTradeBump,
    programAsSignerBump: signerBump,
    auctioneerAuthorityBump: auctioneerAuthorityBump,
    buyerPrice: price,
    tokenSize: 1,
  };

  const executeSaleAccounts = {
    auctionHouseProgram: AUCTION_HOUSE_ADDRESS,
    listingConfig: listingConfig,
    buyer: buyerAddress,
    seller: sellerAddress,
    tokenAccount: associatedAddress,
    tokenMint: mintAddress,
    metadata: getMetadata(mx, mintAddress),
    treasuryMint: WRAPPED_SOL_MINT,
    escrowPaymentAccount: escrowPaymentAccount,
    sellerPaymentReceiptAccount: sellerAddress,
    buyerReceiptTokenAccount: buyerAssociatedAddress,
    authority: TIMED_AUCTION_HOUSE_OWNER_ADDRESS,
    auctionHouse: TIMED_AUCTION_HOUSE_PUBLIC_KEY,
    auctionHouseFeeAccount: feePayer,
    auctionHouseTreasury: auctionHouseTreasury,
    buyerTradeState: buyerTradeState,
    sellerTradeState: sellerTradeState,
    freeTradeState: freeTradeState,
    auctioneerAuthority: auctioneerAuthority,
    ahAuctioneerPda: pda,
    programAsSigner: signer,
  };

  const executeSale = await createExecuteSaleInstruction(executeSaleAccounts, executeSaleArgs);

  remainingAccounts.forEach(account => {
    executeSale.keys.push(account)
  })

  let tx = new Transaction();
  tx.add(executeSale);
  tx.recentBlockhash = (await mx.connection.getLatestBlockhash()).blockhash;
  tx.feePayer = publicKey;

  const response = await mx.rpc().sendAndConfirmTransaction(tx, null, [mx.identity()])

  return {
    response,
    sale: {
      mintAddress,
      buyerAddress,
      price: price / 1000000000
    }
  }
}