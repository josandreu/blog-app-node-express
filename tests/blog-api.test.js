const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const helper = require('./test-helper');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');
const initialBlogs = helper.initialBlogs;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  //   for (const blog of initialBlogs) {
  //     const blogObject = new Blog(blog);

  //     await blogObject.save();
  //   }

  await Blog.insertMany(initialBlogs);

  const passwordHash = await bcrypt.hash('passexample', 10);
  const user = new User({
    username: 'exampleuser',
    passwordHash,
  });
  await user.save();
});

describe('GET /api/blogs', () => {
  test('there are two blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test('unique identifier property of blogs is called id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogs = response.body;
    const everyHasId = blogs.every((blog) => blog.hasOwnProperty('id'));

    assert.strictEqual(everyHasId, true);
  });
});

describe('POST /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 10,
    };

    const user = {
      username: 'exampleuser',
      password: 'passexample',
    };

    const response = await api.post('/api/login').send(user).expect(200);
    token = response.body.token;

    await api
      .post('/api/blogs')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const titles = blogsAtEnd.map((r) => r.title);

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);
    assert(titles.includes('TDD harms architecture'));
  });

  test('if likes property does not exist, default value is 0', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
    };

    const user = {
      username: 'exampleuser',
      password: 'passexample',
    };

    const response = await api.post('/api/login').send(user).expect(200);
    token = response.body.token;

    const responseBlog = await api
      .post('/api/blogs')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(responseBlog.body.likes, 0);
  });

  test('if the title or url properties are missing from the request data, the backend responds with the status code 400 Bad Request', async () => {
    const newBlog = {
      author: 'Urmulu Riza',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
  });
});

describe('DELETE /api/blogs', () => {
  test('a blog can be deleted', async () => {
    const initialBlogs = await helper.blogsInDb();
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
    };

    const user = {
      username: 'exampleuser',
      password: 'passexample',
    };

    const response = await api.post('/api/login').send(user).expect(200);
    token = response.body.token;

    await api
      .post('/api/blogs')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(newBlog)
      .expect(201);

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);

    const titles = blogsAtEnd.map((b) => b.title);
    assert(!titles.includes(blogToDelete.title));
  });
});

describe('PUT /api/blogs', () => {
  test('a blog can be update', async () => {
    const update = {
      title: 'Note updated',
      likes: 33,
    };

    const blogsInDb = await helper.blogsInDb();
    const blogToUpdate = blogsInDb[0];

    const result = await api.put(`/api/blogs/${blogToUpdate.id}`).send(update);
    const blogUpdated = result.body;

    console.log('blogUpdated', blogUpdated);

    assert(blogUpdated.title.includes(update.title));
    assert.strictEqual(blogUpdated.likes, update.likes);
  });
});

after(async () => {
  await mongoose.connection.close();
}, 20000);
