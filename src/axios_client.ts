import axios from 'axios'
import applyConverters from 'axios-case-converter'
import { stringify } from 'qs'
import { endpoint } from './constants'

const axiosConfig = {
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: `Bearer ${process.env.ACCESS_TOKEN}`
  },
  paramsSerializer: (params: any) => stringify(params, { arrayFormat: 'brackets' })
}

const axiosClient = axios.create(axiosConfig)
applyConverters(axiosClient)
axiosClient.defaults.baseURL = `${endpoint}/v1`

export {
  axiosClient,
}
