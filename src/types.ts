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
  image: Blob
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
