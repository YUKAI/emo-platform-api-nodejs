interface EmoTokens {
  accessToken: string
  refreshToken: string
}

interface Listing {
  offset: number
  limit: number
  total: number
}

interface EmoAccountInfo {
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

interface EmoRoomInfo {
  listing: Listing
  rooms: EmoRoom[]
}

interface EmoStamp {
  uuid: string
  name: string
  summary: string
  image: string
}

interface EmoStampsInfo {
  listing: Listing
  stamps: EmoStamp[]
}

interface EmoMotion {
  uuid: string
  name: string
  preview: string
}

interface EmoMotionsInfo {
  listing: Listing
  motions: EmoMotion[]
}

interface EmoWebhookInfo {
  description: string
  events: string[]
  status: string
  secret: string
  url: string
}

interface EmoMessagesInfo {
  messages: EmoMessageInfo[]
}

interface EmoMessageInfo {
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

interface EmoSensorsInfo {
  sensors: EmoSensor[]
}

interface EmoSensor {
  uuid: string
  sensorType: string
  nickname: string
  signalStrength: number
  battery: number
}

interface EmoRoomSensorInfo {
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

interface EmoSettingsInfo {
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

export {
  EmoTokens,
  EmoAccountInfo,
  EmoRoomInfo,
  EmoStampsInfo,
  EmoMotionsInfo,
  EmoWebhookInfo,
  EmoMessagesInfo,
  EmoSensorsInfo,
  EmoRoomSensorInfo,
  EmoSettingsInfo,
}
