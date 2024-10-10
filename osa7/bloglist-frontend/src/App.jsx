import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { useNotification } from './NotificationContext'
import './App.css'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const { state, dispatch } = useNotification()

  const blogFormRef = useRef()




  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [state.message, dispatch])

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
      blogService.setToken(user.token)
      setUser(user)
      dispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Login successful', type: 'success' } })
    } catch (exception) {
      dispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Wrong credentials', type: 'error' } })
    }
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const savedBlog = await blogService.create(newBlog)
      const blogWithUser = {
        ...savedBlog,
        user: user
        }
      setBlogs(blogs.concat(blogWithUser))
      blogFormRef.current.toggleVisibility()
      dispatch({ type: 'SET_NOTIFICATION', payload: { message: `A new blog "${savedBlog.title}" by ${savedBlog.author} added`, type: 'success' } })
    } catch (exception) {
      dispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Error adding a blog', type: 'error' } })
    }
  }

  const handleLike = async (id) => {
    const blogToLike = blogs.find(b => b.id === id)
    const updatedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1
    }

    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      // Varmistaa että blogin lisääjän nimi näkyy tykkäyksen jälkeen
      const blogWithUser = {
        ...returnedBlog,
        user: blogToLike.user
      }
      setBlogs(blogs.map(blog => blog.id !== id ? blog : blogWithUser))
    } catch (exception) {
      dispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Error liking the blog', type: 'error' } });
    }
  }

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find(b => b.id === id)
    const confirmDelete = window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)
    if (confirmDelete) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        dispatch({ type: 'SET_NOTIFICATION', payload: { message: `Blog "${blogToDelete.title}" by ${blogToDelete.author} removed`, type: 'success' } })
  
      } catch (exception) {
        console.log(exception)
        dispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Error deleting the blog', type: 'error' } })
      }
    }
  }

  if (!user) {
    return (
      <div>
        <Notification message={state.message}/>
        <LoginForm handleLogin={handleLogin} />
      </div>

    )
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h1>Blogs</h1>
      <h2>{user.username} logged in</h2>
      <button onClick={handleLogout}>Logout</button>
      <Notification/>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm handleCreateBlog={handleCreateBlog} />
      </Togglable>
      <div>
        {sortedBlogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike} handleDelete={handleDelete} />
        )}
      </div>   
    </div>
  )
}

export default App
