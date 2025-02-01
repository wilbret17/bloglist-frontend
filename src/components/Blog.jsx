import { useState } from 'react';

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };
  
  const incrementLike = () => {
    handleLike(blog);
  };

  const deleteBlog = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${blog.title}?`);
    if (confirmDelete) {
      handleDelete(blog.id); // Call handleDelete function
    }
  };

  console.log('User:', user); // This will log the current logged-in user
  console.log('Blog User:', blog.user); // This will log the user object of the blog

  return (
    <div style={{ paddingTop: 10, paddingLeft: 2, border: 'solid', borderWidth: 1, marginBottom: 5 }}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {detailsVisible ? 'Hide details' : 'View details'}
        </button>
      </div>
      {detailsVisible && (
        <div>
          <p>{blog.url}</p>
          <p>{blog.likes} likes</p>
          <button onClick={incrementLike}>like</button>
          {blog.user && <p>{blog.user.name}</p>} {/* Display user name */}

          {/* Only show the delete button if the user is the blog author */}
          {user && blog.user && blog.user.id === user.id && (
            <button onClick={deleteBlog}>Delete</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
