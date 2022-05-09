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
  postTokenRefresh: () => Promise<TokenResponse>
  getMe: () => Promise<AccountResponse>
  deleteMe: () => Promise<AccountResponse>
  getRooms: (opts?: {offset?: number, channelUser?: string}) => Promise<RoomsResponse>
  getStamps: (opts?: {offset?: number, channelUser?: string}) => Promise<StampsResponse>
  getMotions: (opts?: {offset?: number}) => Promise<MotionsResponse>
  getWebhook: (opts?: {channelUser?: string}) => Promise<WebhookResponse>
  postWebhook: (params: PostWebhookRequest, opts?: {channelUser?: string}) => Promise<WebhookResponse>
  putWebhook: (params: PutWebhookRequest, opts?: {channelUser?: string}) => Promise<WebhookResponse>
  deleteWebhook: (opts?: {channelUser?: string}) => Promise<WebhookResponse>
  putWebhookEvents: (params: PutWebhookEventsRequest, opts?: {channelUser?: string}) => Promise<WebhookResponse>

  //
  // APIs under a room
  //
  getMessages: (roomUuid: string, opts?: {before?: number, channelUser?: string}) => Promise<MessagesResponse>
  postTextMessage: (roomUuid: string, params: PostTextMessageRequest, opts?: {channelUser?: string}) => Promise<MessageResponse>
  postStampMessage: (roomUuid: string, params: PostStampMessageRequest, opts?: {channelUser?: string}) => Promise<MessageResponse>
  postImageMessage: (roomUuid: string, params: PostImageMessageRequest, opts?: {channelUser?: string}) => Promise<MessageResponse>
  postAudioMessage: (roomUuid: string, params: PostAudioMessageRequest, opts?: {channelUser?: string}) => Promise<MessageResponse>
  postLedColorMotion: (roomUuid: string, params: PostLedColorMotionRequest, opts?: {channelUser?: string}) => Promise<MessageResponse>
  postMoveToMotion: (roomUuid: string, params: PostMoveToMotionRequest, opts?: {channelUser?: string}) => Promise<MessageResponse>
  postPresetMotion: (roomUuid: string, params: PostPresetMotionRequest, opts?: {channelUser?: string}) => Promise<MessageResponse>
  postMotion: (roomUuid: string, params: any, opts?: {channelUser?: string}) => Promise<MessageResponse>

  getSensors: (roomUuid: string, opts?: {channelUser?: string}) => Promise<SensorsResponse>
  getSensorValues: (roomUuid: string, sensorUuid: string, opts?: {channelUser?: string}) => Promise<SensorResponse>
  getEmoSettings: (roomUuid: string, opts?: {channelUser?: string}) => Promise<EmoSettingsResponse>
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
  public axiosJsonPreserveKeysInstance: AxiosInstance
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
    this.axiosJsonPreserveKeysInstance = getAxiosInstance({ baseURL, contentType: 'application/json', convertCases: false })
    this.axiosMultipartInstance = getAxiosInstance({ baseURL, contentType: 'multipart/form-data', convertCases: false })

    const jsonHeaders: any = this.axiosJsonInstance.defaults.headers
    jsonHeaders.Authorization = `Bearer ${accessToken}`
    const jsonPreserveKeyHeaders: any = this.axiosJsonPreserveKeysInstance.defaults.headers
    jsonPreserveKeyHeaders.Authorization = `Bearer ${accessToken}`
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
    this.axiosJsonPreserveKeysInstance.interceptors.response.use((response) => response, responseInterceptorJson)
    this.axiosMultipartInstance.interceptors.response.use((response) => response, responseInterceptorMultipart)
  }

  /**
   * アクセストークンをリフレッシュします。
   *
   * アクセストークンの期限が切れたら自動的にリフレッシュされるため、
   * この処理を明示的に呼ぶ必要はありません。
   * @category Authentication
   */
  async refreshTokens () {
    const { accessToken } = await this.postTokenRefresh()
    this.accessToken = accessToken
    const authorization = `Bearer ${String(accessToken)}`

    const jsonHeaders: any = this.axiosJsonInstance.defaults.headers
    jsonHeaders.Authorization = authorization

    const jsonPreserveKeysHeaders: any = this.axiosJsonPreserveKeysInstance.defaults.headers
    jsonPreserveKeysHeaders.Authorization = authorization

    const multipartHeaders: any = this.axiosMultipartInstance.defaults.headers
    multipartHeaders.Authorization = authorization
  }

  /**
   * リフレッシュトークンを使ってアクセストークンを発行します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#post-/oauth/token/refresh
   * @category Authentication
   */
  async postTokenRefresh (): Promise<TokenResponse> {
    return await this.axiosJsonInstance
      .post('/oauth/token/refresh', { refreshToken: this.refreshToken })
      .then(({ data }) => data)
  }

  /**
   * 自分自身のアカウント情報を取得します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#get-/v1/me
   * @category Account
  */
  async getMe (): Promise<AccountResponse> {
    return await this.axiosJsonInstance.get('/v1/me').then(({ data }) => data)
  }

  /**
   * 自分自身のアカウントを削除します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#delete-/v1/me
   * @category Account
   */
  async deleteMe (): Promise<AccountResponse> {
    return await this.axiosJsonInstance.delete('/v1/me').then(({ data }) => data)
  }

  /**
   * 部屋の一覧を取得します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms
   * @category Room
   */
  async getRooms (opts?: {offset?: number, channelUser?: string}): Promise<RoomsResponse> {
    return await this.axiosJsonInstance
      .get('/v1/rooms', { params: { offset: opts?.offset }, headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * 使用できるスタンプの一覧を取得します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#get-/v1/stamps
   * @category Master data
   */
  async getStamps (opts?: {offset?: number, channelUser?: string}): Promise<StampsResponse> {
    return await this.axiosJsonInstance
      .get('/v1/stamps', { params: { offset: opts?.offset }, headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * 使用できるモーションの一覧を取得します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions
   * @category Master data
   */
  async getMotions (params?: {offset?: number}): Promise<MotionsResponse> {
    return await this.axiosJsonInstance.get('/v1/motions', { params }).then(({ data }) => data)
  }

  /**
   * 設定されている Webhook の設定情報を取得します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#get-/v1/webhook
   * @category Webhook
   */
  async getWebhook (opts?: {channelUser?: string}): Promise<WebhookResponse> {
    return await this.axiosJsonInstance
      .get('/v1/webhook', { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * Webhook の設定情報を作成します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#post-/v1/webhook
   * @category Webhook
   */
  async postWebhook (params: PostWebhookRequest, opts?: {channelUser?: string}): Promise<WebhookResponse> {
    return await this.axiosJsonInstance
      .post('/v1/webhook', params, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * Webhook の設定情報を更新します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#put-/v1/webhook
   * @category Webhook
   */
  async putWebhook (params: PutWebhookRequest, opts?: {channelUser?: string}): Promise<WebhookResponse> {
    return await this.axiosJsonInstance
      .put('/v1/webhook', params, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * Webhook の設定情報を削除します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#delete-/v1/webhook
   * @category Webhook
   */
  async deleteWebhook (opts?: {channelUser?: string}): Promise<WebhookResponse> {
    return await this.axiosJsonInstance
      .delete('/v1/webhook', { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * Webhook の通知イベントを設定します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#put-/v1/webhook/events
   * @category Webhook
   */
  async putWebhookEvents (params: PutWebhookEventsRequest, opts?: {channelUser?: string}): Promise<WebhookResponse> {
    return await this.axiosJsonInstance
      .put('/v1/webhook/events', params, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * メッセージの一覧を取得します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/messages
   * @category Under a room
   */
  async getMessages (roomUuid: string, opts?: {before?: number, channelUser?: string}): Promise<MessagesResponse> {
    return await this.axiosJsonInstance
      .get(`/v1/rooms/${roomUuid}/messages`, { params: { before: opts?.before }, headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * テキストメッセージを作成します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/text
   * @category Under a room
   */
  async postTextMessage (roomUuid: string, params: PostTextMessageRequest, opts?: {channelUser?: string}): Promise<MessageResponse> {
    return await this.axiosJsonInstance
      .post(`/v1/rooms/${roomUuid}/messages/text`, params, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * スタンプメッセージを作成します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/stamp
   * @category Under a room
   */
  async postStampMessage (roomUuid: string, params: PostStampMessageRequest, opts?: {channelUser?: string}): Promise<MessageResponse> {
    return await this.axiosJsonInstance
      .post(`/v1/rooms/${roomUuid}/messages/stamp`, params, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * 画像メッセージを作成します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/image
   * @category Under a room
   */
  async postImageMessage (roomUuid: string, params: PostImageMessageRequest, opts?: {channelUser?: string}): Promise<MessageResponse> {
    const request = async () => {
      const buffer = Buffer.alloc(params.image.length)
      params.image.copy(buffer)
      const formData = new FormData()
      formData.append('image', buffer, {
        filepath: './image.jpg',
        contentType: 'application/octet-stream',
      })
      return await this.axiosMultipartInstance
        .post(`/v1/rooms/${roomUuid}/messages/image`, formData, { headers: { ...this.channelUserHeader(opts?.channelUser), ...formData.getHeaders() } })
        .then(({ data }) => data)
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
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/messages/audio
   * @category Under a room
   */
  async postAudioMessage (roomUuid: string, params: PostAudioMessageRequest, opts?: {channelUser?: string}): Promise<MessageResponse> {
    const request = async () => {
      const buffer = Buffer.alloc(params.audio.length)
      params.audio.copy(buffer)
      const formData = new FormData()
      formData.append('audio', buffer, {
        filepath: './audio.mp3',
        contentType: 'application/octet-stream',
      })
      return await this.axiosMultipartInstance
        .post(`/v1/rooms/${roomUuid}/messages/audio`, formData, { headers: { ...this.channelUserHeader(opts?.channelUser), ...formData.getHeaders() } })
        .then(({ data }) => data)
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
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/led_color
   * @category Under a room
   */
  async postLedColorMotion (roomUuid: string, params: PostLedColorMotionRequest, opts?: {channelUser?: string}): Promise<MessageResponse> {
    return await this.axiosJsonInstance
      .post(`/v1/rooms/${roomUuid}/motions/led_color`, params, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * 首振りモーションを実行します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/move_to
   * @category Under a room
   */
  async postMoveToMotion (roomUuid: string, params: PostMoveToMotionRequest, opts?: {channelUser?: string}): Promise<MessageResponse> {
    return await this.axiosJsonInstance
      .post(`/v1/rooms/${roomUuid}/motions/move_to`, params, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * プリセットモーションを実行します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions/preset
   * @category Under a room
   */
  async postPresetMotion (roomUuid: string, params: PostPresetMotionRequest, opts?: {channelUser?: string}): Promise<MessageResponse> {
    return await this.axiosJsonInstance
      .post(`/v1/rooms/${roomUuid}/motions/preset`, params, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * オリジナルモーションを実行します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#post-/v1/rooms/-room_uuid-/motions
   * @category Under a room
   */
  async postMotion (roomUuid: string, params: any, opts?: {channelUser?: string}): Promise<MessageResponse> {
    return await this.axiosJsonPreserveKeysInstance
      .post(`/v1/rooms/${roomUuid}/motions`, params, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * センサーの一覧を取得します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/sensors
   * @category Under a room
   */
  async getSensors (roomUuid: string, opts?: {channelUser?: string}): Promise<SensorsResponse> {
    return await this.axiosJsonInstance
      .get(`/v1/rooms/${roomUuid}/sensors`, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * センサーの値を取得します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/sensors/-sensor_id-/values
   * @category Under a room
   */
  async getSensorValues (roomUuid: string, sensorUuid: string, opts?: {channelUser?: string}): Promise<SensorResponse> {
    return await this.axiosJsonInstance
      .get(`/v1/rooms/${roomUuid}/sensors/${sensorUuid}/values`, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  /**
   * emoの設定値を取得します。
   *
   * 詳細仕様: https://platform-api.bocco.me/dashboard/api-docs#get-/v1/rooms/-room_uuid-/emo/settings
   * @category Under a room
   */
  async getEmoSettings (roomUuid: string, opts?: {channelUser?: string}): Promise<EmoSettingsResponse> {
    return await this.axiosJsonInstance
      .get(`/v1/rooms/${roomUuid}/emo/settings`, { headers: this.channelUserHeader(opts?.channelUser) })
      .then(({ data }) => data)
  }

  channelUserHeader (channelUser?: string): {[key: string]: string} {
    if (channelUser === undefined) return {}

    return { 'X-Channel-User': channelUser }
  }
}

export {
  EmoApiClientParams,
  EmoApiClient,
}
