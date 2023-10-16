import axios from 'axios'

const uploadFileToS3 = async (file: any, filename: string) => {
    let { data } = await axios.post("/api/awsS3", {
        name: filename,
        type: file.type,
    })
    const url = new URL(data.url)
    try {
        const { data } = await axios.put(url, file, {
            headers: {
                "Content-type": file.type,
                "Access-Control-Allow-Origin": "*",
            },
        })
        url.search = ''
        return { data, url: url.toString() }
    } catch (err) {
        console.error({ err })
        return { err }
    }
}

export default uploadFileToS3
