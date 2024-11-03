import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { addDoctor } from './services/doctorService';
import { doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [celular, setCelular] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [registroProfesional, setRegistroProfesional] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [message, setMessage] = useState('');
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(''); // Limpia el mensaje antes de intentar registrar

    if (!validateEmail(email)) {
      setMessage('Por favor, ingrese un email válido.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const doctorUid = user.uid;

      // Crea el objeto doctor
      const doctor = {
        uid: doctorUid,
        name: doctorName,
        email,
        celular, // Agrega el número de celular
        especialidad, // Agrega la especialidad
        registroProfesional, // Agrega el registro profesional
        ciudad, // Agrega la ciudad
        role: 'doctor'
      };

      // Guarda el perfil completo en la colección 'doctors'
      await setDoc(doc(db, 'doctors', doctorUid), doctor);

      // Llama a la función para agregar el doctor y el paciente inicial (si es necesario)
      await addDoctor(doctor);

      setMessage('Registro exitoso');
      navigate(`/historia-clinica/${doctorUid}`); // Navega usando el UID del doctor
    } catch (error) {
      console.error('Error durante el registro:', error.message);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="Register">
      <h1>Registro de Doctor Nuevo</h1>
      {message && <div className="error-message">{message}</div>}
      <form onSubmit={handleRegister}>
        <div>
          <label>
            Nombre:
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
            />
          </label>
        </div>
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
        <div>
          <label>
            Confirmar Contraseña:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Celular:
            <input
              type="text"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Especialidad:
            <input
              type="text"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Registro Profesional:
            <input
              type="text"
              value={registroProfesional}
              onChange={(e) => setRegistroProfesional(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Ciudad:
            <input
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;