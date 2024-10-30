import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log('Updating blog:', `${baseUrl}/${id}`, newObject)
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

const remove = async id => {
  const config = {
    headers:  { Authorization: token },
  }
  const request = await axios.delete(`${baseUrl}/${id}`, config)
  return request.data
}

const getBlogById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data
}

const getComments = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}/comments`)
  return response.data
}

const addComment = async (id, comment) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log('sending request ', comment)
  const response = await axios.post(`${baseUrl}/${id}/comments`, { content: comment.content }, config)
  return response.data
}

export default { getAll, create, update,  setToken, remove, getBlogById, getComments, addComment }