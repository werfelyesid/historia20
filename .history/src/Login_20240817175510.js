import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Variable para el mensaje de error
  const navigate = useNavigate();

  // Función para validar el formato del email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar la longitud de la contraseña
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Limpia el mensaje de error antes de intentar iniciar sesión

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, ingrese un email válido.');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const doctorId = user.uid;

      console.log(`Doctor, UID: ${doctorId}`);

      // Busca el doctor en la colección 'doctors' por el UID de autenticación
      const doctorDocRef = doc(db, 'doctors', doctorId);
      const doctorDoc = await getDoc(doctorDocRef);

      if (doctorDoc.exists()) {
        console.log('Doctor data:', doctorDoc.data());

        // Verifica si la colección "pacientes" existe
        const patientsCollectionRef = collection(doctorDocRef, 'pacientes');
        const patientsSnapshot = await getDocs(patientsCollectionRef);
        if (patientsSnapshot.empty) {
          // Si no existe, crea la colección
          await addDoc(patientsCollectionRef, {}); 
        }

        navigate(`/historia-clinica/${doctorId}`);
      } else {
        console.log('No se encontraron datos del doctor.');
        setErrorMessage('No se encontraron datos del doctor. Por favor, regístrese.');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error.message);
      setErrorMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="Login">
      <h1>Por favor, ingrese su email y contraseña para continuar</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>} 
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Contraseña:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;