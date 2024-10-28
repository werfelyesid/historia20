import { db } from '../firebaseConfig';
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, addDoc } from 'firebase/firestore';

// Función para agregar un nuevo doctor a la base de datos
export const addDoctor = async (doctor) => {
  try {
    // Crea la referencia al documento del doctor dentro de la colección 'doctors'
    const doctorDocRef = doc(db, 'doctors', doctor.uid); 
    await setDoc(doctorDocRef, doctor);
    console.log('Doctor agregado exitosamente con ID: ', doctor.uid);

    localStorage.setItem('doctorId', doctor.uid);

    // Agregar un paciente inicial al doctor
    await addPatientToDoctor(doctor.uid, {
      patientUid: 'initialPatientUid', // UID inicial del paciente
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
export const addPatientToDoctor = async (doctorUid, pacienteData) => {
  try {
    const pacienteDocRef = doc(collection(db, `doctors/${doctorUid}/pacientes`));
    await setDoc(pacienteDocRef, pacienteData);

    // Crear colecciones adicionales para el nuevo paciente
    const colecciones = [
      'evoluciones',
      'diagnosticos',
      'tratamientos',
      'estadoDeCuentas',
      'hechoPorHacer',
      'informes',
      'presupuesto',
      'prescripciones',
      'consentimientos'
    ];

    for (const coleccion of colecciones) {
      const coleccionRef = doc(collection(pacienteDocRef, coleccion));
      await setDoc(coleccionRef, {});
    }

    console.log('Nuevo paciente y colecciones creadas exitosamente');
  } catch (error) {
    console.error('Error al agregar paciente al doctor: ', error.message);
  }
};

// Función para registrar una evolución de paciente
export const addEvolucion = async (doctorUid, patientUid, descripcion) => {
  const fecha = new Date().toISOString(); // Fecha actual en formato ISO

  if (!doctorUid || !patientUid) {
    console.error('doctorUid o patientUid no están definidos:', { doctorUid, patientUid });
    return;
  }

  try {
    // Referencia a la colección de evoluciones dentro del paciente
    const evolucionRef = collection(db, 'doctors', doctorUid, 'pacientes', patientUid, 'evoluciones'); 

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
    const q = query(collection(db, 'doctors'), where('email', '==', email)); 
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

// Función para obtener un doctor por su UID
export const getDoctorByUid = async (uid) => {
  try {
    if (!uid) {
      console.error('El UID del doctor no está definido');
      return null;
    }

    const doctorDoc = await getDoc(doc(db, 'doctors', uid));

    if (doctorDoc.exists()) {
      const doctorData = doctorDoc.data();
      const patientsCollection = collection(doctorDoc.ref, 'pacientes'); 
      const patientsSnapshot = await getDocs(patientsCollection);
      const patients = [];

      if (patientsSnapshot && patientsSnapshot.docs) {
        patientsSnapshot.forEach((doc) => {
          patients.push({ id: doc.id, ...doc.data() });
        });
      } else {
        console.log('No se encontraron pacientes para este doctor');
      }

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

// Función para obtener un paciente por su UID
export const getPatientByUid = async (doctorUid, patientUid) => {
  try {
    const patientDoc = await getDoc(doc(db, 'doctors', doctorUid, 'pacientes', patientUid));
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

// Nueva función para actualizar los datos de un paciente
export const updatePatientData = async (doctorUid, patientUid, updatedData) => {
  try {
    const patientDocRef = doc(db, 'doctors', doctorUid, 'pacientes', patientUid);
    await updateDoc(patientDocRef, updatedData);
    console.log('Datos del paciente actualizados exitosamente');
  } catch (error) {
    console.error('Error al actualizar los datos del paciente:', error.message);
  }
};

// Función para obtener las evoluciones de un paciente
export const getEvoluciones = async (doctorUid, patientUid) => {
  if (!doctorUid || !patientUid) {
    console.error('doctorUid o patientUid no están definidos:', { doctorUid, patientUid });
    return [];
  }

  try {
    const evolucionesCollection = collection(db, 'doctors', doctorUid, 'pacientes', patientUid, 'evoluciones');
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
// Función para obtener los tratamientos de "Hecho por Hacer"
export const fetchHechoPorHacer = async (doctorUid, patientUid) => {
  try {
    const hechoPorHacerCollection = collection(db, 'doctors', doctorUid, 'pacientes', patientUid, 'hechoPorHacer');
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
// Función para obtener la lista de pacientes de un doctor
export const getPatientsByDoctorUid = async (doctorUid) => {
  try {
    const pacientesCollection = collection(db, `doctors/${doctorUid}/pacientes`);
    const pacientesSnapshot = await getDocs(pacientesCollection);
    
    const pacientes = pacientesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return pacientes;
  } catch (error) {
    console.error('Error al obtener la lista de pacientes:', error);
    return [];
  }
};
