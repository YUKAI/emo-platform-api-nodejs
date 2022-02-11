import { axiosClient } from './axios_client'
import type {
  EmoAccountInfo
} from './types'

interface AccountRepository {
  // https://platform-api.bocco.me/dashboard/api-docs#get-/v1/me
  getAccountInfo: () => Promise<EmoAccountInfo>
}

const repo: AccountRepository = {
  getAccountInfo: async () => await axiosClient.get('/me').then(({ data }) => data)
}

export {
  repo
}
