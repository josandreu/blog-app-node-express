const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test-helper');
const Blog = require('../models/blog');

const initialBlogs = helper.initialBlogs;

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  console.log('cleared');

  //   for (const blog of initialBlogs) {
  //     const blogObject = new Blog(blog);

  //     await blogObject.save();
  //   }

  await Blog.insertMany(initialBlogs);

  console.log('done');
});

describe('GET /api/blogs', () => {
  test('there are two notes', async () => {
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

    await api.post('/api/blogs').send(newBlog).expect(201);

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

    const response = await api.post('/api/blogs').send(newBlog).expect(201);

    assert.strictEqual(response.body.likes, 0);
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

after(async () => {
  await mongoose.connection.close();
}, 20000);
