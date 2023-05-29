import type { NextApiRequest, NextApiResponse } from 'next'
import conn from 'utils/db'

const getProposals = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  try {
    const { page, rows } = req.body

    const query = `SELECT * FROM dao_proposals ORDER BY id DESC LIMIT $1 OFFSET $2`
    const result = await conn().query(query, [rows, rows * page])
    res.status(200).json({ success: true, proposals: result.rows })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err })
  }
}

export default getProposals
