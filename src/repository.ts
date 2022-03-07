import { axiosClient } from './axios_client'
import type {
  EmoAccountInfo
} from './types'

interface Repository {
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/me
  getAccountInfo: () => Promise<EmoAccountInfo>
}

const repository: Repository = {
  getAccountInfo: async () => await axiosClient.get('/me').then(({ data }) => data)
}

export {
  repository
}
