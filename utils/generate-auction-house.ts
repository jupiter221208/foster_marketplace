import fs from "fs/promises";
import path from "path";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import type { CreateAuctionHouseInput } from "@metaplex-foundation/js";
import { Metaplex, keypairIdentity, WRAPPED_SOL_MINT } from "@metaplex-foundation/js";
import { createAuthorizeInstruction, AUCTIONEER_PROGRAM_ID } from "@metaplex-foundation/mpl-auctioneer";

import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", ".env") });

async function generateOrLoadKeypair(keypairFile: string): Promise<Keypair>{
  let keypair: Keypair;
  try{
    keypair = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse((await fs.readFile(keypairFile)).toString())
      )
    );
    console.log(`loaded keypair (${keypair.publicKey}) from ${keypairFile}`);
  }
  catch(e: any){
    console.log(`could not load ${keypairFile}: ${e.message}`);
    keypair = Keypair.generate();
    await fs.writeFile(keypairFile, JSON.stringify(Array.from(keypair.secretKey)));
    console.log(`generated new keypair (${keypair.publicKey}) and written to ${keypairFile}`);
    console.log();
  }

  return keypair;
}

async function ensureAccountBalance(
  connection: Connection,
  publicKey: PublicKey,
  minimumBalance: number
): Promise<boolean>{
  let accountBalance = await connection.getBalance(publicKey);
  let minimumLamports = minimumBalance * LAMPORTS_PER_SOL;
  if(accountBalance < minimumBalance){
    console.error(
      `insufficient balance: ${publicKey} has ${accountBalance} lamports, ` +
      `need at least ${minimumLamports} lamports`
    );
    return false;
  }
  else
    return true;
}

async function getOrCreateAuctionHouseAddress(
  metaplex: Metaplex,
  creator: Keypair,
  config: CreateAuctionHouseInput
): Promise<PublicKey>{
  let auctionHouseAddress = getAuctionHouseAddress(
    metaplex,
    creator.publicKey,
    config.treasuryMint
  );
  if(await metaplex.connection.getAccountInfo(auctionHouseAddress) !== null){
    console.log(`auction house already exists at ${auctionHouseAddress} with:`);
    console.log(`  creator       ${creator.publicKey}`);
    console.log(`  treasury mint ${config.treasuryMint ?? WRAPPED_SOL_MINT} `);
  }
  else{
    let { auctionHouse } = await metaplex
      .use(keypairIdentity(creator))
      .auctionHouse()
      .create(config);
    auctionHouseAddress = auctionHouse.address;
  }

  return auctionHouseAddress;
}

function getAuctionHouseAddress(
  metaplex: Metaplex,
  creator: PublicKey,
  treasuryMint: PublicKey = WRAPPED_SOL_MINT
): PublicKey{
  return metaplex
    .auctionHouse()
    .pdas()
    .auctionHouse({
      creator,
      treasuryMint
    });
}

async function getOrAuthorizeAuctioneerAuctioneer(
  connection: Connection,
  auctionHouseAddress: PublicKey,
  auctionHouseAuthority: Keypair
): Promise<PublicKey>{
  let auctionHouseAuthorityPda = getAuctioneerAuthorityPda(auctionHouseAddress);
  if(await connection.getAccountInfo(auctionHouseAuthorityPda) == null){
    let tx = new Transaction();
    tx.add(
      createAuthorizeInstruction({
        wallet: auctionHouseAuthority.publicKey,
        auctionHouse: auctionHouseAddress,
        auctioneerAuthority: auctionHouseAuthorityPda
      })
    );

    await sendAndConfirmTransaction(connection, tx, [auctionHouseAuthority]);
  }

  return auctionHouseAuthorityPda;
}

function getAuctioneerAuthorityPda(auctionHouseAddress: PublicKey): PublicKey{
  let [address] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("auctioneer"),
      auctionHouseAddress.toBytes()
    ],
    AUCTIONEER_PROGRAM_ID
  );
  return address;
}

async function main(){
  if(!process.env.PROVIDER_URL){
    console.error(`PROVIDER_URL must be set`);
    return;
  }
  const connection = new Connection(process.env.PROVIDER_URL);

  let metaplex = Metaplex
    .make(connection);

  let auctionHouseKeypair = await generateOrLoadKeypair("auctionHouseKeypair.json");
  let timedAuctionHouseKeypair = await generateOrLoadKeypair("timedAuctionHouseKeypair.json");
  console.log();

  if([
    await ensureAccountBalance(connection, auctionHouseKeypair.publicKey, 0.01),
    await ensureAccountBalance(connection, timedAuctionHouseKeypair.publicKey, 0.01)
  ].some((e) => !e))
    return;

  // create auction house
  let auctionHouseConfig: CreateAuctionHouseInput = {
    sellerFeeBasisPoints: 100,
    feeWithdrawalDestination: new PublicKey("BH8k3e6qoNYugGpvDZxSKEkKWhv13jYdr4Hym2XwdGYT"),
    treasuryWithdrawalDestinationOwner: new PublicKey("BH8k3e6qoNYugGpvDZxSKEkKWhv13jYdr4Hym2XwdGYT"),
  };
  console.log("creating auction house with config:");
  console.log(JSON.stringify(auctionHouseConfig, null, 4));
  let auctionHouseAddress = await getOrCreateAuctionHouseAddress(
    metaplex,
    auctionHouseKeypair,
    auctionHouseConfig
  );
  console.log();

  // create timed auction house
  let timedAuctionHouseConfig: CreateAuctionHouseInput = {
    sellerFeeBasisPoints: 100,
    feeWithdrawalDestination: new PublicKey("BH8k3e6qoNYugGpvDZxSKEkKWhv13jYdr4Hym2XwdGYT"),
    treasuryWithdrawalDestinationOwner: new PublicKey("BH8k3e6qoNYugGpvDZxSKEkKWhv13jYdr4Hym2XwdGYT"),
  };

  let timedAuctionHouseAddress = getAuctionHouseAddress(
    metaplex,
    timedAuctionHouseKeypair.publicKey,
    timedAuctionHouseConfig.treasuryMint
  );
  timedAuctionHouseConfig.auctioneerAuthority = getAuctioneerAuthorityPda(auctionHouseAddress);

  console.log("creating timed auction house with config:");
  console.log(JSON.stringify(timedAuctionHouseConfig, null, 4));
  await getOrCreateAuctionHouseAddress(
    metaplex,
    timedAuctionHouseKeypair,
    timedAuctionHouseConfig
  );

  console.log(`authorizing auction house (${timedAuctionHouseAddress}) to auctioneer`);
  let auctioneerAuthorityPda = await getOrAuthorizeAuctioneerAuctioneer(
    connection,
    timedAuctionHouseAddress,
    timedAuctionHouseKeypair
  );
  console.log(`auction house authorized at ${auctioneerAuthorityPda}`);

  console.log();
  console.log();

  console.log("env:");
  console.log(`AUCTION_HOUSE_PUBLIC_KEY=${auctionHouseAddress}`);
  console.log(`AUCTION_HOUSE_OWNER_ADDRESS=${auctionHouseKeypair.publicKey}`);
  console.log(`TIMED_AUCTION_HOUSE_PUBLIC_KEY=${timedAuctionHouseAddress}`);
  console.log(`TIMED_AUCTION_HOUSE_OWNER_ADDRESS=${timedAuctionHouseKeypair.publicKey}`);
}

main();
