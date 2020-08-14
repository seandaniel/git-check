import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

const LandingPage = (props) => {

  const [userName, getUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    getUsername('');
    props.apiCall(userName);
    props.history.push('/user');
  }

  const handleChange = (e) => {
    getUsername(e.target.value)
  }

  return (
    <header>
      <h1>Git Check</h1>
      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="username">Enter a GitHub username</label>
        <input
          name="username"
          type="text"
          value={userName}
          placeholder='Enter a GitHub username'
          onChange={handleChange}
        />
      </form>
    </header>
  )
}

export default withRouter(LandingPage);
