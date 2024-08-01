const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/users')
const userExtractor = require('../utils/middleware').userExtractor


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
    const {title, author, url, likes} = request.body

    const user = request.user

    if(!title || !url){
        return response.status(400).json({ error: 'title and url are required' })
    }

    const blog = new Blog({
        title, 
        author, 
        url, 
        likes: likes || 0,
        user: user.id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
    const { id } = request.params

    const user = request.user

    const blog = await Blog.findById(id)

    if(!blog){
        return response.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndDelete(id)
        response.status(204).end()
    } else {
        response.status(401).json({ error: 'user not authorized' })
    }

})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes,
        title: body.title,
        author: body.author,
        url: body.url
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })
        if (updatedBlog) {
          response.json(updatedBlog)
        } else {
          response.status(404).end()
        }
      } catch (error) {
        console.log(error)
        response.status(400).json({ error: 'Failed to update blog' })
      }
})

module.exports = blogRouter