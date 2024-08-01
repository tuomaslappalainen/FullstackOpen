const { test, after, beforeEach } = require('node:test');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const supertest = require('supertest');
const assert = require('assert');
const app = require('../app'); 
const User = require('../models/users'); 

const api = supertest(app);

const initialUsers = [
  {
    username: 'validuser1',
    name: 'Valid User 1',
    password: 'password1'
  },
  {
    username: 'validuser2',
    name: 'Valid User 2',
    password: 'password2'
  }
];

beforeEach(async () => {
  await User.deleteMany({});
  for (let user of initialUsers) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(user.password, saltRounds);
    const newUser = new User({ ...user, passwordHash });
    await newUser.save();
  }
});

test('a valid user can be created', async () => {
  const newUser = {
    username: 'uniqueuser',
    name: 'Unique User',
    password: 'password123'
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const usersAtEnd = await api.get('/api/users');
  const usernames = usersAtEnd.body.map(u => u.username);

  assert(usernames.includes(newUser.username));
});

test('creation fails with proper status code and message if username already taken', async () => {
  const newUser = {
    username: 'validuser1',
    name: 'Duplicate User',
    password: 'password123'
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(result.body.error, 'username must be unique');
});

test('creation fails with proper status code and message if username is too short', async () => {
  const newUser = {
    username: 'us',
    name: 'Short Username',
    password: 'password123'
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(result.body.error, 'User validation failed: username: Path `username` (`us`) is shorter than the minimum allowed length (3).');
});

test('creation fails with proper status code and message if password is too short', async () => {
  const newUser = {
    username: 'newuser',
    name: 'New User',
    password: 'pw'
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(result.body.error, 'password must be at least 3 characters');
});

test('creation fails with proper status code and message if username is missing', async () => {
  const newUser = {
    name: 'No Username',
    password: 'password123'
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(result.body.error, 'username and password are required');
});

test('creation fails with proper status code and message if password is missing', async () => {
  const newUser = {
    username: 'nousername',
    name: 'No Password'
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(result.body.error, 'username and password are required');
});

after(async () => {
  await mongoose.connection.close();
});