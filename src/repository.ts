import type { AxiosInstance } from 'axios'
import { getAxiosInstance } from './axios_client'
import type {
  EmoAccountInfo,
  EmoTokens,
} from './types'

interface Repository {
  // https://platform-api.bocco.me/dashboard/api-docs#post-/oauth/token/refresh
  getAccessToken: () => Promise<EmoTokens>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/me
  getAccountInfo: () => Promise<EmoAccountInfo>
}

interface EmoApiClientParams {
  accessToken: string
  refreshToken: string
  baseURL?: string
}

class EmoApiClient implements Repository {
  public axiosInstance: AxiosInstance
  public refreshToken: string

  constructor ({ accessToken, refreshToken, baseURL }: EmoApiClientParams) {
    this.refreshToken = refreshToken
    this.axiosInstance = getAxiosInstance({ baseURL })

    const headers: any = this.axiosInstance.defaults.headers
    headers.authorization = `Bearer ${accessToken}`

    this.axiosInstance.interceptors.response.use((response) => {
      return response
    }, async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && error.response?.data?.reason?.match(/JWT.+expired/) && !originalRequest._retry) {
        originalRequest._retry = true
        const { accessToken } = await this.getAccessToken()
        const headers: any = this.axiosInstance.defaults.headers
        headers.authorization = `Bearer ${String(accessToken)}`
        originalRequest.headers = headers
        return await this.axiosInstance(originalRequest)
      }

      return await Promise.reject(error)
    })
  }

  async getAccountInfo () {
    return await this.axiosInstance.get('/v1/me').then(({ data }) => data)
  }

  async getAccessToken () {
    return await this.axiosInstance.post('/oauth/token/refresh', { refreshToken: this.refreshToken }).then(({ data }) => data)
  }
}

export {
  EmoApiClient,
}
