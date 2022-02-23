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
import * as fs from 'fs'
import type { AxiosInstance } from 'axios'
// import FormData from 'form-data'
// import { FormData } from '../node_modules/formdata-node/lib/esm/FormData';
const FormData = require('form-data')

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
  postWebhook: (params: PostWebhookRequest) => Promise<WebhookResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#put-/v1/webhook
  putWebhook: (params: PutWebhookRequest) => Promise<WebhookResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#delete-/v1/webhook
  deleteWebhook: () => Promise<WebhookResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#put-/v1/webhook/events
  putWebhookEvents: (params: { params: PutWebhookEventsRequest}) => Promise<WebhookResponse>

  // APIs under a room
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/messages
  getMessages: (params: {roomUuid: string, before?: number}) => Promise<MessagesResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/text
  postTextMessage: (roomUuid: string, params: PostTextMessageRequest) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/stamp
  postStampMessage: (roomUuid: string, params: PostStampMessageRequest) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/image
  postImageMessage: (roomUuid: string, params: PostImageMessageRequest) => Promise<MessageResponse>
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
  public axiosJsonInstance: AxiosInstance
  public axiosMultipartInstance: AxiosInstance
  private accessToken: string
  public refreshToken: string

  constructor ({ accessToken, refreshToken, baseURL }: EmoApiClientParams) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.axiosJsonInstance = getAxiosInstance({ baseURL, contentType: 'application/json', convertCases: true })
    this.axiosMultipartInstance = getAxiosInstance({ baseURL, contentType: 'multipart/form-data', convertCases: false })

    const jsonHeaders: any = this.axiosJsonInstance.defaults.headers
    jsonHeaders.authorization = `Bearer ${accessToken}`
    const multipartHeaders: any = this.axiosMultipartInstance.defaults.headers
    multipartHeaders.authorization = `Bearer ${accessToken}`

    this.axiosJsonInstance.interceptors.response.use((response) => response, this.responseInterceptor)

    // this.axiosJsonInstance.interceptors.response.use(
    //   (response) => {
    //     return response
    //   }, async (error) => {
    //     const originalRequest = error.config

    //     if (error.response?.status === 401 && error.response?.data?.reason?.match(/JWT.+expired/) && !originalRequest._retry) {
    //       originalRequest._retry = true
    //       await this.refreshTokens()
    //       // const { accessToken } = await this.getAccessToken()
    //       // const authorization = `Bearer ${String(accessToken)}`
    //       // const jsonHeaders: any = this.axiosJsonInstance.defaults.headers
    //       // jsonHeaders.authorization = authorization
    //       // const multipartHeaders: any = this.axiosMultipartInstance.defaults.headers
    //       // multipartHeaders.authorization = authorization
    //       originalRequest.headers.authorization = `Bearer ${this.accessToken}`
    //       return await this.axiosJsonInstance(originalRequest)
    //     }

    //     return await Promise.reject(error)
    //   })

    this.axiosMultipartInstance.interceptors.response.use((response) => response, this.responseInterceptor)
    // }, async (error) => {
    //   const originalRequest = error.config

    //   if (error.response?.status === 401 && error.response?.data?.reason?.match(/JWT.+expired/) && !originalRequest._retry) {
    //     originalRequest._retry = true
    //     await this.refreshTokens()
    //     originalRequest.headers.authorization = `Bearer ${String(this.accessToken)}`
    //     return await this.axiosJsonInstance(originalRequest)
    //   }

    //   return await Promise.reject(error)
    // })
  }

  async responseInterceptor (error) {
    const originalRequest = error.config

    if (error.response?.status === 401 && error.response?.data?.reason?.match(/JWT.+expired/) && !originalRequest._retry) {
      originalRequest._retry = true
      await this.refreshTokens()
      originalRequest.headers.authorization = `Bearer ${String(this.accessToken)}`
      return await this.axiosJsonInstance(originalRequest)
    }

    return await Promise.reject(error)
  }

  async refreshTokens () {
    const { accessToken } = await this.getAccessToken()
    this.accessToken = accessToken
    const authorization = `Bearer ${String(accessToken)}`

    const jsonHeaders: any = this.axiosJsonInstance.defaults.headers
    jsonHeaders.authorization = authorization

    const multipartHeaders: any = this.axiosMultipartInstance.defaults.headers
    multipartHeaders.authorization = authorization
  }

  async getAccountInfo () {
    return await this.axiosJsonInstance.get('/v1/me').then(({ data }) => data)
  }

  async getAccessToken () {
    return await this.axiosJsonInstance.post('/oauth/token/refresh', { refreshToken: this.refreshToken }).then(({ data }) => data)
  }

  async getRoomsList (params = { offset: 0 }) {
    return await this.axiosJsonInstance.get('/v1/rooms', { params }).then(({ data }) => data)
  }

  async getStampsList (params = { offset: 0 }) {
    return await this.axiosJsonInstance.get('/v1/stamps', { params }).then(({ data }) => data)
  }

  async getMotionsList (params = { offset: 0 }) {
    return await this.axiosJsonInstance.get('/v1/motions', { params }).then(({ data }) => data)
  }

  async getWebhook () {
    return await this.axiosJsonInstance.get('/v1/webhook').then(({ data }) => data)
  }

  async postWebhook (params: PostWebhookRequest) {
    return await this.axiosJsonInstance.post('/v1/webhook', params).then(({ data }) => data)
  }

  async putWebhook (params: PutWebhookRequest) {
    return await this.axiosJsonInstance.put('/v1/webhook', params).then(({ data }) => data)
  }

  async deleteWebhook () {
    return await this.axiosJsonInstance.delete('/v1/webhook').then(({ data }) => data)
  }

  async putWebhookEvents ({ params }) {
    return await this.axiosJsonInstance.put('/v1/webhook/events', { params }).then(({ data }) => data)
  }

  async getMessages ({ roomUuid, before = undefined }) {
    const params = { ...before }
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    Object.keys(params).forEach(key => params[key] === undefined && delete (params[key]))
    return await this.axiosJsonInstance.get(`/v1/rooms/${String(roomUuid)}/messages`, { params }).then(({ data }) => data)
  }

  async postTextMessage (roomUuid, params) {
    return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/messages/text`, params).then(({ data }) => data)
  }

  async postStampMessage (roomUuid, params) {
    return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/messages/stamp`, params).then(({ data }) => data)
  }

  async postImageMessage (roomUuid, params: PostImageMessageRequest) {
    // console.log(params.image)
    // formData.append('image', params.image)
    const content = await fs.readFileSync('./test.jpg')
    // console.log(content)
    // , function (err, content)
    const formData = new FormData()
    // const buffer = Buffer.from(content, 'binary')
    // formData.append('image', buffer)
    formData.append('image', params.image, {
      filepath: './test.jpg',
      contentType: 'application/octet-stream',
      // contentType: 'image/jpeg',
    })
    // console.log(formData)
    // console.log(formData.getHeaders())
    return await this.axiosMultipartInstance.post(`/v1/rooms/${String(roomUuid)}/messages/image`, formData, { headers: formData.getHeaders() }).then(({ data }) => data)
    // })
    // const image = fs.createReadStream('/Users/chu/python/emo-platform-api-nodejs/test.jpg')
    // console.log(image)
    // console.log(formData)
    // console.log(this.getMultipartaxiosJsonInstance())
    // return await this.getMultipartaxiosJsonInstance().post(`/${String(roomUuid)}/messages/image`, formData).then(({ data }) => data)
    // return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/messages/image`, formData, { headers: { 'content-type': 'multipart/form-data' } }).then(({ data }) => data)
  }

  async postAudioMessage ({ roomUuid, params }) {
    return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/messages/audio`, { data: params, headers: { 'content-type': 'multipart/form-data' } }).then(({ data }) => data)
  }

  async postLedColorMotion ({ roomUuid, params }) {
    return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/motions/led_color`, { params }).then(({ data }) => data)
  }

  async postMoveToMotion ({ roomUuid, params }) {
    return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/motions/move_to`, { params }).then(({ data }) => data)
  }

  async postPresetMotion ({ roomUuid, params }) {
    return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/motions/preset`, { params }).then(({ data }) => data)
  }

  async getSensors ({ roomUuid }) {
    return await this.axiosJsonInstance.get(`/v1/rooms/${String(roomUuid)}/sensors`).then(({ data }) => data)
  }

  async getSensorValues ({ roomUuid, sensorUuid }) {
    return await this.axiosJsonInstance.get(`/v1/rooms/${String(roomUuid)}/sensors/${String(sensorUuid)}/values`).then(({ data }) => data)
  }

  async getEmoSettings ({ roomUuid }) {
    return await this.axiosJsonInstance.get(`/v1/rooms/${String(roomUuid)}/emo/settings`).then(({ data }) => data)
  }
}

export {
  EmoApiClient,
}
