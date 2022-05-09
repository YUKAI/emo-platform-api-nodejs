# BOCCO emo platform api node.js sdk (beta version)

## Installation

TODO: publish
```
npm i emo-platform-api-sdk
```

## Usage

Set `ACCESS_TOKEN` environment variable.
You can get your access token at [the dashboard](https://platform-api.bocco.me/dashboard/)

```ts
import type { AxiosError } from 'axios'
import { EmoApiClient } from 'emo-platform-api-sdk'

const apiClient = new EmoApiClient({
  accessToken: 'YOUR ACCESS TOKEN',
  refreshToken: 'YOUR REFRESH TOKEN',
})

// Get my account information
apiClient.getMe()
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`Status code: ${error?.response?.status}`)
    console.error(error?.response?.data)
    console.log(error)
  })

// Get my rooms
apiClient.getRooms()
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`Status code: ${error?.response?.status}`)
    console.error(error?.response?.data)
  })

// response example
{
  listing: { offset: 0, limit: 50, total: 1 },
  rooms: [
    {
      uuid: 'bcbcbcbc-1234-5678-abcd-aaaaaaaaaaaa',
      name: 'My first room',
      roomType: 'normal',
      roomMembers: [Array]
    }
  ]
}

// Post a message
// You can obtain uuids of rooms from `getRooms` API.
const roomUuid = 'bcbcbcbc-1234-5678-abcd-aaaaaaaaaaaa'
apiClient
  .postTextMessage(roomUuid, {
    text: 'Hello, BOCCO!',
  })
  .then(response => {
    console.log(response)
  })
  .catch((error: AxiosError) => {
    console.error(`Status code: ${error?.response?.status}`)
    console.error(error?.response?.data)
  })
```
Then you will see the response of `GET /v1/me`

Please see further documentation at `docs/index.html`

## Library development

### Setup

- Node.js 16+ required.

```
yarn install
```

### Build

```
yarn build
```
Output will be placed under `/dist`.


### Build & watch

```
yarn build:watch
```

### Update documentation

```
yarn doc
```
Documentation will be placed under `docs/`.

### Running development script

To call SDK functions, modifying `dev.ts` would be easy.

```
yarn dev:watch
```
Whenever you save `dev.ts`, it's recompiled and run.
