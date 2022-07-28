import axios from 'axios'
import applyCaseMiddleware from 'axios-case-converter'
import { stringify } from 'qs'
import { endpoint } from './constants'

const getAxiosConfig = ({ contentType }: AxiosInstanceParmas) => {
  return {
    headers: {
      accept: 'application/json',
      'content-type': contentType,
    },
    paramsSerializer: (params: any) => stringify(params, { arrayFormat: 'brackets' })
  }
}

interface AxiosInstanceParmas {
  baseURL?: string
  contentType?: string
  convertCases?: boolean
}

const getAxiosInstance = ({ baseURL, contentType = 'application/json', convertCases = true }: AxiosInstanceParmas) => {
  const axiosClient = axios.create(getAxiosConfig({ contentType }))

  if (convertCases) {
    applyCaseMiddleware(axiosClient)
  }
  axiosClient.defaults.baseURL = baseURL ?? `${endpoint}`
  return axiosClient
}

export {
  getAxiosInstance,
}
