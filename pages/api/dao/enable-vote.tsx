import type { NextApiRequest, NextApiResponse } from 'next'
import conn from 'utils/db'

const enableCastVote = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { proposal_id, wallet_id } = req.body
    const vote_exist_query = 'SELECT * FROM dao_votes where proposal_id=$1 and wallet_id=$2'
    const votes = await conn().query(vote_exist_query, [proposal_id, wallet_id])
    if (votes.rows.length > 0) {
      res.status(200).json({ success: true, voted: true })
      return
    } else {
      res.status(200).json({ success: true, voted: false })
    }
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err })
  }
}

export default enableCastVote
