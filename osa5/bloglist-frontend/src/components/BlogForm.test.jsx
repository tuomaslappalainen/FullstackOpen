import { render, screen, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'
import { vi } from 'vitest'

test('calls event handler with correct details when a new blog is created', () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')
  const form = screen.getByTestId('blog-form')

  fireEvent.change(titleInput, { target: { value: 'new Blog Title' } })
  fireEvent.change(authorInput, { target: { value: 'Nnw Blog Author' } })
  fireEvent.change(urlInput, { target: { value: 'http://newblog.com' } })
  fireEvent.submit(form)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'new Blog Title',
    author: 'new Blog Author',
    url: 'http://newblog.com'
  })
})