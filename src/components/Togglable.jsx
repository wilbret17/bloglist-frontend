import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

// Use React.forwardRef so we can pass a ref to the component if needed
const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // Example rendering:
  return (
    <div>
      <button onClick={toggleVisibility}>
        {props.buttonLabel}
      </button>
      {visible && <div>{props.children}</div>}
    </div>
  )
})

// Set a display name for easier debugging
Togglable.displayName = 'Togglable'

// Define PropTypes to enforce the type and requirement of props
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default Togglable
