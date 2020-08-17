import React, { useState } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import Moment from 'react-moment';
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import './index.scss';


// Components
import LandingPage from './Components/LandingPage';

const App = () => {

  const [userInfo, setUserInfo] = useState({});
  const [repoInfo, setRepoInfo] = useState([]);
  const [languageNames, setLanguageNames] = useState([]);
  const [totalLanguages, setTotalLanguages] = useState([]);

  const apiCall = ((value) => {
    axios({
      method: 'get',
      url: `https://api.github.com/users/${value}`
    }).then((response) => {
      setUserInfo(response.data);
    });
    axios({
      method: 'get',
      url: `https://api.github.com/users/${value}/repos`
    }).then((response) => {
      setRepoInfo(response.data);

      const repos = response.data;

      let languagesArray = [];

      repos.map((repo) => {
        languagesArray.push(repo.language);
      })

      const languagesObject = languagesArray.reduce((obj, repo) => {
        if (!obj[repo]) {
          obj[repo] = 0;
        }
        obj[repo]++;
        return obj;
      }, {})

      let languageNames = Object.keys(languagesObject);

      let totalLanguages = Object.values(languagesObject);

      setLanguageNames(languageNames);
      setTotalLanguages(totalLanguages);

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
                      <p className="repos"><span>{userInfo.public_repos}</span><span>Repos</span></p>
                    </div>
                    <a href={userInfo.blog}>{userInfo.blog}</a>
                  </div>
                  <div className="pie-container">
                    <Pie
                      data={{
                        labels: languageNames,
                        datasets: [
                          {
                            label: 'Global Status',
                            backgroundColor: ['#a6d4fa90', '#81c78490', '#e5737390'],
                            data: totalLanguages,
                          },
                        ],
                      }}
                      options={{
                        legend: {
                          position: 'bottom'
                        },
                      }}
                    />
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
