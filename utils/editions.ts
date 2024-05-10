import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from '@solana/web3.js'
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PROGRAM_ID as METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata'
import { Metaplex, type SendAndConfirmTransactionResponse } from '@metaplex-foundation/js'

export interface FindPrintDelegateArgs {
  mint: PublicKey
  owner: PublicKey
  delegate: PublicKey
}

export function findPrintDelegate({ mint, owner, delegate }: FindPrintDelegateArgs): PublicKey {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('print_delegate'),
      owner.toBuffer(),
      delegate.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  )[0]
}

export interface DelegateEditionArgs {
  metaplex: Metaplex
  mint: PublicKey
  delegate: PublicKey
}
export async function delegateEdition({
  metaplex,
  mint,
  delegate,
}: DelegateEditionArgs): Promise<SendAndConfirmTransactionResponse | null> {
  let { value: largestAccounts } = await metaplex.connection.getTokenLargestAccounts(mint)
  let ata = largestAccounts.find(({ amount }) => amount == '1')?.address
  let { ownerAddress: owner } = await metaplex.tokens().findTokenByAddress({ address: ata })
  if (!owner) throw new Error(`could not find token owner for ${mint}`)

  let printDelegate = findPrintDelegate({
    mint,
    owner,
    delegate,
  })

  let printDelegateAccount = await metaplex.getAccount(printDelegate)
  if (!printDelegateAccount.exists) return null

  let delegateIx = new TransactionInstruction({
    keys: [
      {
        pubkey: printDelegate,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: delegate,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: metaplex.nfts().pdas().metadata({ mint }),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: metaplex.nfts().pdas().masterEdition({ mint }),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: METADATA_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: mint,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: ata,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: owner,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: metaplex.identity().publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSVAR_INSTRUCTIONS_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: METADATA_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: METADATA_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: Buffer.from([44, 13, 0]),
    programId: METADATA_PROGRAM_ID,
  })

  let tx = new Transaction()
  tx.add(delegateIx)
  tx.feePayer = metaplex.identity().publicKey
  let latestBlockhash = await metaplex.rpc().getLatestBlockhash()
  tx.recentBlockhash = latestBlockhash.blockhash

  return metaplex.rpc().sendAndConfirmTransaction(
    tx,
    {
      commitment: 'single',
      maxRetries: 5,
    },
    [metaplex.identity()]
  )
}

export interface RevokeDelegateEditionArgs {
  metaplex: Metaplex
  mint: PublicKey
  delegate: PublicKey
}
export async function revokeDelegateEdition({
  metaplex,
  mint,
  delegate,
}: RevokeDelegateEditionArgs): Promise<SendAndConfirmTransactionResponse | null> {
  let { value: largestAccounts } = await metaplex.connection.getTokenLargestAccounts(mint)
  let ata = largestAccounts.find(({ amount }) => amount == '1')?.address
  let { ownerAddress: owner } = await metaplex.tokens().findTokenByAddress({ address: ata })
  if (!owner) throw new Error(`could not find token owner for ${mint}`)

  let printDelegate = findPrintDelegate({
    mint,
    owner,
    delegate,
  })

  let delegateIx = new TransactionInstruction({
    keys: [
      {
        pubkey: printDelegate,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: delegate,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: metaplex.nfts().pdas().metadata({ mint }),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: metaplex.nfts().pdas().masterEdition({ mint }),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: METADATA_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: mint,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: ata,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: owner,
        isSigner: true,
        isWritable: false,
      },
      {
        pubkey: metaplex.identity().publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSVAR_INSTRUCTIONS_PUBKEY,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: METADATA_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: METADATA_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    ],
    data: Buffer.from([45, 14]),
    programId: METADATA_PROGRAM_ID,
  })

  let tx = new Transaction()
  tx.add(delegateIx)
  tx.feePayer = metaplex.identity().publicKey
  let latestBlockhash = await metaplex.rpc().getLatestBlockhash()
  tx.recentBlockhash = latestBlockhash.blockhash

  return metaplex.rpc().sendAndConfirmTransaction(
    tx,
    {
      commitment: 'single',
      maxRetries: 5,
    },
    [metaplex.identity()]
  )
}
