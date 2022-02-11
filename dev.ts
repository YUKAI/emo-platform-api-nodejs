import type {AxiosError} from 'axios'
import {EmoApiClient} from './dist/index'
console.log('emo API Client dev client')

console.log('GET /v1/me')
EmoApiClient.getAccountInfo()
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`ステータスコード: ${error?.response?.status}`)
    console.error(error?.response?.data)
  })

console.log('GET /v1/rooms')
EmoApiClient.getRoomsList({offset: 0})
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`ステータスコード: ${error?.response?.status}`)
    console.error(error?.response?.data)
  })

EmoApiClient.getAccessToken()
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`ステータスコード: ${error?.response?.status}`)
    console.error(error?.response?.data)
  })
