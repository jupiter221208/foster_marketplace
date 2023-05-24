import { PublicKey, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js'

export const DAO_TREASURY_ADDRESS = new PublicKey('8urUAT6cdM8JL295vJvngWBcpXBybrs7rrpSa7vGoo5f')
export const TURKEY_CIRCUS_COLLECTION_ID = new PublicKey('A1QYswS6SdEKwm4SdubkQiDGkdobjWQuzesvx7uxGs8r')

export const PROPOSAL_FEE_LAMPORTS = 0.1 * LAMPORTS_PER_SOL
export const VOTE_FEE_LAMPORTS = 0.05 * LAMPORTS_PER_SOL

export const EVENT_PREFIX = 'FosterDAO'
export const DAO_EVENTS = {
  PROPOSAL_SUBMIT: `${EVENT_PREFIX}:proposal-submit`,
  PROPOSAL_VOTE: `${EVENT_PREFIX}:proposal-vote`,
}

export interface DaoProposal {
  proposalKey: string
  proposer: string
  category: string
  title: string
  overview: string
  metrics: string
  treasurySpendAmount: string
  timeline: string
  voteStart: string
  voteEnd: string
}

export function linkKeysToTransaction(tx: Transaction, ...keys: PublicKey[]): Transaction {
  // add instruction to noop program to link keys
  return tx.add(
    new TransactionInstruction({
      keys: keys.map(pubkey => ({ pubkey, isSigner: false, isWritable: true })),
      data: Buffer.from([]),
      programId: new PublicKey('noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV'),
    })
  )
}

export interface createNewProposalTransactionArgs {
  proposalKey: PublicKey
  proposer: PublicKey
  title: string
  url: string
}

export function createNewProposalTransaction({
  proposalKey,
  proposer,
  title,
  url,
}: createNewProposalTransactionArgs): Transaction {
  let tx = new Transaction()

  tx.add(
    new TransactionInstruction({
      keys: [
        { pubkey: proposalKey, isSigner: true, isWritable: false },
        { pubkey: proposer, isSigner: true, isWritable: false },
      ],
      data: Buffer.from(
        JSON.stringify({
          event: DAO_EVENTS.PROPOSAL_SUBMIT,
          proposal: title,
          url,
        }),
        'utf-8'
      ),
      programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
    })
  )
  tx.add(
    SystemProgram.transfer({
      fromPubkey: proposer,
      toPubkey: DAO_TREASURY_ADDRESS,
      lamports: PROPOSAL_FEE_LAMPORTS,
    })
  )

  linkKeysToTransaction(tx, proposalKey)
  tx.feePayer = proposer

  return tx
}

export interface createVoteTransactionArgs {
  proposalKey: PublicKey
  voter: PublicKey
  vote: string
}

export function createVoteTransaction({ proposalKey, voter, vote }: createVoteTransactionArgs) {
  let tx = new Transaction()

  let [votePublicKey] = PublicKey.findProgramAddressSync(
    [Buffer.from(DAO_EVENTS.PROPOSAL_VOTE), proposalKey.toBytes(), voter.toBytes()],
    proposalKey
  )
  tx.add(
    new TransactionInstruction({
      keys: [{ pubkey: voter, isSigner: true, isWritable: false }],
      data: Buffer.from(
        JSON.stringify({
          event: DAO_EVENTS.PROPOSAL_VOTE,
          vote,
        }),
        'utf-8'
      ),
      programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
    })
  )
  tx.add(
    SystemProgram.transfer({
      fromPubkey: voter,
      toPubkey: DAO_TREASURY_ADDRESS,
      lamports: VOTE_FEE_LAMPORTS,
    })
  )

  linkKeysToTransaction(tx, proposalKey, votePublicKey)
  tx.feePayer = voter

  return tx
}
