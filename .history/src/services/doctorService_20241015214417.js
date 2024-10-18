import { db } from '../firebaseConfig';
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, addDoc } from 'firebase/firestore';


// Función para agregar un nuevo doctor a la base de datos
export const addDoctor = async (doctor) => {
  try {
    // Crea la referencia al documento del doctor dentro de la colección 'users'
    const doctorDocRef = doc(db, 'doctors', doctor.uid); 
    await setDoc(doctorDocRef, doctor);
    console.log('Doctor agregado exitosamente con ID: ', doctor.uid);

    localStorage.setItem('doctorId', doctor.uid);

// Agregar un paciente inicial al doctor
await addPatientToDoctor(doctor.uid, {
  primerNombre: 'Paciente',
  segundoNombre: 'Nuevo',
  primerApellido: 'Inicial',
  segundoApellido: 'Jackson',
  basicInfo: {
    edad: 0,
    direccion: ''
  },
  odontograma: {},
  hechoPorHacer: {},
  presupuesto: {},
  estadoDeCuentas: {},
  tratamientos: {},
  consentimientos: {},
  prescripcionMedica: {},
  agenda: {}
});

    return doctor.uid;
  } catch (error) {
    console.error('Error al agregar doctor: ', error.message);
    return null;
  }
};

// Función para agregar un paciente a un doctor
export const addPatientToDoctor = async (doctorId, patient) => {
  if (!doctorId) {
    console.error('El ID del doctor está vacío');
    return;
  }
  try {
    // Crea la referencia a la colección de pacientes dentro del doctor
    const patientsCollection = collection(doc(db, 'doctors', doctorId), 'pacientes');
    await addDoc(patientsCollection, {
      primerNombre: patient.primerNombre || 'Nombre',
      segundoNombre: patient.segundoNombre || '',
      primerApellido: patient.primerApellido || 'Apellido',
      segundoApellido: patient.segundoApellido || '',
      basicInfo: patient.basicInfo || { edad: 0, direccion: '' },
      odontograma: patient.odontograma || {},
      hechoPorHacer: patient.hechoPorHacer || {},
      presupuesto: patient.presupuesto || {},
      estadoDeCuentas: patient.estadoDeCuentas || {},
      tratamientos: patient.tratamientos || {},
      consentimientos: patient.consentimientos || {},
      prescripcionMedica: patient.prescripcionMedica || {},
      agenda: patient.agenda || {}
    });
    console.log('Paciente agregado exitosamente');
  } catch (error) {
    console.error('Error al agregar paciente: ', error.message);
  }
};

// Función para registrar una evolución de paciente
export const addEvolucion = async (doctorId, patientId, descripcion) => {
  const fecha = new Date().toISOString(); // Fecha actual en formato ISO

  if (!doctorId || !patientId) {
    console.error('doctorId o patientId no están definidos:', { doctorId, patientId });
    return;
  }

  try {
    // Referencia a la colección de evoluciones dentro del paciente
    const evolucionRef = collection(db, 'doctors', doctorId,  'pacientes', patientId, 'evoluciones'); 

    // Agregar un nuevo documento en la colección de evoluciones
    await addDoc(evolucionRef, {
      descripcion,
      fecha
    });

    console.log('Evolución registrada con éxito:', { descripcion, fecha });
  } catch (error) {
    console.error('Error al registrar la evolución:', error.message);
  }
};

// Función para obtener un doctor por su correo electrónico
export const getDoctorByEmail = async (email) => {
  try {
    // Crea la consulta para buscar el doctor por correo electrónico
    const q = query(collection(db, 'doctors'), where('doctors.email', '==', email)); 
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doctorDoc = querySnapshot.docs[0];
      return { id: doctorDoc.id, ...doctorDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error al obtener el doctor por email:', error.message);
    return null;
  }
};


// Función para obtener un doctor por su ID
export const getDoctorById = async (id) => {
  try {
    const doctorDoc = await getDoc(doc(db, 'doctors', id));

    if (doctorDoc.exists()) {
      const doctorData = doctorDoc.data();
      const patientsCollection = collection(doctorDoc.ref, 'pacientes'); 
      const patientsSnapshot = await getDocs(patientsCollection);
      const patients = [];
      patientsSnapshot.forEach((doc) => {
        patients.push({ id: doc.id, ...doc.data() });
      });
      return { id: doctorDoc.id, ...doctorData, patients };
    } else {
      console.log('No se encontró el documento del doctor');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener datos del doctor:', error.message);
    return null;
  }
};

// Función para obtener un paciente por su ID
export const getPatientById = async (doctorId, patientId) => {
  try {
    const patientDoc = await getDoc(doc(db, 'users', doctorId, 'doctors', doctorId, 'pacientes', patientId));
    if (patientDoc.exists()) {
      return { id: patientDoc.id, ...patientDoc.data() };
    } else {
      console.log('No se encontró el paciente');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener datos del paciente:', error.message);
    return null;
  }
};

// Función para obtener los pacientes de un doctor por su ID
export const getPatientsByDoctorId = async (doctorId) => {
  try {
    const patientsCollection = collection(doc(db, 'doctors', doctorId), 'pacientes');
    const patientsSnapshot = await getDocs(patientsCollection);
    const patients = [];
    patientsSnapshot.forEach((doc) => {
      patients.push({ id: doc.id, ...doc.data() });
    });
    return patients;
  } catch (error) {
    console.error('Error al obtener datos de los pacientes:', error.message);
    return [];
  }
};

// Nueva función para actualizar los datos de un paciente
export const updatePatientData = async (doctorId, patientId, updatedData) => {
  try {
    const patientDocRef = doc(db, 'doctors', doctorId, 'pacientes', patientId);
    await updateDoc(patientDocRef, updatedData);
    console.log('Datos del paciente actualizados exitosamente');
  } catch (error) {
    console.error('Error al actualizar los datos del paciente:', error.message);
  }
};

// Función para obtener las evoluciones de un paciente
export const getEvoluciones = async (doctorId, patientId) => {
  if (!doctorId || !patientId) {
    console.error('doctorId o patientId no están definidos:', { doctorId, patientId });
    return [];
  }

  try {
    const evolucionesCollection = collection(db, 'doctors', doctorId, 'pacientes', patientId, 'evoluciones');
    const evolucionSnapshot = await getDocs(evolucionesCollection);

    const evoluciones = evolucionSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return evoluciones;
  } catch (error) {
    console.error('Error al obtener las evoluciones:', error.message);
    return [];
  }
};
export const fetchHechoPorHacer = async (doctorId, patientId) => {
  try {
    const hechoPorHacerCollection = collection(db, 'doctors', doctorId, 'pacientes', patientId, 'hechoPorHacer');
    const hechoPorHacerSnapshot = await getDocs(hechoPorHacerCollection);
    
    const treatments = hechoPorHacerSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return treatments;
  } catch (error) {
    console.error('Error al obtener los tratamientos de Hecho por Hacer:', error);
    return [];
  }
};
