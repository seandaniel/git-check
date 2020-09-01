import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';
import firebase from './firebase';
import { Chart } from 'react-chartjs-2';
import { FaArrowLeft } from 'react-icons/fa';
import './index.scss';

// Components
import LandingPage from './Components/LandingPage';
import Bio from './Components/Bio';
import RepoCards from './Components/RepoCards';
import LoadingAnimation from './Components/LoadingAnimation';
import Error from './Components/Error';

const App = () => {

  const [userInfo, setUserInfo] = useState({});
  const [repoInfo, setRepoInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState(false);
  const [favourite, setFavourite] = useState('');
  const [favourites, setFavourites] = useState([]);
  // const [languageNames, setLanguageNames] = useState([]);
  // const [languageTotals, setLanguageTotals] = useState([]);
  // const [languageColors, setLanguageColors] = useState([])

  async function apiCall(value) {

    setFavourite(value);

    let response = [];

    try {
      response[0] = await axios.get(`https://api.github.com/users/${value}`);
      response[1] = await axios.get(`https://api.github.com/users/${value}/repos`);


      setUserInfo([response[0].data]);
      setRepoInfo(response[1].data);

      const repos = response[1].data;

      let languagesArray = [];

      repos.map((repo) => {
        return languagesArray.push(repo.language);
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

      // remove languages that are not specified
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


      const languageColors = ['rgba(75, 137, 208, 0.7)', 'rgba(134, 83, 196, 0.7)', 'rgba(203, 84, 182, 0.7)', 'rgba(203, 76, 76, 0.7)', 'rgba(45, 59, 143, 0.7)', 'rgba(227, 213, 50, 0.7)', 'rgba(46, 210, 150, 0.7)', 'rgba(140, 195, 212, 0.7)', 'rgba(207, 114, 46, 0.7)', 'rgba(137, 206, 48, 0.7)'];

      shuffle(languageColors);

      // const borderColors =
      languageColors.map((color) => {
        const alpha = /0.7/g
        color = color.replace(alpha, 1);
        return color;
      })

      const ctx = document.getElementById('top-languages');
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: languageNames,
          datasets: [
            {
              data: languageTotals,
              backgroundColor: languageColors,
              borderColor: languageColors,
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

  useEffect(() => {

    const dbRef = firebase.database().ref();

    dbRef.on('value', (response) => {

      const newState = [];

      const data = response.val();

      for (let key in data) {
        newState.push(data[key]);
      }


      setFavourites(newState);
    });


  }, []);


  const handleFavourite = () => {

    const dbRef = firebase.database().ref();

    dbRef.push(favourite);
  }

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
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
                      <button onClick={handleFavourite}>Star</button>
                      <Link onClick={() => setIsLoading(true)} className="back-button" to="/"><FaArrowLeft />Search again</Link>
                      <div className="bio-chart-container">
                        {
                          userInfo.map((user) => {
                            return (
                              <Bio
                                key={user.id}
                                avatar_url={user.avatar_url}
                                name={user.name}
                                html_url={user.html_url}
                                login={user.login}
                                location={user.location}
                                created_at={user.created_at}
                                public_repos={user.public_repos}
                                blog={user.blog}
                              />
                            )
                          })
                        }
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
                              <RepoCards
                                key={repo.id}
                                node_id={repo.node_id}
                                html_url={repo.html_url}
                                name={repo.name}
                                description={repo.description}
                                language={repo.language}
                                created_at={repo.created_at}
                              />
                            )
                          })
                        }
                      </div>
                    </section>
                  </main>
            }
          </Route>
          <Route exact path='/favourites'>
            <h2>Favourites!</h2>
            {
              favourites.map((favourite) => {
                return (
                  <p>{favourite}</p>
                )
              })
            }
          </Route>
        </div>
      </>
    </BrowserRouter>
  )
}

export default App;
