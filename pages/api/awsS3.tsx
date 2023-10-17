import { NextApiRequest, NextApiResponse } from 'next'
import S3 from 'aws-sdk/clients/s3'

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_REGION,
})

const getSignedUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  let json = await fetch('https://devfoster.netlify.app/api/awsS3', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(req.body),
  }).then(r => r.json())

  res.status(200).json(json)
  return
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default getSignedUrl
