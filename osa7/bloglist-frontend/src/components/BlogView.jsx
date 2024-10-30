import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'


const BlogView = ({ blogs, user, handleLike, handleDelete }) => {
  const { id } = useParams()
  const blog = blogs.find(blog => blog.id === id)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (blog) {
      blogService.getComments(blog.id).then(comments => setComments(comments))
    }
  }, [blog])

  const handleAddComment = async (event) => {
    event.preventDefault()
    console.log('request body', { content: newComment })
    
    const addedComment = await blogService.addComment(blog.id, { content: newComment })
    console.log('added comment:', addedComment)
    setComments(comments.concat(addedComment))
    setNewComment('')
  }
  

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
      <div style={{ marginTop: '20px' }}>
        <h3>Comments</h3>
        <ul>
          {comments.map((comment, index) => (
            <li key={index} style={{ color: 'black' }}>{comment.content}</li>
          ))}
        </ul>
        <form onSubmit={handleAddComment}>
          <input
            type="text"
            value={newComment}
            onChange={({ target }) => setNewComment(target.value)}
            placeholder="Add a comment"
            />
            <button type="submit">Add comment</button>
          </form>
          </div>
    </div>
  )
}

export default BlogView