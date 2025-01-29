import { useState, useEffect } from 'react'
import axios from 'axios'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Togglable from './components/Togglable'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notification, setNotification] = useState(null)

  // Load user from localStorage on app start
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token) // Set token for authenticated requests
    }
  }, [])

  // get blogs only if user is logged in
  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [user])

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('/api/login', credentials)
      const user = response.data
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setNotification('Login successful')
      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message)
      setNotification('Login failed: Incorrect username or password')
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    setBlogs([])
    blogService.setToken(null)
    setNotification('Logged out successfully')
    setTimeout(() => setNotification(null), 5000)
  }

  const handleAddBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = { title: newTitle, author: newAuthor, url: newUrl }
      const addedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(addedBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setNotification('New blog added successfully')
      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      console.error('Error adding blog:', error)
      setNotification('Failed to add new blog')
      setTimeout(() => setNotification(null), 5000)
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

          {/* Togglable form for creating new blogs */}
          <Togglable buttonLabel="Create new blog" cancelButtonLabel="Cancel">
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
          </Togglable>
        </div>
      )}
    </div>
  )
}

export default App
