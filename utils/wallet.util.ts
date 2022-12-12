import { TokenData } from './../config/types'
import { Connection, PublicKey } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Metadata, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata'
import { NFT } from 'config/types'

export async function loadMetadata(mint: PublicKey, connection: Connection): Promise<Metadata | undefined> {
  const [metadataPublicKey] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode('metadata'), PROGRAM_ID.toBuffer(), mint.toBuffer()],
    PROGRAM_ID
  )

  return Metadata.fromAccountAddress(connection, metadataPublicKey)
}

export async function getTokensByAccount(
  account: PublicKey,
  connection: Connection,
  includeOffChainMetadata = true
): Promise<TokenData[]> {
  const tokens = await connection.getParsedTokenAccountsByOwner(account, {
    programId: TOKEN_PROGRAM_ID,
  })

  // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
  let nfts: NFT[] = tokens.value
    .filter(t => {
      const amount = t.account.data.parsed.info.tokenAmount
      return amount.decimals === 0 && amount.uiAmount === 1
    })
    .map(t => ({ pubkey: t.pubkey, mint: new PublicKey(t.account.data.parsed.info.mint) }))

  nfts = (
    await Promise.all(
      nfts.map(async nft => {
        try {
          nft.metadata = await loadMetadata(nft.mint, connection)
        } catch (e) {
          // console.log(e)
          console.log(`failed to pull metadata for token ${nft.mint.toString()}`)
        }

        return nft
      })
    )
  ).filter(nft => nft.metadata)

  if (includeOffChainMetadata) {
    nfts = (
      await Promise.all(
        nfts.map(async nft => {
          try {
            nft.offChainMetatata = await fetch(nft.metadata!.data.uri).then(r => r.json())
          } catch (e) {
            // console.log(e)
            console.log(`failed to pull off chain metadata for token ${nft.mint.toString()}`)
          }

          return nft
        })
      )
    ).filter(nft => nft.offChainMetatata)
  }

  return nfts.map(nft => ({
    id: nft.mint.toString(),
    mint: nft.mint,
    name: nft.offChainMetatata?.name || nft.metadata?.data.name || 'No Name',
    image: nft.offChainMetatata?.image,
    category: nft.offChainMetatata?.category,
    properties: nft.offChainMetatata?.properties,
  }))
}

export function getShortAddress(publicKey: PublicKey | null) {
  const base58 = publicKey?.toString() || ''

  return (base58 && base58.slice(0, 4) + '***' + base58.slice(-4)) || ''
}
