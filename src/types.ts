interface EmoTokens {
  accessToken: string
  refreshToken: string
}

interface EmoAccountInfo {
  uuid: string
  name: string
  email: string
  profileImage: string
  plan: 'plan' | 'business_basic' | 'business_advanced' | 'broadcaster'
  status: 'active' | 'suspended' | 'deleted'
}

export {
  EmoTokens,
  EmoAccountInfo,
}
