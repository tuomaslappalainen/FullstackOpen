import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import { vi } from 'vitest'

test('renders title and author, but not likes or other details by default', () => {
  const blog = {
    title: 'Testing React components',
    author: 'John Doe',
    likes: 5,
    user: {
      username: 'johndoe',
      name: 'John Doe'
    }
  }

  const user = {
    username: 'johndoe'
  }

  render(<Blog blog={blog} user={user} handleLike={() => {}} handleDelete={() => {}} />)

  const titleAuthorElement = screen.getByText('Testing React components By John Doe')
  expect(titleAuthorElement).toBeInTheDocument()

  const likesElement = screen.queryByText('5 likes')
  const addedByElement = screen.queryByText('added by John Doe')
  expect(likesElement).toBeNull()
  expect(addedByElement).toBeNull()
})

test('shows URL and number of likes when the button controlling the shown details has been clicked', () => {
  const blog = {
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

  render(<Blog blog={blog} user={user} handleLike={() => {}} handleDelete={() => {}} />)

  const button = screen.getByText('view')
  fireEvent.click(button)

  const urlElement = screen.getByText((content, element) => {
    return element.textContent.includes('http://testaus.com')
  })
  const likesElement = screen.getByText('5 likes')
  expect(urlElement).toBeInTheDocument()
  expect(likesElement).toBeInTheDocument()
})

test('calls event handler twice if the like button is clicked twice', () => {
  const blog = {
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
  fireEvent.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})