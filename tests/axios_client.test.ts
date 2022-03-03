import { getAxiosInstance } from '../src/axios_client'

describe('getAxiosInstance', () => {
  test('with baseURL returns an AxiosInstance', () => {
    const instance = getAxiosInstance({
      baseURL: 'https://example.com',
    })

    expect(instance.defaults.baseURL).toBe('https://example.com')
    expect((instance.defaults.headers as any).accept).toBe('application/json')
    expect(instance.defaults.headers['content-type']).toBe('application/json')
  })

  test('with contentType returns an AxiosInstance', () => {
    const instance = getAxiosInstance({
      baseURL: 'https://example.com',
      contentType: 'multipart/form-data',
    })

    expect(instance.defaults.baseURL).toBe('https://example.com')
    expect((instance.defaults.headers as any).accept).toBe('application/json')
    expect(instance.defaults.headers['content-type']).toBe('multipart/form-data')
  })

  test('with convertCases returns an AxiosInstance', () => {
    const instance = getAxiosInstance({
      baseURL: 'https://example.com',
      contentType: 'multipart/form-data',
      convertCases: false,
    })

    expect(instance.defaults.baseURL).toBe('https://example.com')
    expect((instance.defaults.headers as any).accept).toBe('application/json')
    expect(instance.defaults.headers['content-type']).toBe('multipart/form-data')
  })
})
