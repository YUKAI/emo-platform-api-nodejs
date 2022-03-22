import nock from 'nock'
const fs = require('fs').promises;
import { EmoApiClient } from '../src/repository'
// const FormData = jest.createMockFromModule('form-data');


describe('token refreshing', () => {
  describe('JSON client', () => {
    test('doesn\'t refresh token if access token is still valid', async () => {
      const client = new EmoApiClient({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        baseURL: 'https://localhost',
      })

      const refreshTokens = jest.fn()
      client.refreshTokens = refreshTokens

      const scope = nock('https://localhost')
        .get('/v1/me')
        .reply(200, `
          {
            "uuid": "4b871d0f-3949-456d-9934-99fbfbd7d384",
            "name": "Node太郎",
            "email: "node@example.com",
            "profile_image": "https://localhost/images/4b871d0f-3949-456d-9934-99fbfbd7d384.jpg",
            "plan": "free",
            "status": "active"
          }
        `)

      await client.getMe()

      expect(refreshTokens.mock.calls.length).toBe(0)
      scope.done()
    })

    test('refreshes token if access token is expired', async () => {
      const client = new EmoApiClient({
        accessToken: 'old-access-token',
        refreshToken: 'refresh-token',
        baseURL: 'https://localhost',
      })
      expect(client.axiosJsonInstance.defaults.headers.Authorization).toBe('Bearer old-access-token')
      
      const postTokenRefresh = jest.fn(async () => {
        return { accessToken: 'new-access-token' }
      })
      client.postTokenRefresh = postTokenRefresh
      
      const originalRefreshTokens = client.refreshTokens.bind(client)
      const refreshTokens = jest.fn(async () => await originalRefreshTokens())

      client.refreshTokens = refreshTokens
      const axiosRequest = jest.fn().mockResolvedValue({test: 123})
      client.axiosJsonInstance.request = axiosRequest

      await expect(client.axiosJsonInstance.interceptors.response.handlers[0].rejected({
        response: {
          status: 401,
          data: {reason: 'JWT is expired'}
        },
        config: {
          _retry: undefined,
          headers: {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer old-access-token'
            },
            method: 'get',
            baseURL: 'https://localhost',
            url: '/v1/me',
            data: undefined,
          },
        }
      })).resolves.toMatchObject({test: 123})

      expect(postTokenRefresh.mock.calls.length).toBe(1)
      expect(refreshTokens.mock.calls.length).toBe(1)
      expect(axiosRequest.mock.calls.length).toBe(1)
    
      expect(client.axiosJsonInstance.defaults.headers.Authorization).toBe('Bearer new-access-token')
    })
  })
  
  describe('Multipart client', () => {
    test('doesn\'t refresh token if access token is still valid', async () => {
      const client = new EmoApiClient({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        baseURL: 'https://localhost',
      })

      const roomUuid = 'fe4b4bb3-5b9b-4447-be20-7ec187a252d4'

      const refreshTokens = jest.fn()
      client.refreshTokens = refreshTokens

      const scope = nock('https://localhost')
        .post(`/v1/rooms/${roomUuid}/messages/image`)
        .reply(200, `
          {
            "sequence": 20220303181818452,
            "unique_id": "9217587a-da4e-4b36-b47a-d6cd1e47a5e5",
            "user": {
              "uuid": "f065f7f2-c980-4f80-acd3-828bfb36e107",
              "user_type": "member",
              "nickname": "Node太郎",
              "profile_image": "https://localhost/1/profile_images/ee11594e-0c87-4dfe-a20c-cc4b3d73dc82.jpeg"
            },
            "message": { "ja": "" },
            "media": "image",
            "audio_url": "",
            "image_url": "https://staging-platform-api.bocco.me/ext}/1/rooms/${roomUuid}/feeds/b7f1b6eb-430a-4dbf-9a4e-58ad1c6c3267/image",
            "lang": "ja"
          }
        `)

      const image = await fs.readFile('./assets/sample_image.jpg')
      await client.postImageMessage(roomUuid, {image})

      expect(refreshTokens.mock.calls.length).toBe(0)
      scope.done()
    })

    test('refreshes token if access token is expired', async () => {
      const client = new EmoApiClient({
        accessToken: 'old-access-token',
        refreshToken: 'refresh-token',
        baseURL: 'https://localhost',
      })

      const roomUuid = 'fe4b4bb3-5b9b-4447-be20-7ec187a252d4'

      expect(client.axiosJsonInstance.defaults.headers.Authorization).toBe('Bearer old-access-token')
      
      const postTokenRefresh = jest.fn(async () => {
        return { accessToken: 'new-access-token' }
      })
      client.postTokenRefresh = postTokenRefresh
      
      const originalRefreshTokens = client.refreshTokens.bind(client)
      const refreshTokens = jest.fn(async () => await originalRefreshTokens())

      client.refreshTokens = refreshTokens
      const axiosRequest = jest.fn().mockResolvedValue({test: 123})
      client.axiosJsonInstance.request = axiosRequest

      await expect(client.axiosMultipartInstance.interceptors.response.handlers[0].rejected({
        response: {
          status: 401,
          data: {reason: 'JWT is expired'}
        },
        config: {
          _retry: undefined,
          headers: {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer old-access-token'
            },
            method: 'post',
            baseURL: 'https://localhost',
            url: `/v1/rooms/${roomUuid}/messages/image`,
            data: undefined,
          },
        }
      })).rejects.toMatchObject(new Error('TOKEN_EXPIRED'))

      expect(postTokenRefresh.mock.calls.length).toBe(1)
      expect(refreshTokens.mock.calls.length).toBe(1)
      expect(axiosRequest.mock.calls.length).toBe(0)
    
      expect(client.axiosJsonInstance.defaults.headers.Authorization).toBe('Bearer new-access-token')
    })
  })
})
