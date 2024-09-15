import { useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'
import { addAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const minTextLength = 2

const addNewAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    if (content.length < minTextLength) {
      dispatch(showNotification(`Anecdote must be at least ${minTextLength} characters long`, 3))
      return
    }
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