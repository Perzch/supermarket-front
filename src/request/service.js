import axios from "axios"

const service = axios.create({
    baseURL: "/api",
    timeout: 50000,
    method: 'post',
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
        'X-Requested-With': 'XMLHttpRequest',
    }
})
service.interceptors.request.use(config => {
    if(localStorage.getItem('token')) {
        config.headers['authorization'] = 'Bearer ' + localStorage.getItem('token')
    }
    return config
})
export default service