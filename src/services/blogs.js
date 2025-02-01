import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  try {
    const config = {
      headers: { Authorization: token }
    }
    const response = await axios.get(baseUrl, config)
    return response.data
  } catch (error) {
    console.error('Error fetching blogs:', error.response?.data?.error || error.message)
    throw error
  }
}

const create = async (newBlog) => {
  try {
    const config = {
      headers: { Authorization: token }
    }
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
  } catch (error) {
    console.error('Error creating blog:', error.response?.data?.error || error.message)
    throw error
  }
}

const update = async (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, setToken, create, update, remove }