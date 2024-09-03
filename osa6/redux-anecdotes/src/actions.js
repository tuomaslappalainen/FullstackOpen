import { VOTE_ANECDOTE, ADD_ANECDOTE } from './actionTypes'

export const voteAnecdote = (id) => {
  return {
    type: VOTE_ANECDOTE,
    data: { id }
  }
}

export const addAnecdote = (content) => {
  return {
    type: ADD_ANECDOTE,
    data: {
      content,
      id: (100000 * Math.random()).toFixed(0),
      votes: 0
    }
  }
}