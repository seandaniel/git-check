import React, { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';

// icons
import { DiGithubBadge } from 'react-icons/di';
import { FaStar } from 'react-icons/fa'

//Components
import Footer from './Footer';

const LandingPage = (props) => {

  const [userName, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    props.apiCall(userName);
    // props.history is identically to using a redirect, depending on a certain state in the return
    props.history.push('/user');
    setUsername('');
  }

  const handleChange = (e) => {
    setUsername(e.target.value)
  }

  return (
    <>
      <header>
        <nav>
          <Link to="/favorites" className="button"><FaStar />Favorites</Link>
        </nav>
        <div className="h1-form-container">
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
              placeholder="Enter GitHub username"
              aria-label="Enter GitHub username"
              onChange={handleChange}
            />
          </form>
        </div>
      </header>
      <Footer />
    </>
  )
}

export default withRouter(LandingPage);
