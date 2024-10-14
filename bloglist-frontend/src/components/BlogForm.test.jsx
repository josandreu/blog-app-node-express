import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';
import { expect, test, describe, beforeEach } from 'vitest';

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  // eslint-disable-next-line no-undef
  const createBlog = vi.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const authorInput = screen.getByPlaceholderText('author');
  const urlInput = screen.getByPlaceholderText('url');
  const TitleInput = screen.getByPlaceholderText('title');
  const createButton = screen.getByText('Create');

  await user.type(TitleInput, 'This is the title');
  await user.type(authorInput, 'Anonim');
  await user.type(
    urlInput,
    'https://en.wikipedia.org/wiki/Book_of_Dede_Korkut'
  );
  await user.click(createButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog.mock.calls[0][0].title).toBe('This is the title');
});
