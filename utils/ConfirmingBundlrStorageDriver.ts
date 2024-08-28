import { BigNumber } from "bignumber.js";
import { BundlrStorageDriver } from "@metaplex-foundation/js";
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

export default class ConfirmingBundlrStorageDriver extends BundlrStorageDriver {
  async bundlr() {
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
}
