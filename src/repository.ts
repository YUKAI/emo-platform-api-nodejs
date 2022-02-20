import type { AxiosInstance } from 'axios'
import { getAxiosInstance } from './axios_client'
import type {
  TokenResponse,
  SensorsResponse,
  MessagesResponse,
  SensorResponse,
  EmoSettingsResponse,
  WebhookResponse,
  MotionsResponse,
  StampsResponse,
  RoomsResponse,
  AccountResponse,
  PostTextMessageRequest,
  MessageResponse,
  PostStampMessageRequest,
  PostImageMessageRequest,
  PostMoveToMotionRequest,
  PostLedColorMotionRequest,
  PostAudioMessageRequest,
  PostPresetMotionRequest,
  PutWebhookRequest,
  PutWebhookEventsRequest,
  PostWebhookRequest,
} from './types'

interface Repository {
  // https://platform-api.bocco.me/dashboard/api-docs#post-/oauth/token/refresh
  getAccessToken: () => Promise<TokenResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/me
  getAccountInfo: () => Promise<AccountResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms
  getRoomsList: (params?: {offset: number}) => Promise<RoomsResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms
  getStampsList: (params?: {offset: number}) => Promise<StampsResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions
  getMotionsList: (params?: {offset: number}) => Promise<MotionsResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/webhook
  getWebhook: () => Promise<WebhookResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/webhook
  postWebhook: (params: { params: PostWebhookRequest}) => Promise<WebhookResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#put-/v1/webhook
  putWebhook: (params: { params: PutWebhookRequest}) => Promise<WebhookResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#delete-/v1/webhook
  deleteWebhook: () => Promise<WebhookResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#put-/v1/webhook/events
  putWebhookEvents: (params: { params: PutWebhookEventsRequest}) => Promise<WebhookResponse>

  // APIs under a room
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/messages
  getMessages: (params: {roomUuid: string, before?: number}) => Promise<MessagesResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/text
  postTextMessage: (params: {roomUuid: string, params: PostTextMessageRequest}) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/stamp
  postStampMessage: (params: {roomUuid: string, params: PostStampMessageRequest}) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/image
  postImageMessage: (params: {roomUuid: string, params: PostImageMessageRequest}) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/audio
  postAudioMessage: (params: {roomUuid: string, params: PostAudioMessageRequest}) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/led_color
  postLedColorMotion: (params: {roomUuid: string, params: PostLedColorMotionRequest}) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/move_to
  postMoveToMotion: (params: {roomUuid: string, params: PostMoveToMotionRequest}) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/preset
  postPresetMotion: (params: {roomUuid: string, params: PostPresetMotionRequest}) => Promise<MessageResponse>

  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/sensors
  getSensors: (params: {roomUuid: string}) => Promise<SensorsResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/sensors/-sensor_id-/values
  getSensorValues: (params: {roomUuid: string, sensorUuid: string}) => Promise<SensorResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/emo/settings
  getEmoSettings: (params: {roomUuid: string}) => Promise<EmoSettingsResponse>
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

  async getStampsList (params = { offset: 0 }) {
    return await this.axiosInstance.get('/v1/stamps', { params }).then(({ data }) => data)
  }

  async getMotionsList (params = { offset: 0 }) {
    return await this.axiosInstance.get('/v1/motions', { params }).then(({ data }) => data)
  }

  async getWebhook () {
    return await this.axiosInstance.get('/v1/webhook').then(({ data }) => data)
  }

  async postWebhook ({ params }) {
    return await this.axiosInstance.post('/v1/webhook', { params }).then(({ data }) => data)
  }

  async putWebhook ({ params }) {
    return await this.axiosInstance.put('/v1/webhook', { params }).then(({ data }) => data)
  }

  async deleteWebhook () {
    return await this.axiosInstance.delete('/v1/webhook').then(({ data }) => data)
  }

  async putWebhookEvents ({ params }) {
    return await this.axiosInstance.put('/v1/webhook/events', { params }).then(({ data }) => data)
  }

  async getMessages ({ roomUuid, before = undefined }) {
    const params = { before }
    Object.keys(params).forEach(key => params[key] === undefined && delete (params[key]))
    return await this.axiosInstance.get(`/v1/rooms/${String(roomUuid)}/messages`, { params }).then(({ data }) => data)
  }

  async postTextMessage ({ roomUuid, params }) {
    return await this.axiosInstance.post(`/v1/rooms/${String(roomUuid)}/messages/text`, { params }).then(({ data }) => data)
  }

  async postStampMessage ({ roomUuid, params }) {
    return await this.axiosInstance.post(`/v1/rooms/${String(roomUuid)}/messages/stamp`, { params }).then(({ data }) => data)
  }

  async postImageMessage ({ roomUuid, params }) {
    return await this.axiosInstance.post(`/v1/rooms/${String(roomUuid)}/messages/image`, { params, headers: { 'content-type': 'multipart/form-data' } }).then(({ data }) => data)
  }

  async postAudioMessage ({ roomUuid, params }) {
    return await this.axiosInstance.post(`/v1/rooms/${String(roomUuid)}/messages/audio`, { params, headers: { 'content-type': 'multipart/form-data' } }).then(({ data }) => data)
  }

  async postLedColorMotion ({ roomUuid, params }) {
    return await this.axiosInstance.post(`/v1/rooms/${String(roomUuid)}/motions/led_color`, { params }).then(({ data }) => data)
  }

  async postMoveToMotion ({ roomUuid, params }) {
    return await this.axiosInstance.post(`/v1/rooms/${String(roomUuid)}/motions/move_to`, { params }).then(({ data }) => data)
  }

  async postPresetMotion ({ roomUuid, params }) {
    return await this.axiosInstance.post(`/v1/rooms/${String(roomUuid)}/motions/preset`, { params }).then(({ data }) => data)
  }

  async getSensors ({ roomUuid }) {
    return await this.axiosInstance.get(`/v1/rooms/${String(roomUuid)}/sensors`).then(({ data }) => data)
  }

  async getSensorValues ({ roomUuid, sensorUuid }) {
    return await this.axiosInstance.get(`/v1/rooms/${String(roomUuid)}/sensors/${String(sensorUuid)}/values`).then(({ data }) => data)
  }

  async getEmoSettings ({ roomUuid }) {
    return await this.axiosInstance.get(`/v1/rooms/${String(roomUuid)}/emo/settings`).then(({ data }) => data)
  }
}

export {
  EmoApiClient,
}
