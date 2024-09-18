import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
    axios.get(baseUrl).then(res => res.data)

export const createAnecdote = newAnecdote => 
    axios.post(baseUrl, newAnecdote).then(res => res.data)

export const updateAnecdote = updatedAnecdote => {
    axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data)
}

export const voteAnecdote = async (id) => {
    const anecdote = await axios.get(`${baseUrl}/${id}`)
    const updatedAnecdote = { ...anecdote.data, votes: anecdote.data.votes + 1 }
    const response = await axios.put(`${baseUrl}/${id}`, updatedAnecdote)
    return response.data
  }