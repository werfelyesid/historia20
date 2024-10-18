// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Welcome from './Welcome';
import HistoriaClinica from './HistoriaClinica';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';

function Home() {
  return (
    <div>
      <h1>Bienvenido a Historia Clínica Odontológica</h1>
      <div>
        <Link to="/login">
          <button>Ingresar</button>
        </Link>
        <Link to="/register">
          <button>Añadir Doctor Nuevo</button>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
