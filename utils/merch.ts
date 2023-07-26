import { PublicKey } from '@solana/web3.js'
import { type Metaplex, type TransactionBuilder, sol, token } from '@metaplex-foundation/js'

export const MERCH_FOSTER_ADDRESS = new PublicKey('8urUAT6cdM8JL295vJvngWBcpXBybrs7rrpSa7vGoo5f')
export const MERCH_MADDIES_ADDRESS = new PublicKey('8urUAT6cdM8JL295vJvngWBcpXBybrs7rrpSa7vGoo5f')

export const USDC_ADDRESS = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
export const USDC_DECIMALS = 6

export interface CreatePaymentTransactionArgs {
  metaplex: Metaplex
  usdAmount: number
  solToUsdRate: number
  currency: 'sol' | 'usdc'
}

export async function createPaymentTransaction({
  metaplex,
  usdAmount,
  solToUsdRate,
  currency,
}: CreatePaymentTransactionArgs): Promise<TransactionBuilder> {
  if (currency == 'sol')
    return metaplex
      .system()
      .builders()
      .transferSol({
        to: MERCH_FOSTER_ADDRESS,
        amount: sol(usdAmount / solToUsdRate),
      })
  else if (currency == 'usdc')
    return metaplex
      .tokens()
      .builders()
      .send({
        mintAddress: USDC_ADDRESS,
        amount: token(usdAmount, USDC_DECIMALS, 'USDC'),
        toOwner: MERCH_FOSTER_ADDRESS,
      })

  throw new Error(`unsupported currency: ${currency}`)
}
