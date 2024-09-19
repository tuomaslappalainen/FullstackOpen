import { useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import Notification from './components/Notification'
import NotificationContext, { NotificationProvider } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const minTextLength = 5
  // eslint-disable-next-line no-unused-vars
  const [notification, dispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET_NOTIFICATION', payload: `Anecdote '${data.content}' was created` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    },
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET_NOTIFICATION', payload: `Anecdote '${data.content}' was voted` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    },
  })

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if (content.length < minTextLength) {
      dispatch({ type: 'SET_NOTIFICATION', payload:`Anecdote must be at least ${minTextLength} characters long`})
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
      return
    }
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, important: true })
  }

  const vote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const { data: anecdotes, error, isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
  })

  if (isLoading) {
    return <div>Loading data...</div>
  }

  if (error) {
    return <div>Error loading data: {error.message}</div>
  }

  return (
    <div>
      <h2>Anecdotes app</h2>
     
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
      <ul>
        {anecdotes.map(anecdote => (
          <li key={anecdote.id}>
            {anecdote.content} <strong>{anecdote.votes}   </strong>
            <button onClick={() => vote(anecdote)}>Vote</button>
          </li>
          
        ))}
      </ul>
      <Notification/>
    </div>
  )
}

const AppWithProvider = () => (
  <NotificationProvider>
    <App />
  </NotificationProvider>
)

export default AppWithProvider