import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../utils/db'

const getProposals = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  try {
    //      client.query("SELECT * FROM my_table WHERE my_varchar = $1", [userInput]);
    const { page, rows } = req.body

    const query = `SELECT * FROM dao_proposals LIMIT ${rows} OFFSET ${rows * page}`
    console.log('=============================================', query)
    const result = await conn().query(query)
    res.status(200).json({ success: true, proposals: result.rows })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err })
  }
}

export default getProposals
