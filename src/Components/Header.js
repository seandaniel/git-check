import React, { useState, useEffect } from 'react';

const Header = (props) => {

  const [userName, getUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    getUsername('');
    props.apiCall(userName);
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

export default Header;
