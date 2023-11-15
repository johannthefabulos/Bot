import ReactDOM from "react-dom/client";
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Land from './components/Land.js';
import Lands from './components/Lands.js';
import Character from './components/Character.js';
import Characters from './components/Characters.js';
import NewCharacter from './components/NewCharacter.js';
import NewLand from './components/NewLand.js';
import UpdateLand from './components/UpdateLand.js';
import UpdateCharacter from './components/UpdateCharacter.js';
import Times from './components/Times.js'
import Test from './components/Test.js'
export default function App() {
    
  return(
      
      <Router>
              <Routes>
                  <Route path="/" element={<Times />} />
              </Routes>
      </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);