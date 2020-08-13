import React, { useState, useEffect } from 'react';
import './index.scss';

// Components
import Header from './Components/Header';

const App = () => {


  const handleUserName = value => {
    console.log(value);
  }

  return (
    <>
      <div className="wrapper">
        <Header handleUserName={handleUserName} />
      </div>
    </>
  )
}

export default App;
