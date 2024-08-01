const mongoose = require('mongoose')
const config = require('./utils/config') 
const logger = require('./utils/logger')  
const Blog = require('./models/blog')
const User = require('./models/users')

const addDefaultUserToBlogs = async () => {
  try {
    await mongoose.connect(config.MONGODB_URL)
    logger.info('Connected to MongoDB')

    const defaultUser = await User.findOne()

    if (!defaultUser) {
      console.log('No default user found. Please create a user first.')
      return
    }

    const blogsWithoutUser = await Blog.find({ user: { $exists: false } })
    console.log(`Found ${blogsWithoutUser.length} blogs without user field.`)

    for (let blog of blogsWithoutUser) {
      blog.user = defaultUser._id
      await blog.save()
      console.log(`Updated blog with id ${blog._id} to have user ${defaultUser._id}`)
    }

    if (blogsWithoutUser.length === 0) {
      console.log('No blogs without user field were found.')
    } else {
      console.log('Added default user to blogs without user field')
    }
  } catch (error) {
    console.error('Error updating blogs:', error)
  } finally {
    mongoose.connection.close()
  }
}

addDefaultUserToBlogs()