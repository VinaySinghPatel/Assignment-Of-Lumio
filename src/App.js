import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmailGenerator from './components/EmailGenerator';
import EmailEditor from './components/EmailEditor';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EmailGenerator />} />
          <Route path="/editor" element={<EmailEditor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
