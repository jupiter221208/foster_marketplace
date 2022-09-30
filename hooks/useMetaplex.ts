import {
  bundlrStorage,
  Metaplex,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export const useMetaplex = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const metaplex = useMemo(() => {
    return Metaplex.make(connection)
      .use(walletAdapterIdentity(wallet))
      .use(
        bundlrStorage({
          address: process.env.BUNDLR_ADDRESS || '',
          providerUrl: process.env.PROVIDER_URL || '',
          timeout: 60000,
        })
      );
  }, [connection, wallet]);

  return { metaplex };
};
