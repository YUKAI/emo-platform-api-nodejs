import { axiosClient } from './axios_client'
import type {
  EmoAccountInfo,
  EmoRoomInfo,
  EmoTokens
} from './types'

interface Repository {
  // https://platform-api.bocco.me/dashboard/api-docs#post-/oauth/token/refresh
  getAccessToken: () => Promise<EmoTokens>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/me
  getAccountInfo: () => Promise<EmoAccountInfo>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms
  getRoomsList: (params: {offset?: number}) => Promise<EmoRoomInfo>
}

const repository: Repository = {
  getAccessToken: async () => await axiosClient.post('/oauth/token/refresh', { refreshToken: process.env.REFRESH_TOKEN }).then(({ data }) => data),
  getAccountInfo: async () => await axiosClient.get('/v1/me').then(({ data }) => data),
  getRoomsList: async ({ offset }) => await axiosClient.get('/v1/rooms', { params: { offset } }).then(({ data }) => data),
}

axiosClient.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const originalRequest = error.config

  if (error.response?.status === 401 && error.response?.data?.reason?.match(/JWT.+expired/) && !originalRequest._retry) {
    originalRequest._retry = true
    const { accessToken } = await repository.getAccessToken()
    const headers: any = axiosClient.defaults.headers
    headers.authorization = `Bearer ${accessToken}`
    originalRequest.headers = headers
    return await axiosClient(originalRequest)
  }

  return await Promise.reject(error)
})

export {
  repository
}
