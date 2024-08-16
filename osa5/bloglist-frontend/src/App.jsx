import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from "./services/login"
import Notification from './components/Notification'
import './App.css'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(null)
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [message])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBloglistUser')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      setMessage('Wrong username of password')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType('')
      }, 5000)
    }
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: newTitle,
        author: newAuthor,
        url: newUrl
    }

    const savedBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(savedBlog))
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    setMessage(`A new blog ${newTitle} by ${newAuthor} added`)
    setMessageType('success')
    setTimeout(() => {
      setMessage(null)
      setMessageType('')
    }, 5000)
  } catch (exception) {
    setMessage('Error adding blog')
    setMessageType('error')
    setTimeout(() => {
      setMessage(null)
      setMessageType('')
    }, 5000)
  }
}

  if (!user) {
    return (
      <div>
        <h2>Login to application</h2>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
        <div>
        Username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form></div>
  )
}
  return (
    <div>
      <h1>Blogs</h1>
      <h2>{user.username} logged in</h2>
      <button onClick={handleLogout}>Logout</button>
      <Notification message={message}/>
      <h2>Create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          Title:
          <input
            type="text"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
          Author:
          <input
          type="text"
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
          URL
          <input
          type="text"
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )
}

export default App


