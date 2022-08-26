import { TokenData } from './../config/types'
import { Connection, PublicKey } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Metadata, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata'
import { NFT } from 'config/types'

async function loadMetadata(mint: PublicKey, connection: Connection): Promise<Metadata | undefined> {
  try {
    const [metadataPublicKey] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode('metadata'), PROGRAM_ID.toBuffer(), mint.toBuffer()],
      PROGRAM_ID
    )
    return await Metadata.fromAccountAddress(connection, metadataPublicKey)
  } catch (e) {
    console.log(e)
    console.log(`failed to pull metadata for token ${mint}`)
  }
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
    await Promise.all(nfts.map(async nft => ({ ...nft, metadata: await loadMetadata(nft.mint, connection) })))
  ).filter(nft => nft.metadata)

  if (includeOffChainMetadata) {
    nfts = await Promise.all(
      nfts.map(async nft => ({ ...nft, offChainMetatata: await fetch(nft.metadata!.data.uri).then(r => r.json()) }))
    )
  }

  return nfts.map(nft => ({
    id: nft.mint.toBase58(),
    mint: nft.mint,
    name: nft.offChainMetatata?.name || nft.metadata?.data.name || 'No Name',
    image: nft.offChainMetatata?.image,
  }))
}
