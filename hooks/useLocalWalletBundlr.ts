import type { PublicKey, Commitment } from "@solana/web3.js";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import type { BigNumber, BigNumberValues } from "@metaplex-foundation/js";
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
  walletAdapterIdentity,
  isBundlrStorageDriver,
  toBigNumber,
} from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState, useMemo } from "react";

import ConfirmingBundlrStorageDriver from "utils/ConfirmingBundlrStorageDriver";

export const useLocalWalletBundlr = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const metaplex = useMemo(() => {
    let metaplex = Metaplex.make(connection);
    metaplex.storage().setDriver(
      new ConfirmingBundlrStorageDriver(metaplex, {
        address: process.env.BUNDLR_ADDRESS || "",
        providerUrl: process.env.PROVIDER_URL || "",
        timeout: 60000,
      })
    );
    return metaplex;
  }, [connection]);

  const [keypair, setKeypair] = useState<null | Keypair>(null);
  useEffect(() => {
    if(!publicKey)
      return;

    let keypair = Keypair.fromSeed(publicKey.toBytes());
    metaplex.use(keypairIdentity(keypair));
    setKeypair(keypair);
  }, [publicKey]);

  const storage = metaplex.storage();
  const bundlr = storage.driver();
  if(!isBundlrStorageDriver(bundlr))
    throw new Error("unreachable");

  async function ensureLocalWalletBalance(
    amount: BigNumberValues,
    commitment?: Commitment
  ): Promise<string> {
    let currentBalance = await connection.getBalance(keypair.publicKey);
    let difference = toBigNumber(amount).sub(toBigNumber(currentBalance));

    // ensure minimum balance for rent-exemption
    const MINIMUM_BALANCE = 900_000;
    if (difference.neg().toNumber() < MINIMUM_BALANCE)
      difference.iadd(toBigNumber(MINIMUM_BALANCE));

    return fundLocalWallet(difference, commitment);
  }

  async function fundLocalWallet(
    amount: BigNumberValues,
    commitment?: Commitment
  ): Promise<string> {
    let amountBn = toBigNumber(amount);
    if (amountBn.lte(toBigNumber(0))) return "";

    let tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: keypair.publicKey,
        lamports: amountBn.toNumber()
      })
    );

    let blockhashInfo = await metaplex.rpc().getLatestBlockhash();
    tx.recentBlockhash = blockhashInfo.blockhash;

    let signature = await sendTransaction(tx, connection);
    if (commitment)
      await metaplex
        .rpc()
        .confirmTransaction(signature, blockhashInfo, commitment);
    console.log(`funded local wallet with ${amount} lamports: ${signature}`);
    return signature;
  }

  return { storage, bundlr, keypair, fundLocalWallet, ensureLocalWalletBalance };
};
