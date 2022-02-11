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

export {
  EmoTokens,
  EmoAccountInfo,
  EmoRoomInfo,
}
