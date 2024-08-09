const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('../utils/test_helper')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ukko',
      name: 'ukkeli',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('when a property needed to create a user is missing', () => {

    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
    })

    test('creation fails with too short password', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'ukko2',
          name: 'ukkeli2',
          password: 'se',
        }
    
        await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
    
    test('creation fails with too short username', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'm',
          name: 'Ma',
          password: 'sekret',
        }
    
        await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
    
    test('creation fails with same username', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Mat',
          password: 'sekret',
        }
    
        await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
    
    test('creation fails with missing username', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          name: 'aa',
          password: 'sekret',
        }
    
        await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
    
    test('creation fails with missing password', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'ukko3',
          name: 'ukkeli',
        }
    
        await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
         .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })

})

after(async () => {
    await mongoose.connection.close()
  })