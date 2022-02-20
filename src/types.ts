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

interface EmoRoomMember {
  uuid: string
  userType: string // TODO: enum?
  nickname: string
  profileImage: string
}

interface EmoRoom {
  uuid: string
  name: string
  roomType: string // TODO: enum?
  room_members: EmoRoomMember[]
}

interface RoomsResponse {
  listing: Listing
  rooms: EmoRoom[]
}

interface EmoStamp {
  uuid: string
  name: string
  summary: string
  image: string
}

interface EmoStampsResponse {
  listing: Listing
  stamps: EmoStamp[]
}

interface EmoMotion {
  uuid: string
  name: string
  preview: string
}

interface EmoMotionsResponse {
  listing: Listing
  motions: EmoMotion[]
}

interface EmoWebhookResponse {
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
  user: EmoRoomMember
  message: EmoMessage
  media: string
  audioUrl: string
  imageUrl: string
  lang: string
}

interface EmoMessage{
  ja: string
}

interface SensorsResponse {
  sensors: EmoSensor[]
}

interface EmoSensor {
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
  events: EmoRoomSensorEvent[]
}

interface EmoRoomSensorEvent {
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
  stampUuid: string
  text?: string
}

interface PostImageMessageRequest {
  image: Blob
  text?: string
}

export {
  TokenResponse,
  AccountResponse,
  RoomsResponse,
  EmoStampsResponse,
  EmoMotionsResponse,
  EmoWebhookResponse,
  MessagesResponse,
  MessageResponse,
  SensorsResponse,
  SensorResponse,
  EmoSettingsResponse,
  PostTextMessageRequest,
  PostStampMessageRequest,
  PostImageMessageRequest,
}
