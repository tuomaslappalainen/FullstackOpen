import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const VisibilityFilter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    dispatch(setFilter(event.target.value))
  }

  return (
    <div>
      <input type="text" onChange={handleChange} placeholder="Filter anecdotes" />
    </div>
  )
}

export default VisibilityFilter