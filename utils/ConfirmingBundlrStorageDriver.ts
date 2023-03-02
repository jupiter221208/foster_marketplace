import { type Connection, Transaction } from "@solana/web3.js";
import { BundlrStorageDriver } from "@metaplex-foundation/js";

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export default class ConfirmingBundlrStorageDriver extends BundlrStorageDriver {
  async bundlr() {
    this._bundlr ??= await this.initBundlr();

    this._bundlr.currencyConfig.sendTx = async function (data) {
      interface CurrencyInterface {
        getProvider(): Promise<Connection>;
        wallet: {
          sendTransaction(data: Transaction, provider: Connection, options: any): Promise<string>;
        };
      }

      let currency = this as unknown as CurrencyInterface;
      let connection = await currency.getProvider();

      let retryCount = 3;
      let signature: string | null = null;
      for (let i = 0; i < retryCount; i++) {
        let { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        data.blockhash = blockhash;
        data.lastValidBlockHeight = lastValidBlockHeight;

        console.log(`attempting to send transaction: attempt ${i + 1} of ${retryCount}`);
        signature = await currency.wallet.sendTransaction(data, connection, {
          skipPreflight: true,
        });

        try {
          await connection.confirmTransaction(
            {
              signature,
              blockhash: data.blockhash,
              lastValidBlockHeight: data.lastValidBlockHeight,
            },
            "max"
          );

          for (let j = 0; j < 10; j++)
            if (await connection.getTransaction(signature, "finalized")) break;
            else {
              console.warn(`failed to get confirmed transaction ${signature}: attempt ${i}`, e);
              await sleep(2000);
            }

          // if tx failed once before, wait for 5s before returning
          if (i !== 0) await sleep(5000);

          break;
        } catch (e) {
          if (i == retryCount - 1)
            console.error(`failed to confirm transaction ${signature}: retry attempts exceeded`, e);
          else
            console.warn(
              `failed to confirm transaction ${signature}: attempt ${i + 1} of ${retryCount}`,
              e
            );
        }
      }

      return signature;
    };

    return this._bundlr;
  }
}
