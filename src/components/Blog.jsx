import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const incrementLike = () => {
    handleLike(blog)
  }

  const deleteBlog = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${blog.title}?`)
    if (confirmDelete) {
      handleDelete(blog.id)
    }
  }

  return (
    <div className="blog" style={{ paddingTop: 10, paddingLeft: 2, border: 'solid', borderWidth: 1, marginBottom: 5 }}>
      <div className="blog-summary">
        {blog.title} {blog.author}
        <button onClick={toggleDetails} className="toggle-details-btn">
          {detailsVisible ? 'Hide details' : 'View details'}
        </button>
      </div>
      {detailsVisible && (
        <div className="blog-details">
          <p className="blog-url">{blog.url}</p>
          <p className="blog-likes">{blog.likes} likes</p>
          <button onClick={incrementLike} className="like-btn">like</button>
          {blog.user && <p className="blog-user">{blog.user.name}</p>}

          {user && blog.user && blog.user.id === user.id && (
            <button onClick={deleteBlog} className="delete-btn">Delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog