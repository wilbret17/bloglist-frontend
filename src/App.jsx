import { useState, useEffect } from 'react'
import axios from 'axios'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'


const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)

  // Load user from localStorage on app start
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
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
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setNotification('Login successful')
      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
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

  const handleAddBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(addedBlog))
      setNotification('New blog added successfully')
      setTimeout(() => setNotification(null), 5000)
    } catch (error) {
      setNotification('Failed to add new blog')
      setTimeout(() => setNotification(null), 5000)
    }
  }
  
  const handleLike = async (blogToUpdate) => {
    try {
      // Create a new blog object with incremented likes
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1, 
        user: blogToUpdate.user ? blogToUpdate.user.id : blogToUpdate.user // Ensure user is passed correctly
      };
  
      // Send the PUT request
      const response = await blogService.update(blogToUpdate.id, updatedBlog);
  
      // Ensure that the user object is preserved
      setBlogs(blogs.map(blog => 
        blog.id === response.id ? { ...response, user: blogToUpdate.user } : blog
      ));
    } catch (exception) {
      console.error('Failed to update likes:', exception);
    }
  };
  
  

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
          {blogs.map(blog => <Blog key={blog.id} blog={blog} handleLike={handleLike} />)}

          {/* Add the Togglable component to show/hide the form */}
          <Togglable buttonLabel="Create new blog">
            <BlogForm createBlog={handleAddBlog} />
          </Togglable>
        </div>
      )}
    </div>
  )
}

export default App