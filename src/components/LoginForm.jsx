import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null) // This handles login errors

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await handleLogin({ username, password })
      setError(null) // Clear any previous errors if login is successful
    } catch (exception) {
      setError('Invalid username or password') // Show error if login fails
    }
  }

  const handleUsernameChange = ({ target }) => {
    setUsername(target.value)
    if (error) setError(null) // Clear error when user starts typing
  }

  const handlePasswordChange = ({ target }) => {
    setPassword(target.value)
    if (error) setError(null) // Clear error when user starts typing
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm
