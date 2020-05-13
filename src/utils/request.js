import axios from 'axios'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: 'http://120.55.161.93:6011/', // url = base url + request url
  // baseURL: 'http://192.168.0.109:6011/', // url = base url + request url
  // baseURL: 'http://192.168.20.108:8181/smartsite_cms/', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

export default service
