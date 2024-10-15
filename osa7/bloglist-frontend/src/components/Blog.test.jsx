import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import { vi } from 'vitest'

test('like button calls event handler with correct blog id', () => {
  const blog = {
    id: '12345',
    title: 'Testing React components',
    author: 'Testi Testinen',
    likes: 5,
    url: 'http://testaus.com',
    user: {
      username: 'testitestinen',
      name: 'Testi Testinen'
    }
  }

  const user = {
    username: 'testitestinen'
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} handleLike={mockHandler} handleDelete={() => {}} />)

  const viewButton = screen.getByText('view')
  fireEvent.click(viewButton)

  const likeButton = screen.getByText('like')
  fireEvent.click(likeButton)

  expect(mockHandler).toHaveBeenCalledWith('12345')
})

test('delete button calls event handler with correct blog id', () => {
  const blog = {
    id: '12345',
    title: 'Testing React components',
    author: 'Testi Testinen',
    likes: 5,
    url: 'http://testaus.com',
    user: {
      username: 'testitestinen',
      name: 'Testi Testinen'
    }
  }

  const user = {
    username: 'testitestinen'
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={user} handleLike={() => {}} handleDelete={mockHandler} />)

  const viewButton = screen.getByText('view')
  fireEvent.click(viewButton)

  const deleteButton = screen.getByText('delete')
  fireEvent.click(deleteButton)

  expect(mockHandler).toHaveBeenCalledWith('12345')
})