import type { NextApiRequest, NextApiResponse } from 'next'
import conn from 'utils/db'

const castVote = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { proposal_id, wallet_id, vote_status } = req.body
    console.log('==========proposal_id, wallet_id, vote_status ========', proposal_id, wallet_id, vote_status)

    const vote_exist_query = 'SELECT * FROM dao_votes where proposal_id=$1 and wallet_id=$2'
    const votes = await conn().query(vote_exist_query, [proposal_id, wallet_id])
    console.log('==========votes.rows========', votes.rows)
    if (votes.rows.length > 0) {
      res.status(200).json({ success: true })
      return
    } else {
      const vote_insert_query = 'INSERT INTO dao_votes ( proposal_id, wallet_id, vote_status) VALUES ($1, $2, $3)'
      await conn().query(vote_insert_query, [proposal_id, wallet_id, vote_status === true ? 'approved' : 'opposed'])
    }

    const query = 'UPDATE dao_proposals SET total_votes = total_votes + 1 WHERE id=$1'
    await conn().query(query, [proposal_id])

    let vote_query
    if (vote_status) {
      vote_query = 'UPDATE dao_proposals SET approved_votes = approved_votes + 1 WHERE id=$1'
    } else {
      vote_query = 'UPDATE dao_proposals SET opposed_votes = opposed_votes + 1 WHERE id=$1'
    }

    await conn().query(vote_query, [proposal_id])
    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err })
  }
}

export default castVote
