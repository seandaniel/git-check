import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import './index.scss';

function App() {

  const [userName, getUsername] = useState('');

  const User = () => {
    getUsername('doug');
    return (
      <div>
        <p>Hello {userName}</p>
      </div>
    )
  }

  {/* redirect to /UserInfo, with the userName value being a param propped into UserInfo */ }
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <BrowserRouter>
      <div className="wrapper">
        <header>
          <h1>Git Check</h1>
          <Route exact path="/">
            <form onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="username">Enter your username</label>
              <input
                name="username"
                type="text"
                value={userName}
                onChange={e => getUsername(e.target.value)}
              />
            </form>
          </Route>
        </header>
        <Route exact path="/user" component={User} />
      </div>
    </BrowserRouter>
  )
}

export default App;
