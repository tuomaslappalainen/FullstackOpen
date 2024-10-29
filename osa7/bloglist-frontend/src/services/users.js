import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getById = async (id) => {
  console.log('Sending GET request to:', `${baseUrl}/${id}`) 
  const response = await axios.get(`${baseUrl}/${id}`)
  console.log('Response from GET request:', response) 
  return response.data
}

export default { getAll, getById }