import type {AxiosError} from 'axios'
import {EmoApiClient} from './dist/index'
import * as fs from 'fs'

console.log('emo API Client dev client')

const apiClient = new EmoApiClient({
  accessToken: process.env.ACCESS_TOKEN,
  refreshToken: process.env.REFRESH_TOKEN,
  baseURL: process.env.BASE_URL ?? 'https://platform-api.bocco.me',
})

// console.log('POST /oauth/token/refresh')
// apiClient.postTokenRefresh()
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

// console.log('GET /v1/me')
// apiClient.getMe()
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// console.log(error)
// })

// console.log('GET /v1/rooms')
// apiClient.getRooms({channelUser: process.env.CHANNEL_USER})
// // apiClient.getRooms()
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

// console.log('GET /v1/motions')
// apiClient.getMotions()
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.log(error)
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

// console.log('GET /v1/stamps')
// apiClient.getStamps({channelUser: process.env.CHANNEL_USER})
// apiClient.getStamps()
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.log(error)
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

// console.log('GET /v1/webhook')
// apiClient.getWebhook({channelUser: process.env.CHANNEL_USER})
// apiClient.getWebhook()
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

// console.log('POST /v1/webhook')
// apiClient.putWebhook({
// description: 'Webhookテスト3',
// url: 'http://a075-118-86-111-67.ngrok.io',
// // url: 'https://ecpplus.net',
// },
// // {channelUser: process.env.CHANNEL_USER}
// )
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// console.log(error)
// })

// console.log('PUT /v1/webhook')
// apiClient.putWebhook({
// description: 'Webhookテスト2',
// url: 'http://a075-118-86-111-67.ngrok.io',
// // url: 'https://ecpplus.net',
// },
// // {channelUser: process.env.CHANNEL_USER}
// )
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// console.log(error)
// })

// {
//   description: 'Webhookテスト3',
//   events: [ 'vui_command.detected', 'illuminance.changed' ],
//   status: 'active',
//   secret: '.Ilg@f"DMp#3xP7^#<+WK6xLd\\.%1yAZ<l:Ux L]Of_dVVTl8mA9,Fn"BexVMhl_',
//   url: 'http://a075-118-86-111-67.ngrok.io'
// }

// console.log('DELETE /v1/webhook')
// apiClient.deleteWebhook({channelUser: process.env.CHANNEL_USER})
// apiClient.deleteWebhook()
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// console.log(error)
// })

// console.log('PUT /v1/webhook/events')
// apiClient.putWebhookEvents({
// events: ['vui_command.detected', 'illuminance.changed'],
// },
// // {channelUser: process.env.CHANNEL_USER}
// )
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// console.log(error)
// })


const roomUuid = '34c6ceab-0292-4087-8384-2537834bcf22'

// console.log('GET /v1/rooms/{roomUuid}/messages')
// // apiClient.getMessages(roomUuid, {channelUser: process.env.CHANNEL_USER})
// apiClient.getMessages(roomUuid)
// .then(response => {
// console.log(response)
// // console.log(response['messages'][0])
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

// console.log('POST /v1/rooms/{roomUuid}/messages/text')
// apiClient.postTextMessage(roomUuid, {
// text: 'こんにちは。',
// })
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// console.error(error)
// })

// console.log('POST /v1/rooms/{roomUuid}/messages/stamp')
// apiClient.postStampMessage(roomUuid, {
// uuid: 'b599be00-8ccb-43d4-8ebd-a25edff199a1', // 勉強
// text: 'スタンプ送るよ',
// },
// // {channelUser: process.env.CHANNEL_USER}
// )
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// console.error(error)
// })

// fs.readFile('./assets/sample_image.jpg', (_err, image) => {
// console.log('POST /v1/rooms/{roomUuid}/messages/image')
// apiClient.postImageMessage(roomUuid, {
// image,
// },
// // {channelUser: process.env.CHANNEL_USER}
// )
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// // console.error(error)
// })
// })

// fs.readFile('./assets/sample_audio.mp3', (_err, audio) => {
// console.log('POST /v1/rooms/{roomUuid}/messages/audio')
// apiClient.postAudioMessage(
// roomUuid,
// {
// audio,
// },
// // {
// // channelUser: process.env.CHANNEL_USER,
// // }
// )
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// console.error(error)
// })
// })

// console.log('POST /v1/rooms/{roomUuid}/motions/led_color')
// apiClient.postLedColorMotion(
// roomUuid,
// {
// red: 100,
// green: 50,
// blue: 150,
// },
// // {
// // channelUser: process.env.CHANNEL_USER,
// // }
// )
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// console.error(error)
// })

// console.log('POST /v1/rooms/{roomUuid}/motions/move_to')
// apiClient.postMoveToMotion(
// roomUuid, {
// angle: 10,
// verticalAngle: 5,
// },
// // {
// // channelUser: process.env.CHANNEL_USER,
// // }
// )
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// console.error(error)
// })

const presetUuid = 'fa0beb73-ce8f-4786-9c0b-05ea5da9f125'

// console.log('POST /v1/rooms/{roomUuid}/motions/preset')
// apiClient.postPresetMotion(
// roomUuid,
// {
// uuid: presetUuid,
// },
// // {
// // channelUser: process.env.CHANNEL_USER,
// // }
// )
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// console.error(error)
// })


// console.log('GET /v1/rooms/{roomUuid}/sensors')
// apiClient.getSensors(
// roomUuid,
// {channelUser: process.env.CHANNEL_USER}
// )
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

const sensorUuid = '63042f3c-bc7f-445d-9460-b976fa9a8116'

// console.log('GET /v1/rooms/{roomUuid}/sensors/{sensorUuid}/values')
// // apiClient.getSensorValues(roomUuid, sensorUuid, {channelUser: process.env.CHANNEL_USER})
// apiClient.getSensorValues(roomUuid, sensorUuid)
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

// console.log('GET /v1/rooms/{roomUuid}/emo/setting', roomUuid,)
// apiClient.getEmoSettings(roomUuid, {channelUser: process.env.CHANNEL_USER})
// // apiClient.getEmoSettings(roomUuid)
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

// console.log('POST /v1/rooms/{roomUuid}/conversations')
// apiClient.postConversations(roomUuid, {channelUser: process.env.CHANNEL_USER})
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

const sessionId = 'de9ba52b-7a20-4c94-adae-f7a0fee8bba4'

// console.log('POST /v1/rooms/{roomUuid}/conversations/{sessionId}/recording')
// apiClient.postConversationsRecording(roomUuid, sessionId, {speechToText: true}, {channelUser: process.env.CHANNEL_USER})
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

// console.log('POST /v1/rooms/{roomUuid}/conversations/{sessionId}/text')
// apiClient.postConversationsText(roomUuid, sessionId, {display: false, text: '対話セッション内のテキストです'}, {channelUser: process.env.CHANNEL_USER})
// .then(response => {
// console.log(response)
// })
// .catch((error: AxiosError) => {
// console.error(`ステータスコード: ${error?.response?.status}`)
// console.error(error?.response?.data)
// })

const serviceUuid = '4c72bc4e-84b0-45cb-88e6-34d3c576e739'

console.log('PUT /v1/bocco_channel/services/{service_uuid}/conversation_endpoint')
apiClient.putConversationEndpoint(serviceUuid, {event: 'dialogue.started', 'dialogue.started': {roomUuid, channelCode: 'test', sessionId}}, {channelUser: process.env.CHANNEL_USER})
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`ステータスコード: ${error?.response?.status}`)
    console.error(error?.response?.data)
  })
