import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Validación para asegurarse de que todas las variables de entorno están presentes
const checkFirebaseConfig = () => {
  const requiredEnvVars = [
    'REACT_APP_API_KEY',
    'REACT_APP_AUTH_DOMAIN',
    'REACT_APP_PROJECT_ID',
    'REACT_APP_STORAGE_BUCKET',
    'REACT_APP_MESSAGING_SENDER_ID',
    'REACT_APP_APP_ID',
    'REACT_APP_MEASUREMENT_ID',
  ];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.error(`Error: La variable de entorno ${envVar} no está definida.`);
    }
  });
};

// Llama a la función de validación para revisar las variables de entorno
checkFirebaseConfig();

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Inicializar Firebase solo si todas las variables están definidas
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
