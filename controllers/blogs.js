const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).end();
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
  });

  const result = await blog.save();
  response.status(201).json(result);
});

blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;

  await Blog.findByIdAndDelete(id);

  response.status(204).end();
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
