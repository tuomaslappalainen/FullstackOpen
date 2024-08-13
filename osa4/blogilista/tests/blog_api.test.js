const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('../utils/list_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

let token = null
const newBlog = {
    title: 'Updated Blog Title',
    author: 'Updated Blog Author',
    url: 'updatedblogurl.com',
    likes: 6,
}
beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.blogsListAll)
    await User.deleteMany({})

    const newUser = {
        username: 'root',
        name: 'root',
        password: 'password',
    }

    await api
        .post('/api/users')
        .send(newUser)

    const result = await api
        .post('/api/login')
        .send(newUser)

    console.log('result.body???', result.body)
    
    
    token = result.body.token
    console.log('token', token)
    
    assert.ok(token)
})

test('GET /api/blogs: returns all blogs', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    
})

test('GET /api/blogs: blogs have identifier field id', async () => {
    const response = await api
      .get('/api/blogs')

    response.body.forEach(blog => {
    assert.ok(blog.hasOwnProperty('id'), 'Blog does not have an id field')
    assert.equal(typeof blog.id, 'string', 'id field is not a string')
  })
})

describe('POST, adding a blog', () => {  

    test('POST /api/blogs: adds a new blog', async () => {
        
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/);
    
        const createdBlog = response.body;
    
        assert.strictEqual(createdBlog.title, newBlog.title);
        assert.strictEqual(createdBlog.author, newBlog.author);
        assert.strictEqual(createdBlog.url, newBlog.url);
        assert.strictEqual(createdBlog.likes, newBlog.likes);
    })
    
    test('POST /api/blogs: responds with 401 if token is missing', async () => {

        const response = await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', 'Bearer invalid token')
          .expect(401)
          .expect('Content-Type', /application\/json/);
      
        assert.ok(response.body.error);
      })
    
    test('POST /api/blogs: defaults to 0 if likes property is missing', async () => {
        await api
          .post('/api/blogs')
          .send({ title: 'Test title', author: 'Test author', url: 'testurl.com' })
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
        const response = await api.get('/api/blogs')
        const blogs = response.body
        const addedBlog = blogs[blogs.length - 1]
      
        assert.strictEqual(addedBlog.likes, 0)
      })
    
    test('POST /api/blogs: responds with 400 if title or url is missing', async () => {
        const response = await api
            .post('/api/blogs')
            .send({ author: 'Test author', likes: 10 })
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        assert.ok(response.body.error)
    })
})

test('PUT /api/blogs/:id updates a blog', async () => {
    const blogToUpdate = helper.blogsListAll[0]
    const updatedBlog = {...blogToUpdate, likes: 15 }

    await api
       .put(`/api/blogs/${blogToUpdate._id}`)
       .send(updatedBlog)
       .expect(200)
       .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const updatedBlogs = response.body
    console.log(updatedBlogs)

    assert.strictEqual(updatedBlogs.length, helper.blogsListAll.length)

    assert.strictEqual(updatedBlogs[0].likes, 15)
})

test('DELETE /api/blogs/:id removes a blog', async () => {
    const blogToDelete = helper.blogsListAll[0]

    await api
       .delete(`/api/blogs/${blogToDelete._id}`)
       .set('Authorization', `Bearer ${token}`)
       .expect(204)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.blogsListAll.length - 1)

    const contents = response.body.map(r => r.title)
    assert(!contents.includes(blogToDelete.title))
})

after(async () => {
    await Blog.deleteMany({})
    await mongoose.connection.close()
})