import type { AxiosInstance } from 'axios'
import { getAxiosInstance } from './axios_client'
import type {
  EmoAccountInfo,
  EmoRoomInfo,
  EmoTokens,
  EmoStampsInfo,
  EmoMotionsInfo,
  EmoWebhookInfo,
  EmoMessagesInfo,
  EmoSensorsInfo,
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

  // APIs under a room
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/messages
  getMessages: (params: {roomUuid: string, before?: number}) => Promise<EmoMessagesInfo>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/sensors
  getSensors: (params: {roomUuid: string}) => Promise<EmoSensorsInfo>
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

  async getRoomsList (params = { offset: 0 }) {
    return await this.axiosInstance.get('/v1/rooms', { params }).then(({ data }) => data)
  }

  async getRoomsId () {
    const { rooms } = await this.axiosInstance.get<EmoRoomInfo>('/v1/rooms').then(({ data }) => data)
    return rooms.map(room => room.uuid)
  }

  async getStampsList (params = { offset: 0 }) {
    return await this.axiosInstance.get('/v1/stamps', { params }).then(({ data }) => data)
  }

  async getMotionsList (params = { offset: 0 }) {
    return await this.axiosInstance.get('/v1/motions', { params }).then(({ data }) => data)
  }

  async getWebhookSetting () {
    return await this.axiosInstance.get('/v1/webhook').then(({ data }) => data)
  }

  async getMessages ({ roomUuid, before = undefined }) {
    const params = { before }
    Object.keys(params).forEach(key => params[key] === undefined && delete (params[key]))
    return await this.axiosInstance.get(`/v1/rooms/${String(roomUuid)}/messages`, { params }).then(({ data }) => data)
  }

  async getSensors ({ roomUuid }) {
    return await this.axiosInstance.get(`/v1/rooms/${String(roomUuid)}/sensors`).then(({ data }) => data)
  }
}

export {
  EmoApiClient,
}
