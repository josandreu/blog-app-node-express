import { useState } from 'react';

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    padding: '0.5rem',
    border: 'solid',
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 5,
  };

  const likeStyle = {
    display: 'flex',
    gap: '1rem',
  };

  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const showWhenVisible = { display: visible ? '' : 'none' };

  const buttonText = visible ? 'Hide' : 'View';

  const handleLike = (event) => {
    event.preventDefault();

    updateBlog(
      {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: Number(blog.likes) + 1,
        user: user.id,
      },
      blog.id
    );
  };

  const handleRemove = (event) => {
    event.preventDefault();

    const confirm = window.confirm(
      `Do you like to delete ${blog.title} by ${blog.author}?`
    );

    if (confirm) {
      removeBlog(blog.id);
    }
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button onClick={toggleVisibility}>{buttonText}</button>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <div style={likeStyle}>
          <p>{blog.likes}</p>
          <button onClick={handleLike}>Like</button>
        </div>
        {blog.user && <p>{blog.user.name}</p>}
        <button onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
};

export default Blog;
