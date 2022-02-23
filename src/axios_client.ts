import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { ApplyCaseMiddlewareOptions } from 'axios-case-converter'
import applyConverters from 'axios-case-converter'
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
  // applyConverters(axiosClient, { preservedKeys: (input) => { return input === 'image' } })

  const options: ApplyCaseMiddlewareOptions = {
    // ignoreHeaders: true,
    // preservedKeys: (input) => { const result = input.startsWith('_') || input.includes('-') || /^\d+$/.test(input) || ['dataSize', 'maxDataSize', 'pauseStreams'].includes(input); console.log([input, result]); return result },
    // caseMiddleware: {
    //   // requestTransformer: (config) => {
    //   //   console.log('requestTransformer', config, config._boundary)
    //   //   if (config._boundary) {
    //   //     return config
    //   //   }
    //   //   return config
    //   // },
    //   // responseTransformer: (config) => {
    //   //   console.log('responseTransformer', config)
    //   //   return config
    //   // },
    //   // requestInterceptor: (config) => {
    //   //   console.log('requestInterceptor', config)
    //   //   return config
    //   // }
    // }
  }
  // options

  if (convertCases) {
    applyConverters(axiosClient, options)
  }
  axiosClient.defaults.baseURL = baseURL ?? `${endpoint}`
  return axiosClient
}

const cloneAxiosInstance = (originalAxioInstance: AxiosInstance, { contentType = 'application/json', convertCases = true }: AxiosInstanceParmas) => {
  const axiosClient = axios.create(getAxiosConfig({ contentType }))

  if (convertCases) {
    const options: ApplyCaseMiddlewareOptions = {
      // ignoreHeaders: true,
      // preservedKeys: (input) => { const result = input.startsWith('_') || input.includes('-') || /^\d+$/.test(input) || ['dataSize', 'maxDataSize', 'pauseStreams'].includes(input); console.log([input, result]); return result },
    }

    applyConverters(axiosClient, options)
  }

  axiosClient.interceptors = { ...originalAxioInstance.interceptors }
  axiosClient.defaults = { ...originalAxioInstance.defaults }
  const headers: any = { ...originalAxioInstance.defaults.headers }
  headers['content-type'] = contentType
  headers.authorization = headers.authorization
  axiosClient.defaults.headers = headers
  console.log(axiosClient.defaults.headers)
  return axiosClient
}

export {
  getAxiosInstance,
  cloneAxiosInstance,
}
