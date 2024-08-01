const { test, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const assert = require('node:assert');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const { log } = require('node:console');

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'DMC',
    url: 'asdf.com',
    likes: 8
  },
  {
    title: 'testing is not easy',
    author: 'DMC',
    url: 'asdf.com',
    likes: 100
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  console.log('blogs deleteed');
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  console.log('before each ends here');
})


test('there are two blogs', async () => {
  console.log('Running test for two blogs...');
  try {
    const response = await api
      .get('/api/blogs')
      .timeout({
        response: 10000,  
        deadline: 20000, 
      });
    assert.strictEqual(response.body.length, initialBlogs.length);
  } catch (error) {
  }
});

test('unique identifier is id', async () => {
  console.log('running test for unique identifier');
  try{
    const response = await api
      .get('/api/blogs')
      .timeout({
        response: 10000,
        deadline: 20000,
      })
    const blogs = response.body
    assert(blogs.length === initialBlogs,
      blogs.beforeEach(blog => {
        assert(blog.id, 'id property is missing');
        assert(!blog.id, '_id property should not be present')
      }));
  } catch(error){
    throw new Error(error.message)
  }
})

test('new blog added', async () => {
  console.log('running new blog test');

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'Ajghe', password: '1452' })
    .expect(200)
    .expect('Content-Type', '/application\/json/')
    .timeout({response: 20000, deadline: 30000})

  const token = loginResponse.body.token

  const newBlog = {
    title: 'random',
    author: 'DC',
    likes: 45,
    url: 'adf.com'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    .timeout({response: 20000, deadline: 30000})

  console.log('blog added');
  const response = await api.get('/api/blogs').timeout({response: 20000, deadline: 30000})

  const title = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(title.includes('random'))
})

test('adding a blogs fails when token is not provided', async () => {
  console.log('running a new blog test without token');
  const newBlog = {
    title: 'random',
    author: 'DC',
    likes: 45,
    url: 'unathorized.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
    .timeout({response: 20000, deadline: 30000})
    
  const response = await api.get('/api/blogs').timeout({response: 20000, deadline: 30000})

  const title = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, initialBlogs)
  assert(!title.includes('random'))
})

test('likes default to 0', async () => {
  console.log('running likes default test');
  const newBlog = {
    title: 'random',
    author: 'DC',
    url: 'adf.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    .timeout({response: 20000, deadline: 30000})

  assert.strictEqual(response.body.likes, 0)


})

test('blog without title returns 400 Bad Request', async () => {
  console.log('Running test for missing title...');

  const newBlog = {
    author: 'DMC',
    url: 'notitle.com',
    likes: 10
  };

  try {
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .timeout({
        response: 20000,  
        deadline: 30000,
      });

    assert.strictEqual(response.status, 400, 'Status should be 400');
    console.log('Test for missing title completed successfully');
  } catch (error) {
    console.error('Error in test for missing title:', error);
    throw new Error(error.message);
  }
});

test('blog without url returns 400 Bad Request', async () => {
  console.log('Running test for missing url...');

  const newBlog = {
    title: 'No URL',
    author: 'DMC',
    likes: 10
  };

  try {
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .timeout({
        response: 20000,  
        deadline: 30000, 
      });

    assert.strictEqual(response.status, 400, 'Status should be 400');
    console.log('Test for missing url completed successfully');
  } catch (error) {
    console.error('Error in test for missing url:', error);
    throw new Error(error.message);
  }
});

test('a blog can be deleted', async() => {
  console.log('running delete blog test');
  const blogsAtStart = await api.get('/api/blogs').timeout({response: 20000, deadline: 30000})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete}`)
    .expect(204)
    .timeout({response: 20000, deadline: 30000})

  const blogsAtEnd = await api.get('/api/blogs').timeout({response: 20000, deadline: 30000})

  assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

  const title = blogsAtEnd.map(r => r.title)
  assert(!title.includes(blogToDelete.title))
})

test('a blog can be updated', async () => {
  console.log('Running test for updating a blog...');
  
  
  const blogsAtStart = await api.get('/api/blogs').timeout({ response: 20000, deadline: 30000 });
  const blogToUpdate = blogsAtStart.body[0];


  const updatedBlog = {
    title: 'Updated title',
    author: 'Updated author',
    url: 'updated.com',
    likes: 10
  };


  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .timeout({ response: 20000, deadline: 30000 });

  console.log('Update response:', response.body);

  const blogsAtEnd = await api.get('/api/blogs').timeout({ response: 20000, deadline: 30000 });

  
  const updatedBlogFromApi = blogsAtEnd.body.find(b => b.id === blogToUpdate.id);
  assert.strictEqual(updatedBlogFromApi.title, updatedBlog.title);
  assert.strictEqual(updatedBlogFromApi.author, updatedBlog.author);
  assert.strictEqual(updatedBlogFromApi.url, updatedBlog.url);
  assert.strictEqual(updatedBlogFromApi.likes, updatedBlog.likes);

  console.log('Test for updating a blog completed successfully');
});

after(async () => {
  console.log('Closing MongoDB connection...');
  await mongoose.connection.close();
  console.log('Closed MongoDB connection.');
});