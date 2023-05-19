import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../lib/db'

const getProposals = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //      client.query("SELECT * FROM my_table WHERE my_varchar = $1", [userInput]);

    const query = `SELECT * FROM dao_proposals`
    const result = await conn.query(query)
    res.status(200).json({ success: true, proposals: result.rows })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default getProposals
