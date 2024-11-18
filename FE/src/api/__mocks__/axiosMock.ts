import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { ShellType } from '@/types/interfaces'
import getMocResult from '@/api/__mocks__/util'
import shellDataRaw from '@/api/__mocks__/mocData.json'

const shellData: ShellType[] = shellDataRaw.result

const axiosMock = axios.create()
const mock = new MockAdapter(axiosMock)

axiosMock.interceptors.response.use(
  (response) => {
    response.data.data = response.data
    return response
  },
  (error) => Promise.reject(error)
)

// fetch
mock.onGet('/shells').reply(200, shellData)

// add
mock.onPost('/shells').reply((config) => {
  const newShell: ShellType = JSON.parse(config.data)
  newShell.id = new Date().getTime()
  shellData.push(newShell)
  return [200, newShell.id]
})

// execute
mock.onPost(/^\/shells(\/\d+\/execute)?$/).reply((config) => {
  const id = parseInt(config.url!.split('/')[2], 10)
  const executeddShell = shellData.find((shell) => shell.id === id)
  const index = shellData.findIndex((shell) => shell.id === id)

  if (!executeddShell) return [404, { error: 'Shell not found' }]
  const result = getMocResult(executeddShell)

  shellData.splice(index, 1, { ...executeddShell, ...result })
  return [200, result]
})

// delete
mock.onDelete(/\/shells\/\d+/).reply((config) => {
  const id = parseInt(config.url!.split('/').pop()!, 10)
  const index = shellData.findIndex((shell) => shell.id === id)

  if (index === -1) return [404, { error: 'Shell not found' }]

  shellData.splice(index, 1)
  return [200, id]
})

// put
mock.onPut(/\/shells\/\d+/).reply((config) => {
  const id = parseInt(config.url!.split('/').pop()!, 10)
  const newQuery = config.data
  const changedShell = shellData.find((shell) => shell.id === id)

  if (!changedShell) return [404, { error: 'Shell not found' }]
  changedShell.query = config.data

  return [200, { id, newQuery }]
})

export default axiosMock
