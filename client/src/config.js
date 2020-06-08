import Axios from "axios"

const axios = Axios.create({
    baseURL: process.env.VUE_APP_URL,
    withCredentials: process.env.VUE_AXIOS_WITHCREDENTIALS? true: false
})

export default axios
