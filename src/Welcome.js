import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div className="Welcome" style={styles.container}>
      <h1 style={styles.heading}>Software de Historia Clínica Odontológica, MWM</h1>
      <p style={styles.paragraph}>Por favor, ingrese su email y contraseña para ingresar.</p>
      <Link to="/login">
        <button style={styles.button}>Iniciar Sesión</button>
      </Link>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f7f9fc',
    textAlign: 'center',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  paragraph: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '30px',
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  buttonHover: {
    backgroundColor: '#45a049',
    transform: 'translateY(-2px)',
  },
};

export default Welcome;
