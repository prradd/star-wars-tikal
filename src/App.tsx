import React from 'react';
import './css/App.css';
import './css/stars.css';
import Tables from "./components/Table";

function App() {
  return (
    <div className="star-wars">
        <div className="background">
            <div id='stars'></div>
            <div id='stars2'></div>
            <div id='stars3'></div>
        </div>
        <div>
            <Tables />
        </div>
    </div>
  );
}

export default App;
