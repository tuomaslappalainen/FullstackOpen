import React from 'react'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs, user, handleLike, handleDelete }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {sortedBlogs.map(blog => (
        <div key={blog.id} style={{ paddingTop: 5, paddingLeft: 5, border: 'solid', borderWidth: 1, marginBottom: 15 }}>
          <Link to={`/blogs/${blog.id}`}>{blog.title} By {blog.author}</Link>
        </div>
      ))}
    </div>
  )
}

export default BlogList