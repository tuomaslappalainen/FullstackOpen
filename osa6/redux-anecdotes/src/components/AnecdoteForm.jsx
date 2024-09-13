import { useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'
import { addAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

const addNewAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
    dispatch(showNotification(`You added '${content}'`, 3))
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