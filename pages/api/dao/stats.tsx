import type { NextApiRequest, NextApiResponse } from 'next'
import conn from '../../../utils/db'
import { isExpiredDate } from 'utils/helpers'

const getStats = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = `SELECT * FROM dao_proposals`
    const result = await conn().query(query)
    let total_count = 0
    let live_count = 0
    let pending_count = 0
    let closed_count = 0
    let proposals = result.rows
    proposals.forEach(element => {
      if (isExpiredDate(element.vote_start, element.vote_duration)) {
        closed_count++
      } else if (isExpiredDate(element.created_at, 2 * 24)) {
        live_count++
      } else {
        pending_count++
      }
      total_count++
    })
    res.status(200).json({ success: true, stats: { total_count, live_count, pending_count, closed_count } })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err })
  }
}

export default getStats
