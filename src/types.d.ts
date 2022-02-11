interface EmoAccountInfo {
  uuid: string
  name: string
  email: string
  profileImage: string
  plan: string // TODO: enum にすべき値なので値を列挙
  status: string // TODO: enum にすべき値なので値を列挙
}

export {
  EmoAccountInfo
}
