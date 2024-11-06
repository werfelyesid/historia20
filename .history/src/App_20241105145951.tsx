import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Welcome from './Welcome';
import HistoriaClinica from './HistoriaClinica';
import Odontograma from './Odontograma'; // Importa el componente Odontograma
import { AuthProvider } from './AuthContext';
import Consentimiento from './Consentimiento';
import Prescripcion from './Prescripcion';
import PatientsList from './PatientsList';
import './App.css'; // Asegúrate de que los estilos estén importados

const Home: React.FC = () => {
  return (
    <div>
      <h1>Bienvenido a Historia Clínica Odontológica</h1>
      <div>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/historia-clinica/:doctorUid/" element={<HistoriaClinica />} />
            <Route path="/patients-list" element={<PatientsList />} />
            <Route path="/odontograma/:doctorUid/:patientUid" element={<Odontograma />} />
            <Route path="/consentimiento/:doctorUid/:patientUid/:activeTab" element={<Consentimiento />} />
            <Route path="/prescripcion/:doctorUid/:patientUid" element={<Prescripcion />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;