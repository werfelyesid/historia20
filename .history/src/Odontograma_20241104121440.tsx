import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Odontograma.css';
import { db } from './firebaseConfig';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import OdontogramaSVG from './OdontogramaSVG';
import Diagnosticos, { diagnosticosSuperficie, diagnosticosDiente, diagnosticosBoca } from './Diagnosticos';
import { TratamientoMenu } from './Tratamientos';

interface Precio {
  nombre: string;
  precio: number;
}

interface Precios {
  [codigo: string]: Precio;
}

interface HechoPorHacer {
  fecha: string;
  diente: string;
  superficie: string;
  nombre: string;
  valor: number;
  ejecutado: boolean;
  valorEjecutado: number;
}

const Odontograma: React.FC = () => {
  const { doctorUid, patientUid } = useParams<{ doctorUid: string; patientUid: string }>();
  const [doctorUidState, setDoctorUid] = useState<string | undefined>(doctorUid);
  const [patientUidState, setPatientUid] = useState<string | undefined>(patientUid);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const auth = getAuth();
  const navigate = useNavigate();
  const [activeTratamientoMenu, setActiveTratamientoMenu] = useState<string | null>(null);
  const [precios, setPrecios] = useState<Precios>({});
  const [hechoPorHacer, setHechoPorHacer] = useState<HechoPorHacer[]>([]);

  useEffect(() => {
    console.log('useEffect - doctorUid:', doctorUid, 'patientUid:', patientUid); // Debugging statement
    const fetchIds = async () => {
      try {
        const doctor = auth.currentUser;
        console.log('fetchIds - auth.currentUser:', doctor); // Debugging statement
        if (doctor) {
          console.log("Doctor autenticado, UID:", doctor.uid);

          // Cambiamos a la ruta correcta dentro de 'doctors/{doctorUid}'
          const doctorDocRef = doc(db, `doctors/${doctor.uid}`);
          const doctorDoc = await getDoc(doctorDocRef);
          console.log('fetchIds - doctorDoc:', doctorDoc); // Debugging statement

          if (doctorDoc.exists()) {
            const doctorData = doctorDoc.data();
            console.log("Datos del doctor:", doctorData);

            // Verificar si los datos contienen uid y pacientes
            if (doctorData.uid && doctorData.pacientes) {
              setDoctorUid(doctorData.uid);
              setPatientUid(Object.keys(doctorData.pacientes)[0]); // Asumiendo que quieres el primer paciente
            } else {
              console.error("Los datos no contienen uid o pacientes.");
            }
          } else {
            console.error("No se encontró el documento del doctor en Firestore.");
          }
        } else {
          console.error("No hay usuario autenticado.");
          navigate('/login'); // Redirige al usuario a la página de inicio de sesión si no está autenticado
        }
      } catch (error) {
        console.error('Error al obtener doctorUid y patientUid:', error);
      } finally {
        setIsLoading(false); // Asegura que también se detenga la carga si hay error
      }
    };

    if (!doctorUid || !patientUid) {
      fetchIds();
    } else {
      setIsLoading(false);
    }
  }, [auth, navigate, doctorUid, patientUid]);

  useEffect(() => {
    if (doctorUidState && patientUidState) {
      const precargarDatos = async () => {
        try {
          // Ahora accedemos a la ruta correcta dentro de 'doctors/{doctorUid}/pacientes/{patientUid}'
          const tratamientosSnapshot = await getDocs(collection(db, `doctors/${doctorUidState}/pacientes/${patientUidState}/hechoPorHacer`));
          const tratamientos = tratamientosSnapshot.docs.map(doc => doc.data() as HechoPorHacer);

          console.log('precargarDatos - tratamientos:', tratamientos); // Debugging statement

          setHechoPorHacer(tratamientos);
        } catch (error) {
          console.error('Error al precargar datos:', error);
        }
      };

      precargarDatos();
    }
  }, [doctorUidState, patientUidState]);

  const toggleMenu = (menu: string, type: string) => {
    if (type === 'tratamiento') {
      setActiveTratamientoMenu(activeTratamientoMenu === menu ? null : menu);
    }
    console.log('toggleMenu - menu:', menu, 'type:', type); // Debugging statement
  };

  const handleTratamientoSelection = (item: Precio, tipo: string) => {
    console.log(`Tratamiento seleccionado: ${item.nombre} (${tipo})`);
  };

  const handlePrecioChange = (codigo: string, precio: number) => {
    setPrecios((prevPrecios) => ({
      ...prevPrecios,
      [codigo]: { ...prevPrecios[codigo], precio },
    }));
  };

  const guardarPrecios = () => {
    console.log('Precios guardados:', precios);
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="odontograma-container">
      <div className="menu-container">
        <button onClick={() => toggleMenu('superficie', 'tratamiento')}>Tratamiento Superficie</button>
        <button onClick={() => toggleMenu('diente', 'tratamiento')}>Tratamiento Diente</button>
        <button onClick={() => toggleMenu('boca', 'tratamiento')}>Tratamiento Boca</button>
        <button>Consultas</button>
        <button>Imagenología</button>
        <button onClick={guardarPrecios}>Guardar Precios</button>
      </div>
      <OdontogramaSVG />
      <div className="menu-container">
        <Diagnosticos />
      </div>
      {activeTratamientoMenu && (
        <TratamientoMenu
          activeTratamientoMenu={activeTratamientoMenu}
          toggleMenu={toggleMenu}
          handleTratamientoSelection={handleTratamientoSelection}
          precios={precios}
          handlePrecioChange={handlePrecioChange}
          guardarPrecios={guardarPrecios}
        />
      )}
    </div>
  );
};

export default Odontograma;