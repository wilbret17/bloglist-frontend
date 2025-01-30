import { useState } from 'react';

const Blog = ({ blog, handleLike }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };
  
  const incrementLike = () => {
    handleLike({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user // Handle both populated and unpopulated user
    })
  }

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
        </div>
      )}
    </div>
  );
};

export default Blog;