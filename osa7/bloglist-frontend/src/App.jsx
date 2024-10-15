import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
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
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const { state, dispatch } = useNotification()
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
    dispatch({ type: 'SET_NOTIFICATION', payload: { message: `A new blog "${newBlog.title}" by ${newBlog.author} added`, type: 'success' } })
    },
    onError: () => {
      dispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Error adding a blog', type: 'error' } })
    }
  })

  const deleteBlogMutation = useMutation(blogService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs');
      dispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Blog deleted', type: 'success' } })
    },
    onError: () => {
      dispatch({ type: 'SET_NOTIFICATION', payload: { message: 'Error deleting the blog', type: 'error' } })
    }
  })



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
    <div>
      <Notification />
      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div>
          <h2>{user.name} logged in <button onClick={handleLogout}>logout</button></h2>
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
      )}
    </div>
  )
}

export default App
