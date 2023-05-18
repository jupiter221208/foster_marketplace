import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../lib/db'

const castVote = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id, vote_status } = req.body

    const query = `UPDATE "dao_proposals" SET total_votes = total_votes + 1 WHERE id=${id}`
    await conn.query(query)

    let vote_query
    if (vote_status) {
      vote_query = `UPDATE "dao_proposals" SET approved_votes = approved_votes + 1 WHERE id=${id}`
    } else {
      vote_query = `UPDATE "dao_proposals" SET opposed_votes = opposed_votes + 1 WHERE id=${id}`
    }

    await conn.query(vote_query)
    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err })
  }
}

export default castVote
