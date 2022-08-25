import { PublicKey } from '@solana/web3.js'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'

export interface OffChainMetatata {
  name: string
  image: string
}

export interface NFT {
  pubkey: PublicKey
  mint: PublicKey
  metadata?: Metadata
  offChainMetatata?: OffChainMetatata
}

export interface TokenData {
  id: string
  mint: PublicKey
  name: string
  image?: string
  artist?: any
  price?: number
}
