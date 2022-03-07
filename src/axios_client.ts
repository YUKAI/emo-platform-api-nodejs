import axios from 'axios'
import applyConverters from 'axios-case-converter'
import { stringify } from 'qs'
import { endpoint } from './constants'

const axiosConfig = {
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
  },
  paramsSerializer: (params: any) => stringify(params, { arrayFormat: 'brackets' })
}

interface AxiosInstanceParmas {
  baseURL?: string
}

const getAxiosInstance = ({ baseURL }: AxiosInstanceParmas) => {
  const axiosClient = axios.create(axiosConfig)
  applyConverters(axiosClient)
  axiosClient.defaults.baseURL = baseURL ?? `${endpoint}`
  return axiosClient
}

export {
  getAxiosInstance,
}
