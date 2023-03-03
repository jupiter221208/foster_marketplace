import { type Connection, Transaction } from "@solana/web3.js";
import { BundlrStorageDriver } from "@metaplex-foundation/js";

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export default class ConfirmingBundlrStorageDriver extends BundlrStorageDriver {
  async bundlr() {
    const nodeAddress = this._options.address;

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
            "confirmed"
          );

          for (let j = 0; j < 25; j++) {
            let response = await fetch(`${nodeAddress}/account/balance/solana`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({ tx_id: signature }),
            });
            if (response.ok) break;
            else {
              console.warn(
                `failed to post fund transaction ${signature} to bundlr: attempt ${i}`,
                await response.text()
              );
              await sleep(2000);
            }
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
