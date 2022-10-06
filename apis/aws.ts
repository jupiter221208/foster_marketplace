import axios from 'axios'

const uploadFileToS3 = async (file: any, filename: string) => {
    let { data } = await axios.post("/api/awsS3", {
        name: filename,
        type: file.type,
    });
    const url = data.url
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
