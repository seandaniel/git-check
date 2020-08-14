import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.scss';

// Components
import Header from './Components/Header';

const App = () => {

  const [userInfo, getUserInfo] = useState([]);

  const apiCall = ((value) => {
    axios({
      method: 'get',
      url: `https://api.github.com/users/${value}`
    }).then((data) => {
      getUserInfo(data);
      console.log(userInfo);
    });
  });

  return (
    <>
      <div className="wrapper">
        <Header apiCall={apiCall} />
        <main>
          <section>
            <div>
              <p>{userInfo.status}</p>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default App;
