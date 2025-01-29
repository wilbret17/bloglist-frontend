import { useState, useEffect } from 'react'
import axios from 'axios'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

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
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser') // Remove from localStorage
    setUser(null)
    setBlogs([]) // Clear blogs
    blogService.setToken(null) // Reset API token
  }

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <LoginForm handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  )
}

export default App
