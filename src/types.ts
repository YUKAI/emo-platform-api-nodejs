interface TokenResponse {
  accessToken: string
  refreshToken: string
}

interface Listing {
  offset: number
  limit: number
  total: number
}

interface AccountResponse {
  uuid: string
  name: string
  email: string
  profileImage: string
  plan: 'plan' | 'business_basic' | 'business_advanced' | 'broadcaster'
  status: 'active' | 'suspended' | 'deleted'
}

interface RoomMember {
  uuid: string
  userType: string // TODO: enum?
  nickname: string
  profileImage: string
}

interface Room {
  uuid: string
  name: string
  roomType: string // TODO: enum?
  room_members: RoomMember[]
}

interface RoomsResponse {
  listing: Listing
  rooms: Room[]
}

interface Stamp {
  uuid: string
  name: string
  summary: string
  image: string
}

interface StampsResponse {
  listing: Listing
  stamps: Stamp[]
}

interface Motion {
  uuid: string
  name: string
  preview: string
}

interface MotionsResponse {
  listing: Listing
  motions: Motion[]
}

interface WebhookResponse {
  description: string
  events: string[]
  status: string
  secret: string
  url: string
}

interface PostWebhookRequest {
  url: string
  description: string
}

interface PutWebhookRequest {
  url: string
  description: string
}

type WebhookEvent =
| 'message.received' // 新規メッセージを受信
| 'trigger_word.detected' // BOCCO emoがトリガーワードを認識
| 'vui_command.detected' // BOCCO emoが音声コマンドを認識
| 'recording.started' // BOCCO emoが録音を開始
| 'recording.finished' // BOCCO emoが録音を終了
| 'function_button.pressed' // BOCCO emoのファンクションボタンが押された
| 'motion.finished' // BOCCO emoがモーション実行を完了した
| 'accel.detected' // BOCCO emo内蔵の加速度センサの状態が変化した
| 'illuminance.changed' // BOCCO emo内蔵の照度センサの状態が変化した
| 'emo_talk.finished' // BOCCO emoが発話を完了した
| 'radar.detected' // BOCCO emo内蔵のレーダセンサの状態が変化した
| 'movement_sensor.detected' // 振動センサが反応した
| 'lock_sensor.detected' // 鍵センサが反応した
| 'human_sensor.detected' // 人感センサが反応した
| 'room_sensor.detected' // 部屋センサが反応した

interface PutWebhookEventsRequest {
  events: WebhookEvent[]
}

interface MessagesResponse {
  messages: MessageResponse[]
}

interface MessageResponse {
  sequence: number
  uniqueId: string
  user: RoomMember
  message: Message
  media: string
  audioUrl: string
  imageUrl: string
  lang: string
}

interface Message{
  ja: string
}

interface SensorsResponse {
  sensors: Sensor[]
}

interface Sensor {
  uuid: string
  sensorType: string
  nickname: string
  signalStrength: number
  battery: number
}

interface SensorResponse {
  sensorType: string
  uuid: string
  nickname: string
  events: RoomSensorEvent[]
}

interface RoomSensorEvent {
  temperature: number
  humidity: number
  illuminance: number
}

interface EmoSettingsResponse {
  nickname: string
  wakeword: string
  volume: number
  voicePitch: number
  voiceSpeed: number
  lang: string
  serialNumber: string
  timezone: string
  zipCode: string
}

interface PostTextMessageRequest {
  text: string
}

interface PostStampMessageRequest {
  uuid: string
  text?: string
}

interface PostImageMessageRequest {
  image: any
}

interface PostAudioMessageRequest {
  audio: Blob
}

interface PostLedColorMotionRequest {
  red: number
  blue: number
  green: number
}

interface PostMoveToMotionRequest {
  angle: number
  verticalAngle: number
}

interface PostPresetMotionRequest {
  uuid: string
}

export {
  TokenResponse,
  AccountResponse,
  RoomsResponse,
  StampsResponse,
  MotionsResponse,
  WebhookResponse,
  PostWebhookRequest,
  PutWebhookRequest,
  PutWebhookEventsRequest,
  MessagesResponse,
  MessageResponse,
  SensorsResponse,
  SensorResponse,
  EmoSettingsResponse,
  PostTextMessageRequest,
  PostStampMessageRequest,
  PostImageMessageRequest,
  PostAudioMessageRequest,
  PostLedColorMotionRequest,
  PostMoveToMotionRequest,
  PostPresetMotionRequest,
}
