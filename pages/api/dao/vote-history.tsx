import type { NextApiRequest, NextApiResponse } from 'next'
import conn from 'utils/db'

const getVoteHistory = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { proposal_id } = req.body

    const query =
      'select dao_votes.*, users.username from dao_votes left join users on dao_votes.wallet_id=users.wallet_id where dao_votes.proposal_id=$1'
    const result = await conn().query(query, [proposal_id])

    res.status(200).json({ success: true, votes: result.rows })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err })
  }
}

export default getVoteHistory
