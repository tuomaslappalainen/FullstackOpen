import { useState } from 'react'
import './App.css'
import CreateNew from './components/CreateNew'
import AnecdoteList from './components/AnecdoteList'
import About from './components/About'
import SingleAnecdote from './components/SingleAnecdote'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,

} from "react-router-dom"

const Menu = () => {
  return (
    <div>
       <Link to="/">anecdotes</Link> &nbsp;
    <Link to="/create">create new</Link> &nbsp;
    <Link to="/about">about</Link>
    </div>
  )
}



const Footer = () => (


  <div style={{marginTop: '15px', padding: '10px 0' }}>
   
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
  
)

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`Anecdote '${anecdote.content}' created successfully`);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  }
  

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  

  return (
    <Router>
    <div>
      <h1>Software anecdotes</h1>
      <Menu />

      {notification && <div className="notification">{notification}</div>}
      <Routes>

      <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
      <Route path='/create' element={<CreateNew addNew={addNew} />} />
      <Route path='/about' element={<About />} />
      <Route path='/anecdotes/:id' element={<SingleAnecdote anecdotes={anecdotes} />} />

      </Routes>
      
      <Footer />
    </div>
    </Router>
  )
}

export default App