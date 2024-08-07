import { NextApiRequest, NextApiResponse } from 'next'
import { generateActionsJson } from 'utils/blinks'

export default function getActionsJson(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(generateActionsJson(process.env.BACKEND_URL))
}
