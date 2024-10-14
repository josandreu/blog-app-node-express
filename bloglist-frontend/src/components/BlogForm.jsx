import { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({ title, author, url });
  };
  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={addBlog}>
        <div>
          Title{' '}
          <input
            type='text'
            name='Title'
            id='title'
            placeholder='title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author{' '}
          <input
            type='text'
            name='Author'
            id='author'
            placeholder='author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Url{' '}
          <input
            type='text'
            name='Url'
            id='url'
            placeholder='url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
