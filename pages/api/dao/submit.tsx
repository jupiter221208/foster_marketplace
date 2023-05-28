import type { NextApiRequest, NextApiResponse } from 'next'
import conn from 'utils/db'
import { Keypair } from '@solana/web3.js'

const submitProposal = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const {
      title,
      author,
      walletId,
      category,
      overview,
      metrics,
      treasury,
      eta_timeline,
      vote_start,
      vote_duration,
      signature,
      url,
      secretKey,
    } = req.body

    const proposalKeypair = Keypair.fromSecretKey(Buffer.from(secretKey, 'hex'))

    const query =
      'INSERT INTO dao_proposals(title, author, wallet_id, category, overview, metrics, treasury, eta_timeline, vote_start, vote_duration, proposal_key, signature, proposal_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)'
    let values = [
      title,
      author,
      walletId,
      category,
      overview,
      metrics,
      treasury,
      eta_timeline,
      vote_start,
      vote_duration,
      proposalKeypair.publicKey.toString(),
      signature,
      url,
    ]
    await conn().query(query, values)

    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err })
  }
}

export default submitProposal
