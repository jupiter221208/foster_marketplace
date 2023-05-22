import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../utils/db'

const getStats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { page, rows } = req.body

    const query = `SELECT * FROM dao_proposals LIMIT ${rows} OFFSET ${rows * page}`
    const result = await conn().query(query)
    res.status(200).json({ success: true, proposals: result.rows })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err })
  }
}

export default getStats
