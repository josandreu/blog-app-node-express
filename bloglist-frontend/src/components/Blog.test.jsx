import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { expect, test, describe, beforeEach } from 'vitest';

describe('<Blog />', () => {
  let container;

  const blog = {
    title: 'Blog test',
    author: 'Author test',
    url: 'http://test-url.com',
    likes: 4,
  };

  beforeEach(() => {
    container = render(<Blog blog={blog} />).container;
  });

  test('shows blog title, author but not renders url or likes', () => {
    screen.debug(container);

    const span = container.querySelector('.blog-header-info');
    const content = container.querySelector('.blog-content');

    expect(span).toHaveTextContent('Blog test Author test');
    expect(content).toHaveStyle('display: none');
  });

  test('after clicking the button, url and likes are displayed', async () => {
    const button = container.querySelector('.button-show');
    const content = container.querySelector('.blog-content');

    const user = userEvent.setup();
    await user.click(button);

    expect(content).not.toHaveStyle('display: none');
  });

  test('clicking the button calls event handler once', async () => {
    // eslint-disable-next-line no-undef
    const mockHandler = vi.fn();

    const blog = {
      title: 'Blog test',
      author: 'Author test',
      url: 'http://test-url.com',
      likes: 4,
    };

    const userBlog = {
      username: 'root',
      name: 'Paco',
      id: '66fbbad303e23e7735d3a528',
    };

    container = render(
      <Blog blog={blog} user={userBlog} updateBlog={mockHandler} />
    ).container;

    const user = userEvent.setup();
    const button = container.querySelector('.button-show');

    await user.click(button);

    const buttonLike = container.querySelector('.button-like');

    await user.click(buttonLike);
    await user.click(buttonLike);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
