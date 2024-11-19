
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Weather from './Weather';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Weather />} />
      </Routes>
    </Router>
  );
};

export default App;
