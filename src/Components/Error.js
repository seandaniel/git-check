import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa'

function App() {
  return (
    <div className="error-container">
      <FaExclamationTriangle />
      <h1>That must not be a real GitHub user!</h1>
    </div>
  )
}

export default App;
