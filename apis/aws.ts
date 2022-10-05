import { NextApiRequest, NextApiResponse } from "next"
import { S3 } from "aws-sdk"
import axios from 'axios'

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'us-east-2',
})

const getSignedUrl = async (name: any, type: any) => {
    try {
        const fileParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: name,
            Expires: 600,
            ContentType: type,
        }

        const url = await s3.getSignedUrlPromise("putObject", fileParams)
        return { url }
    } catch (err) {
        console.error({ err })
        return { err }
    }
}

const uploadFileToS3 = async (file: any, filename: string) => {
    const { url } = await getSignedUrl(filename, file.type)
    try {
        const { data } = await axios.put(url, file, {
            headers: {
                "Content-type": file.type,
                "Access-Control-Allow-Origin": "*",
            },
        })
        return { data, url: url.split('/').slice(0,3).join('/')+'/' }
    } catch (err) {
        console.error({ err })
        return { err }
    }
}

export default uploadFileToS3
