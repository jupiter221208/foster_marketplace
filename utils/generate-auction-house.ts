import fs from "fs/promises";
import path from "path";
import { Keypair, PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import type { CreateAuctionHouseInput } from "@metaplex-foundation/js";
import { Metaplex, keypairIdentity, WRAPPED_SOL_MINT } from "@metaplex-foundation/js";

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
  let auctionHouseAddress = metaplex
    .auctionHouse()
    .pdas()
    .auctionHouse({
      creator: creator.publicKey,
      treasuryMint: config.treasuryMint ?? WRAPPED_SOL_MINT
    });
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
  let timedAuctionHouseConfig = {
    sellerFeeBasisPoints: 100,
    feeWithdrawalDestination: new PublicKey("BH8k3e6qoNYugGpvDZxSKEkKWhv13jYdr4Hym2XwdGYT"),
    treasuryWithdrawalDestinationOwner: new PublicKey("BH8k3e6qoNYugGpvDZxSKEkKWhv13jYdr4Hym2XwdGYT"),
    auctioneerAuthority: new PublicKey("BH8k3e6qoNYugGpvDZxSKEkKWhv13jYdr4Hym2XwdGYT")
  };
  console.log("creating timed auction house with config:");
  console.log(JSON.stringify(timedAuctionHouseConfig, null, 4));
  let timedAuctionHouseAddress = await getOrCreateAuctionHouseAddress(
    metaplex,
    timedAuctionHouseKeypair,
    timedAuctionHouseConfig
  );
  console.log();
  console.log();

  console.log("env:");
  console.log(`AUCTION_HOUSE_PUBLIC_KEY=${auctionHouseAddress}`);
  console.log(`AUCTION_HOUSE_OWNER_ADDRESS=${auctionHouseKeypair.publicKey}`);
  console.log(`TIMED_AUCTION_HOUSE_PUBLIC_KEY=${timedAuctionHouseAddress}`);
  console.log(`TIMED_AUCTION_HOUSE_OWNER_ADDRESS=${timedAuctionHouseKeypair.publicKey}`);
}

main();
