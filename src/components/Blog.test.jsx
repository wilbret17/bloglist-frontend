import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

// Test for rendering blog title and author, but not URL or likes by default
test('renders blog title and author but does not render url or likes by default', () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Jane Doe',
    url: 'http://example.com/blog/testing-react',
    likes: 42
  }

  render(<Blog blog={blog} />)

  // Verify that the title and author are rendered together
  expect(screen.getByText(/Testing React Components Jane Doe/)).toBeInTheDocument()

  // Ensure URL is NOT rendered by default
  expect(screen.queryByText(blog.url)).toBeNull()

  // Ensure "likes" text is NOT rendered by default
  expect(screen.queryByText(/likes/i)).toBeNull()
})

// Test for displaying blog URL and number of likes after clicking the "View details" button
test('displays blog URL and number of likes after clicking the "View details" button', () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Jane Doe',
    url: 'http://example.com/blog/testing-react',
    likes: 42
  }

  render(<Blog blog={blog} />)

  // Click the "View details" button
  const button = screen.getByText('View details')
  fireEvent.click(button)

  // Check that the URL and likes are now visible
  expect(screen.getByText(blog.url)).toBeInTheDocument()
  expect(screen.getByText(`${blog.likes} likes`)).toBeInTheDocument()
})

// Test for like button click handler
test('calls event handler twice when like button is clicked twice', () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Jane Doe',
    url: 'http://example.com/blog/testing-react',
    likes: 42
  }

  const mockLikeHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockLikeHandler} />)

  // Click the "View details" button to reveal the like button
  const viewButton = screen.getByText(/view details/i)
  fireEvent.click(viewButton)

  // Find the like button by role and click it twice
  const likeButton = screen.getByRole('button', { name: /like/i })
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  // Expect the like handler to be called twice
  expect(mockLikeHandler).toHaveBeenCalledTimes(2)
})
// Test for creating a new blog
test('calls event handler with correct details when a new blog is created', () => {
  const mockCreateBlog = vi.fn()

  render(<BlogForm createBlog={mockCreateBlog} />)

  // Find the form fields and fill them out
  const titleInput = screen.getByLabelText(/title/i)
  const authorInput = screen.getByLabelText(/author/i)
  const urlInput = screen.getByLabelText(/url/i)
  const submitButton = screen.getByRole('button', { name: /create/i })

  fireEvent.change(titleInput, { target: { value: 'New Blog Title' } })
  fireEvent.change(authorInput, { target: { value: 'John Doe' } })
  fireEvent.change(urlInput, { target: { value: 'http://example.com/new-blog' } })

  // Submit the form
  fireEvent.click(submitButton)

  // Check if the event handler was called with the right details
  expect(mockCreateBlog).toHaveBeenCalledWith({
    title: 'New Blog Title',
    author: 'John Doe',
    url: 'http://example.com/new-blog'
  })
})
