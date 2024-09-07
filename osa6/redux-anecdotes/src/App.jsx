import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList';
import VisibilityFilter from './components/VisibilityFIlter';
import './App.css'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <VisibilityFilter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App