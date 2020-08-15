import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import './index.scss';

// Components
import LandingPage from './Components/LandingPage';

const App = () => {

  const [userInfo, getUserInfo] = useState({});

  const apiCall = ((value) => {
    axios({
      method: 'get',
      url: `https://api.github.com/users/${value}`
    }).then((response) => {
      getUserInfo(response.data);
    });
  });

  return (
    <BrowserRouter>
      <>
        <div className="wrapper">
          <Route exact path="/" component={() => <LandingPage apiCall={apiCall} />} />
          <Route exact path="/user">
            <main>
              <section>
                <Link className="back-button" to="/"><FaArrowLeft />Search again</Link>
                <div className="user-container">
                  <img src={userInfo.avatar_url} alt={userInfo.name} />
                  <h2>{userInfo.name}</h2>
                  <a href={userInfo.html_url}>@{userInfo.login}</a>
                  <div className="location-joined-container">
                    <p><FaMapMarkerAlt />{userInfo.location}</p>
                    <p><FaCalendarAlt />Member since: {userInfo.created_at}</p>
                  </div>
                  <p>{userInfo.blog}</p>
                  <p>Repos: {userInfo.public_repos}</p>
                </div>
              </section>
            </main>
          </Route>
        </div>
      </>
    </BrowserRouter>
  )
}

export default App;
