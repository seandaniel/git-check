import React, { useState } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { Chart } from 'react-chartjs-2';
import Moment from 'react-moment';
import { FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import './index.scss';


// Components
import LandingPage from './Components/LandingPage';
import LoadingAnimation from './Components/LoadingAnimation';
import Error from './Components/Error';

const App = () => {

  const [userInfo, setUserInfo] = useState({});
  const [repoInfo, setRepoInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState(false)
  // const [languageNames, setLanguageNames] = useState([]);
  // const [languageTotals, setLanguageTotals] = useState([]);
  // const [languageColors, setLanguageColors] = useState([])

  async function apiCall(value) {

    let response = [];

    try {
      response[0] = await axios.get(`https://api.github.com/users/${value}`);
      response[1] = await axios.get(`https://api.github.com/users/${value}/repos`);

      setUserInfo(response[0].data);
      setRepoInfo(response[1].data);

      const repos = response[1].data;

      let languagesArray = [];

      repos.map((repo) => {
        languagesArray.push(repo.language);
      })

      const languagesObject = languagesArray.reduce((obj, repo) => {
        // if we do not have that property, add it with the value of 0
        if (!obj[repo]) {
          obj[repo] = 0;
        }
        // if we do have that property, add one to the value
        obj[repo]++;
        return obj;
      }, {})

      delete languagesObject.null;

      let languageNames = Object.keys(languagesObject);
      let languageTotals = Object.values(languagesObject);

      // setLanguageNames(languageNames);
      // setLanguageTotals(languageTotals);

      setIsLoading(false);
      setResults(true);

      const shuffle = (array) => {
        for (let j, x, i = array.length; i; j = parseInt(Math.random() * i),
          x = array[--i], array[i] = array[j], array[j] = x);
        return array;
      };

      let languageColors = ['#4b89d0', '#8653c4', '#cb54b6', '#cb4c4c', '#2d3b8f', '#e3d532', '#2ed296', '#8cc3d4', '#cf722e', '#89ce30'];

      shuffle(languageColors);

      const ctx = document.getElementById('top-languages');
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: languageNames,
          datasets: [
            {
              data: languageTotals,
              backgroundColor: languageColors,
            },
          ],
        },
        options: {
          legend: {
            position: 'right',
          },
        }
      });

    } catch (err) {
      setIsLoading(false);
      setResults(false);
    }

  }

  return (
    <BrowserRouter>
      <>
        <div className="wrapper">
          <Route exact path="/" component={() => <LandingPage apiCall={apiCall} />} />
          <Route exact path="/user">
            {
              isLoading
                ? (
                  <div>
                    <Link onClick={() => setIsLoading(true)} className="back-button" to="/"><FaArrowLeft />Search again</Link>
                    <LoadingAnimation />
                  </div>
                )
                : !results
                  ? (
                    <div>
                      <Link onClick={() => setIsLoading(true)} className="back-button" to="/"><FaArrowLeft />Search again</Link>
                      <Error />
                    </div>
                  )
                  : <main>
                    <section>
                      <Link onClick={() => setIsLoading(true)} className="back-button" to="/"><FaArrowLeft />Search again</Link>
                      <div className="bio-chart-container">
                        <div className="bio-container">
                          <img src={userInfo.avatar_url} alt={userInfo.name} />
                          {
                            userInfo.name
                              ? <h2>{userInfo.name}</h2>
                              : null
                          }
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
                            {
                              userInfo.public_repos === 1
                                ? <p className="repos"><span>{userInfo.public_repos}</span><span>Repo</span></p>
                                : <p className="repos"><span>{userInfo.public_repos}</span><span>Repos</span></p>
                            }
                          </div>
                          {
                            !userInfo.blog.includes('http')
                              ? <a href={`https:${userInfo.blog}`}>{userInfo.blog}</a>
                              : userInfo.blog.includes('https://')
                                ? <a href={`${userInfo.blog}`}>{userInfo.blog.slice(8)}</a>
                                : <a href={`${userInfo.blog}`}>{userInfo.blog.slice(7)}</a>
                          }
                        </div>
                        <div className="chart-container">
                          <h3>Top Languages</h3>
                          <canvas id="top-languages" height="350" width="410" />
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
            }
          </Route>
        </div>
      </>
    </BrowserRouter >
  )
}

export default App;
