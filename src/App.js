import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import firebase from './firebase';
import axios from 'axios';
import { Chart } from 'react-chartjs-2';

// icons
import { FaArrowLeft, FaStar, FaSadTear } from 'react-icons/fa';
import { DiGithubBadge } from 'react-icons/di';

// components
import LandingPage from './Components/LandingPage';
import Bio from './Components/Bio';
import RepoCards from './Components/RepoCards';
import LoadingAnimation from './Components/LoadingAnimation';
import Error from './Components/Error';

const App = () => {

  // GitHub APIS
  const [userInfo, setUserInfo] = useState({});
  const [repoInfo, setRepoInfo] = useState([]);

  const [isLoading, toggleIsLoading] = useState(true);
  const [results, toggleResults] = useState(false);

  // Firebase
  const [favorites, setFavorites] = useState({
    userName: '',
    img: '',
    location: '',
  })

  const [nameFavoritesArray, setNameFavoritesArray] = useState([]);
  const [totalFavorites, setTotalFavorites] = useState([]);
  const [noLanguages, toggleNoLanguages] = useState(false);

  const [buttonDisable, toggleButtonDisabled] = useState(false);

  async function apiCall(value) {

    let response = [];

    try {

      if (!isLoading) {
        toggleIsLoading(true);
      }

      response[0] = await axios.get(`https://api.github.com/users/${value}`);
      response[1] = await axios.get(`https://api.github.com/users/${value}/repos`);

      setUserInfo([response[0].data]);
      setRepoInfo(response[1].data);

      // if location is null, set it to Planet Earth
      if (response[0].data.location !== null) {
        setFavorites({
          userName: value.toLowerCase(),
          img: response[0].data.avatar_url,
          location: response[0].data.location,
        })
      } else {
        setFavorites({
          userName: value.toLowerCase(),
          img: response[0].data.avatar_url,
          location: 'Planet Earth',
        })
      }

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

      toggleIsLoading(false);
      toggleResults(true);
      toggleNoLanguages(false);
      toggleButtonDisabled(false);

      // fisher-yates shuffle
      const shuffle = (array) => {
        for (let j, x, i = array.length; i; j = parseInt(Math.random() * i),
          x = array[--i], array[i] = array[j], array[j] = x);
        return array;
      };

      const languageColors = [
        'rgba(75, 137, 208, 0.7)',
        'rgba(134, 83, 196, 0.7)',
        'rgba(203, 84, 182, 0.7)',
        'rgba(203, 76, 76, 0.7)',
        'rgba(45, 59, 143, 0.7)',
        'rgba(227, 213, 50, 0.7)',
        'rgba(46, 210, 150, 0.7)',
        'rgba(140, 195, 212, 0.7)',
        'rgba(207, 114, 46, 0.7)',
        'rgba(137, 206, 48, 0.7)',
        'rgba(250, 193, 124, 0.7)',
        'rgba(76, 160, 77, 0.7)',
        'rgba(255, 151, 151, 0.7)',
        'rgba(166, 31, 31, 0.7)',
        'rgba(8, 14, 90, 0.7)',
      ];

      shuffle(languageColors);

      // add .3 opacity to each languageColor for their individual border
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

      // if there is no languages, don't show chart
      if (languageNames.length === 0) {
        toggleNoLanguages(true);
      }

      // if the user is already favorited, disable the button
      if (nameFavoritesArray.includes(value.toLowerCase())) {
        toggleButtonDisabled(true);
      }

    } catch (err) {
      toggleIsLoading(false);
      toggleResults(false);
    }
  }

  useEffect(() => {

    const dbRef = firebase.database().ref();

    dbRef.on('value', (response) => {

      const newState = [];
      const data = response.val();

      // pushing the key for the index and userObj for user information into the newState array
      for (let key in data) {
        newState.push({
          key: key,
          userObj: data[key],
        });
      }

      setTotalFavorites(newState);

      let userNameArray = [];

      // pushing all favorite usernames into an array
      newState.map((userName) => {

        userNameArray.push(userName.userObj.name);
        return setNameFavoritesArray(userNameArray);

      })

    });

  }, []);


  const handleFavorite = () => {

    // no duplicate favorites
    if (nameFavoritesArray.includes(favorites.userName) === false) {

      const user = {
        name: favorites.userName.toLowerCase(),
        profilePicture: favorites.img,
        location: favorites.location,
      }

      const dbRef = firebase.database().ref();
      dbRef.push(user);

    } else {
      return null;
    }

  }

  const favoriteApiCall = (e) => {
    // target the closest child (h3), grab the text content and remove the first character (@)
    const userName = e.target.closest('.user-card').firstChild.textContent.slice(1);
    // second api call instead of storing all favorite user info into firebase, this way, you will get up-to-date stats
    apiCall(userName);
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
                  <>
                    <nav>
                      <Link to="/" className="button"><FaArrowLeft />Search</Link>
                    </nav>
                    <LoadingAnimation />
                  </>
                )
                : !results
                  ? (
                    <>
                      <nav>
                        <Link to="/" className="button"><FaArrowLeft />Search</Link>
                      </nav>
                      <Error />
                    </>
                  )
                  : <main>
                    <section>
                      <nav>
                        <ul className="favorite-back-container">
                          {
                            !buttonDisable
                              ? <li><button className="button" onClick={handleFavorite} aria-label="Favorite this user" title="Favorite this user"><FaStar /></button></li>
                              : <li><button className="button disabled" disabled="true" onClick={handleFavorite} aria-label="Favorite this user" title="Favorite this user"><FaStar /></button></li>
                          }
                          <li><Link to="/" className="button"><FaArrowLeft />Search</Link></li>
                        </ul>
                      </nav>
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
                          {
                            !noLanguages
                              ? <canvas id="top-languages" height="350" width="410" />
                              : <div className="icon-p-container">
                                <FaSadTear />
                                <p>Nothing to see here!</p>
                              </div>
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
          <Route exact path='/favorites'>
            <nav>
              <Link to="/" className="button"><FaArrowLeft />Search</Link>
            </nav>
            <section className="user-card-container">
              {
                totalFavorites.map((user) => {
                  return (
                    <div key={user.key} className="user-card">
                      <ul className="img-h4-container">
                        <li><img src={user.userObj.profilePicture} alt={user.userObj.name} /></li>
                        <li><h4>@{user.userObj.name}</h4></li>
                      </ul>
                      <ul className="date-link-container">
                        <li><p>{user.userObj.location}</p></li>
                        <li><Link onClick={favoriteApiCall} to="/user" aria-label="View user stats" title="View user stats"><DiGithubBadge /></Link></li>
                      </ul>
                    </div>
                  )
                })
              }
            </section>
          </Route>
        </div>
      </>
    </BrowserRouter>
  )
}

export default App;
