import type {AxiosError} from 'axios'
import {EmoApiClient} from './dist/index'
console.log('emo API Client dev client')

const apiClient = new EmoApiClient({
  accessToken: process.env.ACCESS_TOKEN,
  refreshToken: process.env.REFRESH_TOKEN,
})

console.log('GET /v1/me')
apiClient.getAccountInfo()
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`ステータスコード: ${error?.response?.status}`)
    console.error(error?.response?.data)
  })

  apiClient.getAccessToken()
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`ステータスコード: ${error?.response?.status}`)
    console.error(error?.response?.data)
  })
