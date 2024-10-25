import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import userService from '../services/userService'

const UserDetail = () => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    const fetchUser = async () => {
      console.log('Fetching user with ID:', id) 
      try {
        const user = await userService.getById(id)
        console.log('Fetched user:', user) 
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
        setError('User not found')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!user) {
    return <div>No user data available</div>
  }

  return (
    <div>
      <h2>{user.username}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs && user.blogs.length > 0 ? (
          user.blogs.map(blog => (
            <li key={blog.id}>{blog.title}</li>
          ))
        ) : (
          <li>No blogs added</li>
        )}
      </ul>
    </div>
  )
}

export default UserDetail