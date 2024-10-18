// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Welcome from './Welcome';
import HistoriaClinica from './HistoriaClinica';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';
import './App.css'; // Asegúrate de que los estilos estén importados

function App() {
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


export default App;