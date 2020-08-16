import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import './index.scss';


// Components
import LandingPage from './Components/LandingPage';

const App = () => {

  const [userInfo, getUserInfo] = useState({});
  const [repoInfo, getRepoInfo] = useState([]);


  const apiCall = ((value) => {
    axios({
      method: 'get',
      url: `https://api.github.com/users/${value}`
    }).then((response) => {
      getUserInfo(response.data);
    });
    axios({
      method: 'get',
      url: `https://api.github.com/users/${value}/repos`
    }).then((response) => {
      getRepoInfo(response.data);
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
                <div className="bio-chart-container">
                  <div className="bio-container">
                    <img src={userInfo.avatar_url} alt={userInfo.name} />
                    <h2>{userInfo.name}</h2>
                    <a href={userInfo.html_url}>@{userInfo.login}</a>
                    <div className="location-joined-repo-container">
                      <div className="location-joined-container">
                        {
                          !userInfo.location
                            ? <p><FaMapMarkerAlt /> Planet Earth</p>
                            : <p><FaMapMarkerAlt /> {userInfo.location}</p>
                        }

                        <p><FaCalendarAlt /> Joined <Moment format="MMMM DD, YYYY">{userInfo.created_at}</Moment></p>
                      </div>
                      <p class="repos"><span>{userInfo.public_repos}</span><span>Repos</span></p>
                    </div>
                    <a href={userInfo.blog}>{userInfo.blog}</a>
                  </div>
                  <div className="chart">
                    {
                      repoInfo.map((repo) => {
                        return (
                          <p>{repo.language}</p>
                        )
                      })
                    }
                  </div>
                </div>
              </section>
              <section>
                <h3>Repositories</h3>
                <div className="repo-container">
                  {
                    repoInfo.map((repo) => {
                      return (
                        <div className="repo-card" key={repo.node_id}>
                          <a href={repo.html_url}>{repo.name}</a>
                          <p className="description">{repo.description}</p>
                          <div className="language-date-container">
                            <p>{repo.language}</p>
                            <p><Moment format="MMMM DD, YYYY">{repo.created_at}</Moment></p>
                          </div>
                        </div>
                      )
                    })
                  }
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
