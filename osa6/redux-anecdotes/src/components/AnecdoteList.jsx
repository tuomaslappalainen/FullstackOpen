import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initializeAnecdotes, voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
 const anecdotes = useSelector(state => state.anecdotes || [])
  const filter = useSelector(state => state.filter || '')
  const dispatch = useDispatch()

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    typeof anecdote.content === 'string' && anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])


  const vote = (id) => {
    dispatch(voteAnecdote(id))
    const votedAnecdote = anecdotes.find(a => a.id === id)
    dispatch(showNotification(`You voted '${votedAnecdote.content}'`, 5))
  }

  return (
    <div>
      {filteredAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList