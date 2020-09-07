import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa'

const Error = () => {
  return (
    <div className="error-container">
      <FaExclamationTriangle />
      <h3>That must not be a real GitHub user!</h3>
    </div>
  )
}

export default Error;
