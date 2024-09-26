import PropTypes from 'prop-types'
import { 
  useParams
 } from 'react-router-dom'

 const SingleAnecdote = ({ anecdotes }) => {
    const { id } = useParams()
    const anecdote = anecdotes.find(a => a.id === Number(id))
  
    if (!anecdote) {
      return <p>no anecdote found</p>
    }
  
    return (
      <div>
         <h2>{anecdote.content}</h2>
      <div><h3>by {anecdote.author}</h3></div>
      <div>has {anecdote.votes} votes</div>
      <div style={{marginTop: '5px', padding: '1px 0' }}></div>
      <div>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
      
      </div>
    )
  }

  SingleAnecdote.propTypes = {
    anecdotes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        author: PropTypes.string,
        info: PropTypes.string,
        votes: PropTypes.number
      })
    ).isRequired
  }

  export default SingleAnecdote