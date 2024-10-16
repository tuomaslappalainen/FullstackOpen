import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import UserList from './components/UserList'
import { useNotification } from './NotificationContext'
import { useUser } from './UserContext'
import './App.css'



const App = () => {
  const { user, dispatch: userDispatch } = useUser()
  const [blogs, setBlogs] = useState([])
  const { state, dispatch: notificationDispatch } = useNotification()
  const queryClient = useQueryClient()

  const blogFormRef = useRef()

  const {data: blogsData, isLoading, isError} = useQuery('blogs', blogService.getAll)
  
  useEffect(() => {
    if (blogsData) {
      setBlogs(blogsData);
    }
  }, [blogsData])

const createBlogMutation = useMutation(blogService.create, {
  onSuccess: (newBlog) => {
    queryClient.invalidateQueries('blogs')
    notificationDispatch({ type: 'SET_NOTIFICATION', payload: { message: `A new blog "${newBlog.title}" by ${newBlog.author} added`, type: 'success' } })
    },
    onError: () => {
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Error adding a blog', type: 'error' } })
    }
  })

  const deleteBlogMutation = useMutation(blogService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Blog deleted', type: 'success' } })
    },
    onError: () => {
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Error deleting the blog', type: 'error' } })
    }
  })



  useEffect(() => {
    const timer = setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  }, [state.message, notificationDispatch])

  



  const handleLogin = async ({ username, password }) => {
    try {
      console.log('Attempting to log in with:', { username, password })
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user })
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Login successful', type: 'success' } })
    } catch (exception) {
      console.error('Login failed:', exception)
      if (exception.response && exception.response.status === 401) {
        notificationDispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Invalid username or password', type: 'error' } })
      } else {
        notificationDispatch({ type: 'SET_NOTIFICATION', payload: { message: 'An error occurred during login', type: 'error' } })
      }
    }
  }

  const handleCreateBlog = async (newBlog) => {
    createBlogMutation.mutate(newBlog)
  }


  const handleLike = async (id) => {
    try {
      const blogToUpdate = blogs.find(blog => blog.id === id)
      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
      await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => (blog.id === id ? updatedBlog : blog)))
    } catch (error) {
      console.error('Error liking the blog:', error)
    }
  }

  const handleDelete = async (blog) => {
    console.log('Attempting to delete blog:', blog)
    const confirmDelete = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (confirmDelete) {
      try {
        console.log('Confirmed deletion for blog ID:', blog.id)
        deleteBlogMutation.mutate(blog.id, {
          onSuccess: () => {
            console.log('Blog deleted successfully:', blog.id)
            setBlogs(blogs.filter(b => b.id !== blog.id))
          },
          onError: (error) => {
            console.error('Error deleting the blog:', error)
          }
        })
      } catch (error) {
        console.error('Error in handleDelete:', error)
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching data</div>
  }

   

  if (!user) {
    return (
      <div>
        <Notification message={state.message}/>
        <LoginForm handleLogin={handleLogin} />
      </div>

    )
  }

  return (
    <Router>
    <div>
      <Notification />
      <nav>
        <Link to="/">Blogs</Link>&nbsp;
        <Link to="/users">Users</Link>
      </nav>
      <Routes>
        <Route path="/" element={
        <div>
          <h2>{user.name} logged in <button onClick={() => userDispatch({ type: 'CLEAR_USER' })}>logout</button></h2>
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm handleCreateBlog={handleCreateBlog} />
          </Togglable>
          <div>
            {blogs.map(blog => (
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                user={user}
              />
            ))}
          </div>
        </div>
      } />
      <Route path="/users" element={<UserList />} />
      </Routes>
    </div>
   </Router>
  )
}

export default App
