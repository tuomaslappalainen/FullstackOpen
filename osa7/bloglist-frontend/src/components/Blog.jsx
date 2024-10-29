import React, { useState } from 'react'
import { Link } from 'react-router-dom'


const Blog = ({ blog, user, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const canDelete = blog.user && blog.user.username === user.username

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 15
  }

  return (
    <div style={blogStyle}>
      <div>
      <Link to={`/blogs/${blog.id}`}>{blog.title} By {blog.author}</Link>
      </div>
      {visible && (
        <div>
          <div>
            {blog.likes} likes
            <button onClick={() => handleLike(blog.id)}>like</button>
          </div>

          <div>
        added by {blog.user && blog.user.name}
          </div>

          {canDelete && <button onClick={() => handleDelete(blog)}>delete</button>}

        </div>
      )}
    </div>
  )
}

export default Blog