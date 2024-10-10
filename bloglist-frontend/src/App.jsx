import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import axios from 'axios';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [className, setClassName] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('userJSONData');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('userJSONData', JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);

      setPassword('');
      setUsername('');
    } catch (error) {
      setMessage(error.message);
      setClassName('error');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('userJSONData');
    window.location.reload();
  };

  const createBlog = async (blogObject) => {
    try {
      const response = await blogService.create(blogObject);
      if (response) {
        setTimeout(() => {
          blogFormRef.current.toggleVisibility();
          setBlogs(blogs.concat(response));
          setMessage('');
        }, 2000);
        setMessage(`A new blog: ${response.title} by ${response.author} added`);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const updateBlog = async (blogObject, id) => {
    try {
      const response = await blogService.update(blogObject, id);

      if (response) {
        setMessage(`Blog: ${response.title} by ${response.author} updated`);
        const updatedBlogs = await blogService.getAll();
        setBlogs(updatedBlogs);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id);

      const updatedBlogs = await blogService.getAll();
      setBlogs(updatedBlogs);
    } catch (error) {
      console.log('error', error);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username{' '}
        <input
          type='text'
          name='Username'
          id='username'
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        Password{' '}
        <input
          type='password'
          name='Password'
          id='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  );

  const blogFormRef = useRef();

  const createBlogForm = () => (
    <Togglable buttonLabel={'New Note'} ref={blogFormRef}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  );

  return (
    <div>
      <Notification message={message} className={className} />
      {user !== null && (
        <div>
          <div>
            <p>{user.name} is logged-in</p>
            <button onClick={handleLogout}>Log-out</button>
          </div>
          <div>{createBlogForm()}</div>
        </div>
      )}
      {user === null && (
        <div>
          <h2>Log in to application</h2>
          {loginForm()}
        </div>
      )}
      <h2>Blogs</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  );
};

export default App;
