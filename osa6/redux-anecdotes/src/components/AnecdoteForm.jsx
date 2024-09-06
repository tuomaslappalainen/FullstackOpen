import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { getId } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

const addNewAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote({ content, id: getId(), votes: 0 }))
  }
return (
<div>
  <h2>create new</h2>
  <form onSubmit={addNewAnecdote}>
    <div><input name="anecdote" /></div>
    <button type="submit">create</button>
  </form>
</div>
)
}

export default AnecdoteForm