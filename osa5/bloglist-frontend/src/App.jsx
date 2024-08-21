import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from "./services/login"
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import './App.css'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

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

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setMessage('Wrong username or password');
      setMessageType('error');
      setTimeout(() => {
        setMessage(null);
        setMessageType('');
      }, 5000);
    }
  }

  const handleCreateBlog = async ({ title, author, url }) => {
    try {
      const newBlog = {
        title,
        author,
        url
      }

    const savedBlog = await blogService.create(newBlog)
    setBlogs(blogs.concat(savedBlog))
    setMessage(`A new blog ${title} by ${author} added`)
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
        <Notification message={message} />
       <LoginForm handleLogin={handleLogin} />
      </div>
   
  )
}
  return (
    <div>
      <h1>Blogs</h1>
      <h2>{user.username} logged in</h2>
      <button onClick={handleLogout}>Logout</button>
      <Notification message={message}/>
      <Togglable buttonLabel="New blog">
        <BlogForm handleCreateBlog={handleCreateBlog} />
      </Togglable>
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )
}

export default App
