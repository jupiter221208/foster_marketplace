import type { NextApiRequest, NextApiResponse } from 'next'
import conn from 'utils/db'

const getProposalDetail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  try {
    const { proposal_id } = req.body

    const query = `SELECT * FROM dao_proposals WHERE id=$1`
    const result = await conn().query(query, [proposal_id])
    res.status(200).json({ success: true, proposals: result.rows })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err })
  }
}

export default getProposalDetail
