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

console.log('POST /v1/rooms/{roomUuid}/motions')
apiClient.postMotion(
  roomUuid, {
  head: [
    {
      "duration": 1000,
      "p0": [null, null],
      "p1": [null, null],
      "p2": [-40, -20],
      "p3": [-40, -20],
      "ease": [0, 0, 1, 1]

    },
    {
      "duration": 2000,
      "p0": [null, null],
      "p1": [0, 20],
      "p2": [0, -20],
      "p3": [40, 20],
      "ease": [0, 0, 1, 1]
    },
    {
      "duration": 1000,
      "p0": [null, null],
      "p1": [null, null],
      "p2": [0, 0],
      "p3": [0, 0],
      "ease": [0, 0, 1, 1]
    }
  ],
  antenna: [
    {
      "duration": 1000,
      "start":
      {
        "amp": 1,
        "freq": 8,
        "pos": null
      },
      "end":
      {
        "amp": 1,
        "freq": 8,
        "pos": null
      }
    },
    {
      "duration": 1000,
      "start": {
        "amp": 0.5,
        "freq": 8,
        "pos": null
      },
      "end": {
        "amp": 0.5,
        "freq": 8,
        "pos": null
      }
    }
  ],
  led_cheek_l: [
    {
      "duration": 1000,
      "start": [null, null, null, null],
      "end": [0, 255, 0, 255],
      "ease": [0, 0, 1, 1]
    },
    {
      "duration": 1000,
      "start": [null, null, null, null],
      "end": [0, 0, 0, 0],
      "ease": [0, 0, 1, 1]
    }
  ],
  led_cheek_r: [
    {
      "duration": 1000,
      "start": [null, null, null, null],
      "end": [0, 255, 0, 255],
      "ease": [0, 0, 1, 1]
    },
    {
      "duration": 1000,
      "start": [null, null, null, null],
      "end": [0, 0, 0, 0],
      "ease": [0, 0, 1, 1]
    }
  ],
  led_play: [
    {
      "duration": 1000,
      "start": [null, null, null, null],
      "end": [0, 255, 0, 255],
      "ease": [0, 0, 1, 1]
    },
    {
      "duration": 1000,
      "start": [null, null, null, null],
      "end": [0, 0, 0, 0],
      "ease": [0, 0, 1, 1]
    }
  ],
  led_rec: [
    {
      "duration": 1000,
      "start": [null, null, null, null],
      "end": [0, 255, 0, 255],
      "ease": [0, 0, 1, 1]
    },
    {
      "duration": 1000,
      "start": [null, null, null, null],
      "end": [0, 0, 0, 0],
      "ease": [0, 0, 1, 1]
    }
  ],
  led_func: [
    {
      "duration": 1000,
      "start": [null, null, null, null],
      "end": [0, 255, 0, 255],
      "ease": [0, 0, 1, 1]
    },
    {
      "duration": 1000,
      "start": [null, null, null, null],
      "end": [0, 0, 0, 0],
      "ease": [0, 0, 1, 1]
    }
  ],
},
  // {
  // channelUser: process.env.CHANNEL_USER,
  // }
)
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`ステータスコード: ${error?.response?.status}`)
    console.error(error?.response?.data)
    console.error(error)
  })

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

console.log('GET /v1/rooms/{roomUuid}/emo/settings')
// apiClient.getEmoSettings(roomUuid, {channelUser: process.env.CHANNEL_USER})
// apiClient.getEmoSettings(roomUuid)
  // .then(response => {
    // console.log(response)
  // })
  // .catch((error: AxiosError) => {
    // console.error(`ステータスコード: ${error?.response?.status}`)
    // console.error(error?.response?.data)
  // })
