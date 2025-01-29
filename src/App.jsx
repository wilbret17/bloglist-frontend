import { useState, useEffect } from 'react'
import axios from 'axios'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [user]) // Fetch blogs only when user is logged in

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('/api/login', credentials)
      setUser(response.data) // Save user data including token
      blogService.setToken(response.data.token) // Set token for blog requests
    } catch (error) {
      console.error('Login failed:', error.response?.data?.error || error.message)
    }
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
      <p>{user.name} logged in</p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
