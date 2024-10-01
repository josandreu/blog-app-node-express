const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'Title or url is missing',
    });
  }

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user.id,
  });

  const blogSaved = await blog.save();

  user.blogs = user.blogs.concat(blogSaved._id);
  await user.save();

  response.status(201).json(blogSaved);
});

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;

  const user = request.user;

  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(401).json({
      error: 'Invalid blog ID',
    });
  }

  if (blog.user.toString() === user.id.toString()) {
    const result = await Blog.findByIdAndDelete(id);

    response.status(204).end();
  }
});

blogRouter.put('/:id', async (request, response) => {
  const update = request.body;

  const opts = {
    runValidators: true,
    new: true,
    context: 'query',
  };

  const updatedNote = await Blog.findByIdAndUpdate(
    request.params.id,
    update,
    opts
  );

  response.json(updatedNote);
});

module.exports = blogRouter;
