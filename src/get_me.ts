import { axiosClient } from './axios_client'

const getAccountInfo = async () => {
    return await axiosClient.get('/me')
}

export {
	getAccountInfo,
}

