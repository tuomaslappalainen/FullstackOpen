import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote, voteAnecdote } from './requests'

const App = () => {
  const queryClient = useQueryClient()
  const minTextLength = 5

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  // eslint-disable-next-line no-unused-vars
  const toggleImportance = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, important: !anecdote.important })
  }

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if (content.length < minTextLength) {
      alert(`Anecdote must be at least ${minTextLength} characters long`)
      return
    }
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, important: true })
  }

  const vote = (id) => {
    voteAnecdoteMutation.mutate(id)
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
            {anecdote.content} <strong>{anecdote.votes}</strong>
            <button onClick={() => vote(anecdote.id)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App