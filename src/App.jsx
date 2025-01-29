import { useState, useEffect } from 'react'
import axios from 'axios'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notification, setNotification] = useState(null) // State for notifications

  // Load user from localStorage on app start
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token) // Set token for authenticated requests
    }
  }, [])

  // Fetch blogs only when user is logged in
  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [user])

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('/api/login', credentials)
      const user = response.data
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user)) // Save to localStorage
      setUser(user)
      blogService.setToken(user.token)
      setNotification('Login successful') // Success message for login
      setTimeout(() => setNotification(null), 5000) // Clear notification after 5 seconds
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message)
      setNotification('Login failed: Incorrect username or password') // Error message for failed login
      setTimeout(() => setNotification(null), 5000) // Clear notification after 5 seconds
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser') // Remove from localStorage
    setUser(null)
    setBlogs([]) // Clear blogs
    blogService.setToken(null) // Reset API token
    setNotification('Logged out successfully')
    setTimeout(() => setNotification(null), 5000)
  }

  const handleAddBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = { title: newTitle, author: newAuthor, url: newUrl }
      const addedBlog = await blogService.create(newBlog) // Send the new blog to the backend
      setBlogs(blogs.concat(addedBlog)) // Add the new blog to the current list
      setNewTitle('') // Clear the form fields
      setNewAuthor('')
      setNewUrl('')
      setNotification('New blog added successfully') // Success message for blog addition
      setTimeout(() => setNotification(null), 5000) // Clear notification after 5 seconds
    } catch (error) {
      console.error('Error adding blog:', error)
      setNotification('Failed to add new blog') // Error message for blog addition
      setTimeout(() => setNotification(null), 5000) // Clear notification after 5 seconds
    }
  }

  return (
    <div>
      {notification && <div style={{ padding: '10px', background: 'lightgrey', marginBottom: '20px' }}>{notification}</div>}
      {!user ? (
        <div>
          <h2>Log in to application</h2>
          <LoginForm handleLogin={handleLogin} />
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
          <form onSubmit={handleAddBlog}>
            <div>
              Title:
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div>
              Author:
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
              />
            </div>
            <div>
              URL:
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
            <button type="submit">Create</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
