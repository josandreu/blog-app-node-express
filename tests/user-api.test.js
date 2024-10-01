const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test-helper');
const api = supertest(app);

const User = require('../models/user');
const initialUsers = helper.initialUsers;

beforeEach(async () => {
  await User.deleteMany({});
  console.log('cleared');

  await User.insertMany(initialUsers);
  console.log('done');
});

describe('GET /api/users', () => {
  test('should get two users', async () => {
    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(users.body.length, helper.initialUsers.length);
  });
});

describe('POST /api/users', () => {
  test('an error should if the password or username is less than three characters', async () => {
    const notValidUser = {
      username: 'not-valid',
      name: 'Not Valid User',
      password: 'no',
    };

    const result = await api
      .post('/api/users')
      .send(notValidUser)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const users = await helper.usersInDb();

    assert.strictEqual(users.length, helper.initialUsers.length);
  });
});

after(async () => {
  await mongoose.connection.close();
}, 20000);
