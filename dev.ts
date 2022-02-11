import {AccountRepository} from './dist/index'
console.log('emo API Client dev client')

console.log('GET /v1/me')
AccountRepository.getAccountInfo().then(response => console.log(response))
