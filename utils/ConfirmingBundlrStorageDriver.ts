import { type Connection, Transaction } from "@solana/web3.js";
import { BundlrStorageDriver } from "@metaplex-foundation/js";

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
            "finalized"
          );
          break;
        } catch (e) {
          if (i == retryCount - 1)
            console.error(
              `failed to confirm transaction ${signature} files: retry attempts exceeded`,
              e
            );
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
