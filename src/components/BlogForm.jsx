import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const newBlog = { title: newTitle, author: newAuthor, url: newUrl }
    createBlog(newBlog)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            id="author"
            type="text"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            id="url"
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default BlogForm
