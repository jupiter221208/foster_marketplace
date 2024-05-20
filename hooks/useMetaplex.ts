import {
  ComputeBudgetInstruction,
  ComputeBudgetProgram,
  type Transaction,
} from "@solana/web3.js";
import {
  bundlrStorage,
  Metaplex,
  walletAdapterIdentity,
  type WalletAdapter,
} from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export const DEFAULT_COMPUTE_BUDGET = 10_000_000

export const useMetaplex = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(
      walletAdapterIdentity(walletWithFee(wallet))
    );
  }, [connection, wallet]);

  return { metaplex };
};

export const walletWithFee = (wallet: WalletAdapter): WalletAdapter => {
  return {
    publicKey: wallet.publicKey,
    async signMessage(message: Uint8Array): Promise<Uint8Array> {
      return wallet.signMessage(message);
    },
    async signTransaction(tx: Transaction): Promise<Transaction> {
      return wallet.signTransaction(addComputeBudget(tx));
    },
    async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
      return wallet.signAllTransactions(txs.map(tx => addComputeBudget(tx)));
    },
  };
};

export const addComputeBudget = (tx: Transaction): Transaction => {
  if (tx.signatures.some(({ signature }) => signature))
    return tx;

  let hasComputeInstruction = false;
  for (let instruction of tx.instructions)
    if (instruction.programId.equals(ComputeBudgetProgram.programId)) {
      let ixType = ComputeBudgetInstruction.decodeInstructionType(instruction);
      if (ixType == "SetComputeUnitPrice") {
        hasComputeInstruction = true;
        break;
      }
    }

  if (!hasComputeInstruction)
    tx.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: DEFAULT_COMPUTE_BUDGET,
      })
    );

  return tx;
};
