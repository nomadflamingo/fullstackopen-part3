import axios from 'axios'
const baseUrl = process.env.NODE_ENV === 'production'
  ? '/api/persons'
  : 'http://localhost:3001/api/persons'  // so that it works locally when only frontend is launched (wwhen using vite)

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { getAll, create, update, remove }