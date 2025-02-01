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
      // Check if the ID is missing and manually add it if needed
      if (!user.id) {
        user.id = 'some-default-id'; // This is a fallback or a way to fetch it
      }
      setUser(user)  // Store the user object with id
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
      console.log(response.data);
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
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1, 
        user: blogToUpdate.user ? blogToUpdate.user.id : blogToUpdate.user
      };

      const response = await blogService.update(blogToUpdate.id, updatedBlog);
      setBlogs(blogs.map(blog => 
        blog.id === response.id ? { ...response, user: blogToUpdate.user } : blog
      ));
    } catch (exception) {
      console.error('Failed to update likes:', exception);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter(blog => blog.id !== id));
      setNotification('Blog deleted successfully');
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setNotification('Failed to delete blog');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  console.log('Current User ID:', user?.id); // Check if user is loaded and ID is correct


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
          {sortedBlogs.map(blog => (
            <Blog 
              key={blog.id} 
              blog={blog} 
              handleLike={handleLike} 
              handleDelete={handleDelete} 
              user={user} 
            />
          ))}

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
