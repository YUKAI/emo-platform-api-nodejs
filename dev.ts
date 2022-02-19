import type {AxiosError} from 'axios'
import {EmoApiClient} from './dist/index'
console.log('emo API Client dev client')

const apiClient = new EmoApiClient({
  accessToken: process.env.ACCESS_TOKEN,
  refreshToken: process.env.REFRESH_TOKEN,
  baseURL: 'https://platform-api.bocco.me',
})

// console.log('POST /oauth/token/refresh')
// apiClient.getAccessToken()
//   .then(response => {
//     console.log(response)
//   })
//   .catch((error: AxiosError) => {
//     console.error(`ステータスコード: ${error?.response?.status}`)
//     console.error(error?.response?.data)
//   })

// console.log('GET /v1/me')
// apiClient.getAccountInfo()
//   .then(response => {
//     console.log(response)
//   })
//   .catch((error: AxiosError) => {
//     console.error(`ステータスコード: ${error?.response?.status}`)
//     console.error(error?.response?.data)
//   })

// console.log('GET /v1/rooms')
// apiClient.getRoomsList({offset: 0})
//   .then(response => {
//     console.log(response)
//   })
//   .catch((error: AxiosError) => {
//     console.error(`ステータスコード: ${error?.response?.status}`)
//     console.error(error?.response?.data)
//   })

// console.log('GET /v1/motions')
// apiClient.getMotionsList()
//   .then(response => {
//     console.log(response)
//   })
//   .catch((error: AxiosError) => {
//     console.log(error)
//     console.error(`ステータスコード: ${error?.response?.status}`)
//     console.error(error?.response?.data)
//   })

// console.log('GET /v1/stamps')
// apiClient.getStampsList()
//   .then(response => {
//     console.log(response)
//   })
//   .catch((error: AxiosError) => {
//     console.log(error)
//     console.error(`ステータスコード: ${error?.response?.status}`)
//     console.error(error?.response?.data)
//   })

// console.log('GET /v1/rooms')
// apiClient.getRoomsId()
//   .then(roomIds => {
//     console.log(roomIds)
//   })
//   .catch((error: AxiosError) => {
//     console.error(`ステータスコード: ${error?.response?.status}`)
//     console.error(error?.response?.data)
//   })

// console.log('GET /v1/webhook')
// apiClient.getWebhookSetting()
//   .then(response => {
//     console.log(response)
//   })
//   .catch((error: AxiosError) => {
//     console.error(`ステータスコード: ${error?.response?.status}`)
//     console.error(error?.response?.data)
//   })

console.log('GET /v1/rooms/{roomUuid}/messages')
apiClient.getMessages({roomUuid: '1d1ee13c-91c8-4d3f-889c-d88c73cb62dd'})
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`ステータスコード: ${error?.response?.status}`)
    console.error(error?.response?.data)
  })

console.log('GET /v1/rooms/{roomUuid}/sensors')
apiClient.getMessages({roomUuid: '1d1ee13c-91c8-4d3f-889c-d88c73cb62dd'})
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`ステータスコード: ${error?.response?.status}`)
    console.error(error?.response?.data)
  })