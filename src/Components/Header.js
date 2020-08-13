import React, { useState, useEffect } from 'react';

const Header = (props) => {

  const [userName, getUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    getUsername('');
    props.handleUserName(userName);
  }

  const handleChange = (e) => {
    getUsername(e.target.value)
  }

  return (
    <header>
      <h1>Git Check</h1>
      <form onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="username">Enter your username</label>
        <input
          name="username"
          type="text"
          value={userName}
          placeholder='Enter your username'
          onChange={handleChange}
        />
      </form>
    </header>
  )
}

export default Header;
