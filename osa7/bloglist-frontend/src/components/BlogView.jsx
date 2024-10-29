import React from 'react'
import { useParams } from 'react-router-dom'

const BlogView = ({ blogs, user, handleLike, handleDelete }) => {
  const { id } = useParams()
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return null
  }

  const canDelete = blog.user && blog.user.username === user.username

  return (
    <div style={{ padding: '10px' }}>
      <h2>{blog.title}</h2> <strong>By {blog.author}</strong>
      <div style={{ marginTop: '10px' }}>
       <p>{blog.likes} likes
        <button onClick={() => handleLike(blog.id)} style={{ marginLeft: '10px' }}>like</button></p> 
      </div>
      <div style={{ marginTop: '10px' }}>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
      </div>
      <div style={{ marginTop: '10px' }}>added by {blog.user && blog.user.name}</div>
      {canDelete && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => handleDelete(blog)}>delete</button>
        </div>
      )}
    </div>
  )
}

export default BlogView