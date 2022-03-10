# BOCCO emo platform api node.js sdk (beta version)

## Installation

TODO: publish
```
npm i emo-platform-api-sdk
```

## Usage

Set `ACCESS_TOKEN` environment variable.
You can get your access token at [the dashboard](https://platform-api.bocco.me/dashboard/)

```
export ACCESS_TOKEN='AAAAAA.BBBBBBBB.CCCC'
```

```
import { AccountRepository } from 'emo-platform-api-sdk'

AccountRepository.getMe().then(response => console.log(response))
```
Then you will see the response of `GET /v1/me`


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
Output will be under `/dist`.


### Build & watch

```
yarn build:watch
```


### Update documentation

```
yarn doc
```

### Running development script

To call SDK functions, using `dev.ts` is easy.

```
yarn dev:watch
```
Then whenever you save `dev.ts`, it's recompiled and run.
