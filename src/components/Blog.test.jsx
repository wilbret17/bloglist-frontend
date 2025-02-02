import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'

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
