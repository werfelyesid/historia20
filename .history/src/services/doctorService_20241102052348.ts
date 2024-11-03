import { db } from '../firebaseConfig';
import { collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, addDoc } from 'firebase/firestore';

// Definir la interfaz para el doctor
interface Doctor {
  uid: string;
  name: string;
  email: string;
  celular: string;
  especialidad: string;
  registroProfesional: string;
  ciudad: string;
  role: string;
}

// Definir la interfaz para el paciente
interface Patient {
  id: string;
  primerNombre: string;
  primerApellido: string;
  identificacion: string;
  celular: string;
  motivoConsulta: string;
  // Agrega otros campos necesarios aquí
}

// Definir la interfaz para la evolución
interface Evolucion {
  id: string;
  descripcion: string;
  fechaHora: string;
  // Agrega otros campos necesarios aquí
}

// Función para agregar un nuevo doctor a la base de datos
export const addDoctor = async (doctor: Doctor) => {
  try {
    const doctorDocRef = doc(db, 'doctors', doctor.uid); 
    await setDoc(doctorDocRef, doctor);
    console.log('Doctor agregado exitosamente con ID: ', doctor.uid);

    localStorage.setItem('doctorId', doctor.uid);

    const patientsCollectionRef = collection(db, `doctors/${doctor.uid}/patients`);
    await setDoc(doc(patientsCollectionRef), {}); // Crea un documento vacío para inicializar la colección

    await addPatientToDoctor(doctor.uid, {
      id: '',
      primerNombre: 'Michael',
      segundoNombre: 'John',	
      primerApellido: 'Jackson',
      segundoApellido: 'Ramirez',
      identificacion: '',
      celular: '',
      motivoConsulta: '',
      // Agrega otros campos necesarios aquí
    });

    return doctor.uid;
  } catch (error) {
    console.error('Error al agregar doctor: ', error.message);
    return null;
  }
};

// Función para agregar un paciente a un doctor
export const addPatientToDoctor = async (doctorUid: string, patient: Omit<Patient, 'id'>) => {
  try {
    const patientsCollectionRef = collection(db, `doctors/${doctorUid}/patients`);
    await addDoc(patientsCollectionRef, patient);
    console.log('Paciente agregado exitosamente al doctor con ID:', doctorUid);
  } catch (error) {
    console.error('Error al agregar el paciente:', error);
  }
};

// Función para registrar una evolución de paciente
export const addEvolucion = async (doctorUid: string, patientUid: string, descripcion: string) => {
  const fecha = new Date().toISOString(); // Fecha actual en formato ISO

  if (!doctorUid || !patientUid) {
    console.error('doctorUid o patientUid no están definidos:', { doctorUid, patientUid });
    return;
  }

  try {
    const evolucionRef = collection(db, 'doctors', doctorUid, 'patients', patientUid, 'evoluciones'); 

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
export const getDoctorByEmail = async (email: string) => {
  try {
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
export const getDoctorByUid = async (uid: string) => {
  try {
    if (!uid) {
      console.error('El UID del doctor no está definido');
      return null;
    }

    const doctorDoc = await getDoc(doc(db, 'doctors', uid));

    if (doctorDoc.exists()) {
      const doctorData = doctorDoc.data();
      const patientsCollection = collection(doctorDoc.ref, 'patients'); 
      const patientsSnapshot = await getDocs(patientsCollection);
      const patients: Patient[] = [];

      if (patientsSnapshot && patientsSnapshot.docs) {
        patientsSnapshot.forEach((doc) => {
          patients.push({ id: doc.id, ...doc.data() } as Patient);
        });
      } else {
        console.log('No se encontraron patients para este doctor');
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
export const getPatientByUid = async (doctorUid: string, patientUid: string) => {
  try {
    const patientDoc = await getDoc(doc(db, 'doctors', doctorUid, 'patients', patientUid));
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
export const updatePatientData = async (doctorUid: string, patientUid: string, updatedData: Partial<Patient>) => {
  try {
    const patientDocRef = doc(db, 'doctors', doctorUid, 'patients', patientUid);
    await updateDoc(patientDocRef, updatedData);
    console.log('Datos del paciente actualizados exitosamente');
  } catch (error) {
    console.error('Error al actualizar los datos del paciente:', error.message);
  }
};

// Función para obtener las evoluciones de un paciente
export const getEvoluciones = async (doctorUid: string, patientUid: string): Promise<Evolucion[]> => {
  if (!doctorUid || !patientUid) {
    console.error('doctorUid o patientUid no están definidos:', { doctorUid, patientUid });
    return [];
  }

  try {
    const evolucionesCollection = collection(db, 'doctors', doctorUid, 'patients', patientUid, 'evoluciones');
    const evolucionSnapshot = await getDocs(evolucionesCollection);

    const evoluciones = evolucionSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Evolucion[];

    return evoluciones;
  } catch (error) {
    console.error('Error al obtener las evoluciones:', error.message);
    return [];
  }
};

// Función para obtener los tratamientos de "Hecho por Hacer"
export const fetchHechoPorHacer = async (doctorUid: string, patientUid: string): Promise<any[]> => {
  try {
    const hechoPorHacerCollection = collection(db, 'doctors', doctorUid, 'patients', patientUid, 'hechoPorHacer');
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

// Función para obtener la lista de patients de un doctor
export const getPatientsByDoctorUid = async (doctorUid: string): Promise<Patient[]> => {
  const q = query(collection(db, 'patients'), where('doctorUid', '==', doctorUid));
  const querySnapshot = await getDocs(q);
  const patientsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
  return patientsList;
};