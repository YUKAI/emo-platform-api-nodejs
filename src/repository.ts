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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require('form-data')

interface IEmoApiClient {
  // https://platform-api.bocco.me/dashboard/api-docs#post-/oauth/token/refresh
  postTokenRefresh: () => Promise<TokenResponse>
  /**
   * https://platform-api.bocco.me/dashboard/api-docs#get-/v1/me
  */
  getMe: () => Promise<AccountResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#delete-/v1/me
  deleteMe: () => Promise<AccountResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms
  getRooms: (params?: {offset: number}) => Promise<RoomsResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/stamps
  getStamps: (params?: {offset: number}) => Promise<StampsResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions
  getMotions: (params?: {offset: number}) => Promise<MotionsResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/webhook
  getWebhook: () => Promise<WebhookResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/webhook
  postWebhook: (params: PostWebhookRequest) => Promise<WebhookResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#put-/v1/webhook
  putWebhook: (params: PutWebhookRequest) => Promise<WebhookResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#delete-/v1/webhook
  deleteWebhook: () => Promise<WebhookResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#put-/v1/webhook/events
  putWebhookEvents: (params: PutWebhookEventsRequest) => Promise<WebhookResponse>

  //
  // APIs under a room
  //
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/messages
  getMessages: (params: {roomUuid: string, before?: number}) => Promise<MessagesResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/text
  postTextMessage: (roomUuid: string, params: PostTextMessageRequest) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/stamp
  postStampMessage: (roomUuid: string, params: PostStampMessageRequest) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/image
  postImageMessage: (roomUuid: string, params: PostImageMessageRequest) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/audio
  postAudioMessage: (roomUuid: string, params: PostAudioMessageRequest) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/led_color
  postLedColorMotion: (roomUuid: string, params: PostLedColorMotionRequest) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/move_to
  postMoveToMotion: (roomUuid: string, params: PostMoveToMotionRequest) => Promise<MessageResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/preset
  postPresetMotion: (roomUuid: string, params: PostPresetMotionRequest) => Promise<MessageResponse>

  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/sensors
  getSensors: (params: {roomUuid: string}) => Promise<SensorsResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/sensors/-sensor_id-/values
  getSensorValues: (params: {roomUuid: string, sensorUuid: string}) => Promise<SensorResponse>
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/emo/settings
  getEmoSettings: (params: {roomUuid: string}) => Promise<EmoSettingsResponse>
}

/**
 * EmoApiClient コンストラクタの引数
 */
interface EmoApiClientParams {
  /**
   * アクセストークン
   */
  accessToken: string
  /**
   * リフレッシュトークン
   */
  refreshToken: string
  /**
   * BOCCO emo platform apiにアクセスするためのendpoint
   * デフォルト: https://platform-api.bocco.me
   */
  baseURL?: string
}

class EmoApiClient implements IEmoApiClient {
  /**
   * @hidden
   */
  public axiosJsonInstance: AxiosInstance
  /**
   * @hidden
   */
  public axiosMultipartInstance: AxiosInstance
  /**
   * @hidden
   */
  private accessToken: string
  /**
   * @hidden
   */
  public refreshToken: string

  /**
   * API呼び出しのためのクライアントインスタンスを取得します。
   * @params EmoApiClientParams
   */
  constructor ({ accessToken, refreshToken, baseURL }: EmoApiClientParams) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.axiosJsonInstance = getAxiosInstance({ baseURL, contentType: 'application/json', convertCases: true })
    this.axiosMultipartInstance = getAxiosInstance({ baseURL, contentType: 'multipart/form-data', convertCases: false })

    const jsonHeaders: any = this.axiosJsonInstance.defaults.headers
    jsonHeaders.Authorization = `Bearer ${accessToken}`
    const multipartHeaders: any = this.axiosMultipartInstance.defaults.headers
    multipartHeaders.Authorization = `Bearer ${accessToken}`

    const responseInterceptorJson = async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && error.response?.data?.reason?.match(/JWT.+expired/) && !originalRequest._retry) {
        originalRequest._retry = true
        await this.refreshTokens()
        originalRequest.headers.Authorization = `Bearer ${String(this.accessToken)}`
        return await this.axiosJsonInstance.request(originalRequest)
      }

      return await Promise.reject(error)
    }

    const responseInterceptorMultipart = async (error) => {
      if (error.response?.status === 401 && error.response?.data?.reason?.match(/JWT.+expired/)) {
        await this.refreshTokens()
        return await Promise.reject(new Error('TOKEN_EXPIRED'))
      }

      return await Promise.reject(error)
    }

    this.axiosJsonInstance.interceptors.response.use((response) => response, responseInterceptorJson)
    this.axiosMultipartInstance.interceptors.response.use((response) => response, responseInterceptorMultipart)
  }

  /**
   * アクセストークンをリフレッシュします。
   *
   * アクセストークンの期限が切れたら自動的にリフレッシュされるため、
   * この処理を明示的に呼ぶ必要はありません。
   */
  async refreshTokens () {
    const { accessToken } = await this.postTokenRefresh()
    this.accessToken = accessToken
    const authorization = `Bearer ${String(accessToken)}`

    const jsonHeaders: any = this.axiosJsonInstance.defaults.headers
    jsonHeaders.Authorization = authorization

    const multipartHeaders: any = this.axiosMultipartInstance.defaults.headers
    multipartHeaders.Authorization = authorization
  }

  /**
   * リフレッシュトークンを使ってアクセストークンを発行します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#post-/oauth/token/refresh
   */
  async postTokenRefresh (): Promise<TokenResponse> {
    return await this.axiosJsonInstance.post('/oauth/token/refresh', { refreshToken: this.refreshToken }).then(({ data }) => data)
  }

  /**
   * 自分自身のアカウント情報を取得します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#get-/v1/me
  */
  async getMe (): Promise<AccountResponse> {
    return await this.axiosJsonInstance.get('/v1/me').then(({ data }) => data)
  }

  /**
   * 自分自身のアカウントを削除します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#delete-/v1/me
   */
  async deleteMe (): Promise<AccountResponse> {
    return await this.axiosJsonInstance.delete('/v1/me').then(({ data }) => data)
  }

  /**
   * 部屋の一覧を取得します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms
   */
  async getRooms (params = { offset: 0 }): Promise<RoomsResponse> {
    return await this.axiosJsonInstance.get('/v1/rooms', { params }).then(({ data }) => data)
  }

  /**
   * 使用できるスタンプの一覧を取得します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#get-/v1/stamps
   */
  async getStamps (params = { offset: 0 }): Promise<StampsResponse> {
    return await this.axiosJsonInstance.get('/v1/stamps', { params }).then(({ data }) => data)
  }

  /**
   * 使用できるモーションの一覧を取得します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions
   */
  async getMotions (params = { offset: 0 }): Promise<MotionsResponse> {
    return await this.axiosJsonInstance.get('/v1/motions', { params }).then(({ data }) => data)
  }

  /**
   * 設定されている Webhook の設定情報を取得します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#get-/v1/webhook
   */
  async getWebhook (): Promise<WebhookResponse> {
    return await this.axiosJsonInstance.get('/v1/webhook').then(({ data }) => data)
  }

  /**
   * Webhook の設定情報を作成します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#post-/v1/webhook
   */
  async postWebhook (params: PostWebhookRequest): Promise<WebhookResponse> {
    return await this.axiosJsonInstance.post('/v1/webhook', params).then(({ data }) => data)
  }

  /**
   * Webhook の設定情報を更新します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#put-/v1/webhook
   */
  async putWebhook (params: PutWebhookRequest): Promise<WebhookResponse> {
    return await this.axiosJsonInstance.put('/v1/webhook', params).then(({ data }) => data)
  }

  /**
   * Webhook の設定情報を削除します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#delete-/v1/webhook
   */
  async deleteWebhook (): Promise<WebhookResponse> {
    return await this.axiosJsonInstance.delete('/v1/webhook').then(({ data }) => data)
  }

  /**
   * Webhook の通知イベントを設定します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#put-/v1/webhook/events
   */
  async putWebhookEvents (params): Promise<WebhookResponse> {
    return await this.axiosJsonInstance.put('/v1/webhook/events', params).then(({ data }) => data)
  }

  /**
   * メッセージの一覧を取得します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/messages
   */
  async getMessages ({ roomUuid, before = undefined }): Promise<MessagesResponse> {
    const params = { ...before }
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    Object.keys(params).forEach(key => params[key] === undefined && delete (params[key]))
    return await this.axiosJsonInstance.get(`/v1/rooms/${String(roomUuid)}/messages`, { params }).then(({ data }) => data)
  }

  /**
   * テキストメッセージを作成します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/text
   */
  async postTextMessage (roomUuid, params): Promise<MessageResponse> {
    return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/messages/text`, params).then(({ data }) => data)
  }

  /**
   * スタンプメッセージを作成します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/stamp
   */
  async postStampMessage (roomUuid, params): Promise<MessageResponse> {
    return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/messages/stamp`, params).then(({ data }) => data)
  }

  /**
   * 画像メッセージを作成します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/image
   */
  async postImageMessage (roomUuid, params: PostImageMessageRequest): Promise<MessageResponse> {
    const request = async () => {
      const buffer = Buffer.alloc(params.image.length)
      params.image.copy(buffer)
      const formData = new FormData()
      formData.append('image', buffer, {
        filepath: './image.jpg',
        contentType: 'application/octet-stream',
      })
      return await this.axiosMultipartInstance.post(`/v1/rooms/${String(roomUuid)}/messages/image`, formData, { headers: formData.getHeaders() }).then(({ data }) => data)
    }

    try {
      return await request()
    } catch (error) {
      if (String(error).endsWith('TOKEN_EXPIRED')) return await request()
      throw error
    }
  }

  /**
   * 音声メッセージを作成します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/audio
   */
  async postAudioMessage (roomUuid, params: PostAudioMessageRequest): Promise<MessageResponse> {
    const request = async () => {
      const buffer = Buffer.alloc(params.audio.length)
      params.audio.copy(buffer)
      const formData = new FormData()
      formData.append('audio', buffer, {
        filepath: './audio.mp3',
        contentType: 'application/octet-stream',
      })
      return await this.axiosMultipartInstance.post(`/v1/rooms/${String(roomUuid)}/messages/audio`, formData, { headers: formData.getHeaders() }).then(({ data }) => data)
    }

    try {
      return await request()
    } catch (error) {
      if (String(error).endsWith('TOKEN_EXPIRED')) return await request()
      throw error
    }
  }

  /**
   * LEDモーションを実行します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/led_color
   */
  async postLedColorMotion (roomUuid, params: PostLedColorMotionRequest): Promise<MessageResponse> {
    return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/motions/led_color`, params).then(({ data }) => data)
  }

  /**
   * 首振りモーションを実行します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/move_to
   */
  async postMoveToMotion (roomUuid, params: PostMoveToMotionRequest): Promise<MessageResponse> {
    return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/motions/move_to`, params).then(({ data }) => data)
  }

  /**
   * プロセットモーションを実行します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/preset
   */
  async postPresetMotion (roomUuid, params: PostPresetMotionRequest): Promise<MessageResponse> {
    return await this.axiosJsonInstance.post(`/v1/rooms/${String(roomUuid)}/motions/preset`, params).then(({ data }) => data)
  }

  /**
   * センサーの一覧を取得します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/sensors
   */
  async getSensors ({ roomUuid }): Promise<SensorsResponse> {
    return await this.axiosJsonInstance.get(`/v1/rooms/${String(roomUuid)}/sensors`).then(({ data }) => data)
  }

  /**
   * センサーの値を取得します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/sensors/-sensor_id-/values
   */
  async getSensorValues ({ roomUuid, sensorUuid }): Promise<SensorResponse> {
    return await this.axiosJsonInstance.get(`/v1/rooms/${String(roomUuid)}/sensors/${String(sensorUuid)}/values`).then(({ data }) => data)
  }

  /**
   * emoの設定値を取得します。
   *
   * https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/emo/settings
   */
  async getEmoSettings ({ roomUuid }): Promise<EmoSettingsResponse> {
    return await this.axiosJsonInstance.get(`/v1/rooms/${String(roomUuid)}/emo/settings`).then(({ data }) => data)
  }
}

export {
  EmoApiClientParams,
  EmoApiClient,
}
