import { useState } from 'react'

const Togglable = ({ buttonLabel, cancelButtonLabel, children }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      {!visible ? (
        <button onClick={toggleVisibility}>
          {buttonLabel}
        </button>
      ) : (
        <div>
          {children}
          <button onClick={toggleVisibility}>
            {cancelButtonLabel}
          </button>
        </div>
      )}
    </div>
  )
}

export default Togglable
