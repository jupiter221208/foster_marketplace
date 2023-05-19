import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../lib/db'

const submitProposal = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { title, author, walletId, category, overview, metrics, treasury, eta_timeline, vote_start, vote_duration } =
      req.body

    const query = `INSERT INTO "dao_proposals" 
            ( "title", "author", "wallet_id", "category", "overview", "metrics", "treasury", "eta_timeline", "vote_start", "vote_duration")
      VALUES('${title}', '${author}', '${walletId}', '${category}', '${overview}', '${metrics}', '${treasury}', '${eta_timeline}', '${vote_start}', '${vote_duration}')`

    const result = await conn.query(query)

    res.status(200).json({ success: true })
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

export default submitProposal
