const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })
  res.json(blogs)
})

blogRouter.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (blog) {
      res.json(blog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {

  const { title, author, url, likes } = request.body
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const userExists = request.user

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL must be provided' })
  }


  const blog = new Blog({
      title: title,
      author: author,
      url: url,
      likes: likes !== undefined ? likes : 0,
      user: userExists.id
  })

  try {
    const savedBlog = await blog.save()
    userExists.blogs = userExists.blogs.concat(savedBlog._id)
    await userExists.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const userExists = req.user

  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)
    if (deletedBlog) {
      userExists.blogs = userExists.blogs.filter(blogId => blogId.toString()!== req.params.id)
      await userExists.save()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (req, res, next) => {
  const { title, author, url, likes } = req.body

  const updatedBlog = {
    title: title,
    author: author,
    url: url,
    likes: likes!== undefined? likes : 0,
  }

  try {
    const updatedResult = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true })
    if (updatedResult) {
      res.json(updatedResult)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter