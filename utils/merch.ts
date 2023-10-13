import { type TransactionInstruction, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { type Metaplex, sol, token, toMetadata, toMetadataAccount } from '@metaplex-foundation/js'

import { type ShipStationShipment } from 'apis/merch'
import { addUrlSearchParams } from 'utils'

export const MERCH_FOSTER_ADDRESS = new PublicKey('BH8k3e6qoNYugGpvDZxSKEkKWhv13jYdr4Hym2XwdGYT')
export const MERCH_MADDIES_ADDRESS = new PublicKey('A5TdavAYJ45hQyz8B7u6AAjFe8KyXKqWSnygU3YbhKVU')

export const USDC_ADDRESS = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
export const USDC_DECIMALS = 6

export const SHIPPING_SERVICE_NAMES = {
  usps_priority_mail: 'USPS Priority Mail',
  usps_priority_mail_express: 'USPS Priority Mail Express',
  usps_parcel_select: 'USPS Parcel Select Ground',
  usps_first_class_mail: 'USPS First Class Mail',
  usps_media_mail: 'USPS Media Mail',
  usps_ground_advantage: 'USPS Ground Advantage',
  usps_priority_mail_international: 'USPS Priority Mail Intl',
  usps_priority_mail_express_international: 'USPS Priority Mail Express Intl',
  usps_first_class_mail_international: 'USPS First Class Mail Intl',
  globalpost_parcel_select_smart_saver: 'GlobalPost Parcel Select SmartSaver',
}

export function getShippingServiceName(code: string): string {
  return SHIPPING_SERVICE_NAMES[code] ?? code
}

export function getTrackingUrl({ serviceCode, trackingNumber }: ShipStationShipment): string {
  if (serviceCode.startsWith('usps_'))
    return addUrlSearchParams('https://tools.usps.com/go/TrackConfirmAction.action', {
      tLabels: trackingNumber,
    }).toString()
  else if (serviceCode.startsWith('ups_'))
    return addUrlSearchParams('https://www.ups.com/track', { tracknum: trackingNumber }).toString()

  console.warn(`unknown shipping service: ${serviceCode}, tracking number: ${trackingNumber}`)
  return '#'
}

export interface CreatePaymentTransactionArgs {
  metaplex: Metaplex
  nftAddress: string
  usdAmounts: {
    maddiesAmount: number
    fosterAmount: number
    artistAmount: number
  }
  solToUsdRate: number
  currency: 'sol' | 'usdc'
}

function addTransferAmount(amountSplits: Map<string, number>, addressOrKey: string | PublicKey, amount: number): void {
  if (amount == 0) return
  let address = addressOrKey.toString()
  amount += amountSplits.get(address) ?? 0
  amountSplits.set(address, amount)
}

export async function createPaymentTransaction({
  metaplex,
  nftAddress,
  usdAmounts: { maddiesAmount, fosterAmount, artistAmount },
  solToUsdRate,
  currency,
}: CreatePaymentTransactionArgs): Promise<Transaction> {
  if (currency == 'sol') {
    maddiesAmount /= solToUsdRate
    fosterAmount /= solToUsdRate
    artistAmount /= solToUsdRate
  }

  let amountSplits = new Map<string, number>()
  addTransferAmount(amountSplits, MERCH_MADDIES_ADDRESS, maddiesAmount)
  addTransferAmount(amountSplits, MERCH_FOSTER_ADDRESS, fosterAmount)

  let metadataAddress = metaplex
    .nfts()
    .pdas()
    .metadata({ mint: new PublicKey(nftAddress) })
  let metadataAccountInfo = await metaplex.rpc().getAccount(metadataAddress)
  if (!metadataAccountInfo.exists)
    throw new Error(`metadata account does not exist for mint ${nftAddress}: ${metadataAddress}`)
  let metadata = toMetadata(toMetadataAccount(metadataAccountInfo))

  if (metadata.creators)
    for (let { address, share } of metadata.creators) {
      addTransferAmount(amountSplits, address, (share * artistAmount) / 100)
    }

  let identity = metaplex.identity()
  let instructions: TransactionInstruction[][] = []
  if (currency == 'sol')
    for (let [address, amount] of amountSplits)
      instructions.push([
        SystemProgram.transfer({
          fromPubkey: identity.publicKey,
          toPubkey: new PublicKey(address),
          lamports: Math.floor(amount * LAMPORTS_PER_SOL),
        }),
      ])
  else if (currency == 'usdc') {
    let addresses = Array.from(amountSplits.keys())
    let ataAddresses = addresses.map(address => getAssociatedTokenAddressSync(USDC_ADDRESS, new PublicKey(address)))
    let ataAccountInfos = await metaplex.connection.getMultipleAccountsInfo(ataAddresses)

    let sourceAta = getAssociatedTokenAddressSync(USDC_ADDRESS, identity.publicKey)
    for (let i = 0; i < addresses.length; i++) {
      let amount = amountSplits.get(addresses[i])
      if (!amount) throw new Error(`unknown address: ${addresses[i]}`)
      amount *= 10 ** USDC_DECIMALS

      let address = new PublicKey(addresses[i])
      let ixs: TransactionInstruction[] = []
      if (!ataAccountInfos[i])
        ixs.push(createAssociatedTokenAccountInstruction(identity.publicKey, ataAddresses[i], address, USDC_ADDRESS))
      ixs.push(createTransferInstruction(sourceAta, ataAddresses[i], identity.publicKey, amount))
      instructions.push(ixs)
    }
  } else throw new Error(`unsupported currency: ${currency}`)

  // TODO: handle transfers that don't fit into one tx
  // splitIntoTransactions(instructions)

  let transaction = new Transaction()
  transaction.feePayer = identity.publicKey
  transaction.add(...instructions.flatMap(ixs => ixs))

  return transaction
}
