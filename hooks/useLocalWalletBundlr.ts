import type { PublicKey } from "@solana/web3.js";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import type {
  BigNumber,
  BigNumberValues,
  StorageClient,
  MetaplexFile,
} from "@metaplex-foundation/js";
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

export const useLocalWalletBundlr = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(
      bundlrStorage({
        address: process.env.BUNDLR_ADDRESS || "",
        providerUrl: process.env.PROVIDER_URL || "",
        timeout: 60000,
      })
    );
  }, [connection]);

  const [keypair, setKeypair] = useState<null | Keypair>(null);
  useEffect(() => {
    if (!publicKey) return;

    let keypair = Keypair.fromSeed(publicKey.toBytes());
    metaplex.use(keypairIdentity(keypair));
    setKeypair(keypair);
  }, [publicKey]);

  const bundlr = metaplex.storage().driver();
  if (!isBundlrStorageDriver(bundlr)) throw new Error("unreachable");

  async function ensureLocalWalletBalance(amount: BigNumberValues): Promise<string> {
    let currentBalance = await connection.getBalance(keypair.publicKey);
    let difference = toBigNumber(amount).sub(toBigNumber(currentBalance));

    // ensure minimum balance for rent-exemption
    const MINIMUM_BALANCE = 900_000;
    if (currentBalance < MINIMUM_BALANCE) difference.iadd(toBigNumber(MINIMUM_BALANCE));

    return fundLocalWallet(difference);
  }

  async function fundLocalWallet(amount: BigNumberValues): Promise<string> {
    let amountBn = toBigNumber(amount);
    if (amountBn.lte(toBigNumber(0))) return "";

    let tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: keypair.publicKey,
        lamports: amountBn.toNumber(),
      })
    );

    let signature = await sendTransaction(tx, connection);
    console.log(`funded local wallet with ${amount} lamports: ${signature}`);
    return signature;
  }

  const storageClient = metaplex.storage();

  async function uploadAllWithRetry(files: MetaplexFile[]): Promise<string[]> {
    let wait = 2000;
    let retryCount = 5;

    for (let i = 0; i < retryCount; i++)
      try {
        return await storageClient.uploadAll(files);
      } catch (e) {
        if (i == retryCount - 1)
          console.error(`upload failed for ${files.length} files: retry attempts exceeded`, e);
        else
          console.warn(
            `upload failed for ${files.length} files: attempt ${i + 1} of ${retryCount}`,
            e
          );
        await new Promise(resolve => setTimeout(resolve, wait));
      }
  }

  async function uploadJsonWithRetry<T extends object>(json: T): Promise<string> {
    let wait = 2000;
    let retryCount = 5;

    for (let i = 0; i < retryCount; i++)
      try {
        return await storageClient.uploadJson(json);
      } catch (e) {
        if (i == retryCount - 1)
          console.error(`upload failed for json: retry attempts exceeded`, json, e);
        else console.warn(`upload failed for json: attempt ${i + 1} of ${retryCount}`, json, e);
        await new Promise(resolve => setTimeout(resolve, wait));
      }
  }

  const storage: Omit<StorageClient, "driver" | "setDriver" | "download" | "downloadJson"> = {
    getUploadPriceForBytes: bytes => storageClient.getUploadPriceForBytes(bytes),
    getUploadPriceForFile: file => storageClient.getUploadPriceForFile(file),
    getUploadPriceForFiles: files => storageClient.getUploadPriceForFiles(files),
    upload: file => uploadAllWithRetry([file]).then(([url]) => url),
    uploadAll: uploadAllWithRetry,
    uploadJson: uploadJsonWithRetry,
  };

  return {
    storage,
    bundlr,
    keypair,
    fundLocalWallet,
    ensureLocalWalletBalance,
  };
};
