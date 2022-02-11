import { axiosClient } from './axios_client'
import type {
  EmoAccountInfo,
  EmoRoomInfo,
  EmoTokens,
  EmoStampsInfo,
  EmoMotionsInfo,
  EmoWebhookInfo,
} from './types'

interface Repository {
  // https://platform-api.bocco.me/dashboard/api-docs#post-/oauth/token/refresh
  getAccessToken: () => Promise<EmoTokens>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/me
  getAccountInfo: () => Promise<EmoAccountInfo>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms
  getRoomsList: (params?: {offset: number}) => Promise<EmoRoomInfo>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms
  getRoomsId: () => Promise<string[]>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms
  getStampsList: (params?: {offset: number}) => Promise<EmoStampsInfo>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions
  getMotionsList: (params?: {offset: number}) => Promise<EmoMotionsInfo>
  // https://platform-api.bocco.me/dashboard/api-docs#put-/v1/webhook
  getWebhookSetting: () => Promise<EmoWebhookInfo>
}

const repository: Repository = {
  getAccessToken: async () => await axiosClient.post('/oauth/token/refresh', { refreshToken: process.env.REFRESH_TOKEN }).then(({ data }) => data),
  getAccountInfo: async () => await axiosClient.get('/v1/me').then(({ data }) => data),
  getRoomsList: async (params = { offset: 0 }) => await axiosClient.get('/v1/rooms', { params }).then(({ data }) => data),
  getRoomsId: async () => {
    const { rooms } = await axiosClient.get<EmoRoomInfo>('/v1/rooms').then(({ data }) => data)
    return rooms.map(room => room.uuid)
  },
  getStampsList: async (params = { offset: 0 }) => await axiosClient.get('/v1/stamps', { params }).then(({ data }) => data),
  getMotionsList: async (params = { offset: 0 }) => await axiosClient.get('/v1/motions', { params }).then(({ data }) => data),
  getWebhookSetting: async () => await axiosClient.get('/v1/webhook').then(({ data }) => data),
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
