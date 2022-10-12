import axios from 'axios'

const ApiClient = () => {
    const instance = axios.create()
    instance.interceptors.request.use(async (request) => {
        const jwt_token = JSON.parse(localStorage.getItem('token') || '')
        if (jwt_token) {
            request.headers.common = {
                Authorization: `Bearer ${jwt_token}`
            }
        }
        return request
    })

    instance.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            console.log('Error:', error)
        }
    )

    return instance
}

export default ApiClient()
