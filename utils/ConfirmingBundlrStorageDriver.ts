import { BigNumber } from "bignumber.js";
import { BundlrStorageDriver, Metaplex } from "@metaplex-foundation/js";
import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { sendTransactionWithRetry } from "utils/transactions";

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export interface ConfirmingBundlrStorageDriverConstructorArgs {
  network: string;
  providerUrl: string;
  timeout: number;
}

export default class ConfirmingBundlrStorageDriver extends BundlrStorageDriver {
  network: string;

  constructor(
    metaplex: Metaplex,
    { network, providerUrl, timeout }: ConfirmingBundlrStorageDriverConstructorArgs
  ) {
    let address =
      network == "mainnet-beta" ? "https://turbo.ardrive.io" : "https://devnet.bundlr.network";
    super(metaplex, {
      address,
      providerUrl,
      timeout,
    });

    this.network = network;
  }

  override async bundlr() {
    const nodeAddress = this._options.address;

    this._bundlr ??= await this.initBundlr();

    this._bundlr.currencyConfig.createTx = async function (amount, to, _fee) {
      const pubkey = new PublicKey(await this.getPublicKey());
      const transaction = new Transaction({
        feePayer: pubkey,
      });
      transaction.add(
        ComputeBudgetProgram.setComputeUnitLimit({
          units: 500,
        }),
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 20_000_000,
        }),
        SystemProgram.transfer({
          fromPubkey: pubkey,
          toPubkey: new PublicKey(to),
          lamports: new BigNumber(amount).toNumber(),
        })
      );
      return {
        tx: transaction,
        txId: undefined,
      };
    };

    this._bundlr.currencyConfig.sendTx = async function (data: Transaction) {
      interface CurrencyInterface {
        getProvider(): Promise<Connection>;
        wallet: {
          signTransaction(data: Transaction): Promise<Transaction>;
        };
      }

      let currency = this as unknown as CurrencyInterface;
      let connection = await currency.getProvider();

      // wait for upto 60s for the account to exist
      let fundingAccount = data.feePayer;
      let fundingAccountInfo;
      for (let i = 1; i <= 30; i++) {
        console.log(`waiting for funding account to receive balance: attempt ${i}`);
        fundingAccountInfo = await connection.getAccountInfo(fundingAccount, "finalized");
        if (fundingAccountInfo) {
          console.log("success!");
          break;
        }
        await sleep(2000);
      }
      if (!fundingAccountInfo?.lamports)
        throw new Error(
          `could not confirm existing of funding account in 30 attempts: ${fundingAccount}`
        );

      let retryCount = 5;
      let signature: string | null = null;
      outer: for (let i = 0; i < retryCount; i++) {
        let { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        data.recentBlockhash = blockhash;
        data.lastValidBlockHeight = lastValidBlockHeight;
        let signedTransaction = await currency.wallet.signTransaction(data);

        console.log(
          `attempting to send irys funding transaction: attempt ${i + 1} of ${retryCount}`
        );
        signature = await sendTransactionWithRetry({
          connection: new Connection(connection.rpcEndpoint),
          transaction: signedTransaction,
          maxHeight: lastValidBlockHeight,
          skipPreflight: true,
          retryInterval: 1000,
        });

        if (!signature) {
          if (i == retryCount - 1)
            console.error(`failed to confirm transaction ${signature}: retry attempts exceeded`);
          else {
            console.warn(
              `failed to confirm transaction ${signature}: attempt ${i + 1} of ${retryCount}`
            );
            // if transaction fails then wait for one second before retrying
            await sleep(1000);
          }
          continue;
        }

        for (let j = 0; j < 25; j++) {
          let response = await fetch(new URL("account/balance/solana", nodeAddress), {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ tx_id: signature }),
          });
          if (response.ok) break outer;
          else {
            console.warn(
              `failed to post fund transaction ${signature} to bundlr: attempt ${i}`,
              await response.text()
            );
            await sleep(1000);
          }
        }

        // if tx failed once before, wait for 1s before returning
        if (i !== 0) await sleep(1000);
      }

      return signature;
    };

    return this._bundlr;
  }

  override async uploadAll(files) {
    let hostname =
      this.network == "mainnet-beta"
        ? "arweave.net"
        : // switch to irys gateway for devnet if needed
          "gateway.irys.xyz";
          // "arweave.net";

    let urls = await super.uploadAll(files);
    return urls.map((arweave) => {
      let url = new URL(arweave);
      url.hostname = hostname;
      return url.toString();
    });
  }
}
