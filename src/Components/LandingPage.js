import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { DiGithubBadge } from 'react-icons/di';

const LandingPage = (props) => {

  const [userName, getUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    props.apiCall(userName);
    props.history.push('/user');
    getUsername('');
  }

  const handleChange = (e) => {
    getUsername(e.target.value)
  }

  return (
    <header>
      <div className="icon-h1-container">
        <DiGithubBadge />
        <h1>Git Check</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="username">Enter GitHub username</label>
        <input
          name="username"
          type="text"
          value={userName}
          placeholder='Enter GitHub username'
          onChange={handleChange}
        />
      </form>
    </header>
  )
}

export default withRouter(LandingPage);
