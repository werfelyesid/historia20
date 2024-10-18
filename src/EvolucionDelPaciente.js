import React, { useEffect, useState, useCallback } from 'react';
import { db } from './firebaseConfig';
import { doc, getDocs, collection, setDoc, deleteDoc, getDoc } from 'firebase/firestore';


const EvolucionDelPaciente = ({ doctorUid, patientUid }) => {
  if (!doctorUid || !patientUid) {
    console.error('doctorUid o patientUid no están definidos:', { doctorUid, patientUid });
    return;  // Termina la función si alguno es undefined o null
  }
  const [tratamientosGuardados, setTratamientosGuardados] = useState([]);

  const loadEvolucion = useCallback(async () => {
    try {
      const evolucionSnapshot = await getDocs(collection(db, 'doctors', doctorUid, 'pacientes', patientUid, 'evolucion'));
      if (!evolucionSnapshot.empty) {
        const tratamientosData = evolucionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTratamientosGuardados(tratamientosData);
      } else {
        console.log('No se encontraron tratamientos en la evolución.');
      }
    } catch (error) {
      console.error('Error al cargar la evolución del paciente:', error);
    }
  }, [doctorUid, patientUid]);

  const agregarNotaAEvolucion = async (tratamientoId, nota) => {
    try {
      const evolucionDocRef = doc(db, 'doctors', doctorUid, 'pacientes', patientUid, 'evolucion', tratamientoId);
      const evolucionSnapshot = await getDoc(evolucionDocRef);

      if (evolucionSnapshot.exists()) {
        const evolucionData = evolucionSnapshot.data();
        const nuevasNotas = [...evolucionData.notas, { texto: nota, fecha: new Date().toISOString() }];
        
        await setDoc(evolucionDocRef, { ...evolucionData, notas: nuevasNotas }, { merge: true });

        console.log('Nota agregada a la evolución:', nuevasNotas);
      } else {
        console.log('No se encontró el tratamiento en la evolución.');
      }
    } catch (error) {
      console.error('Error al agregar nota a la evolución:', error);
    }
  };

  const eliminarTratamientoDeEvolucion = async (tratamientoId) => {
    try {
      const evolucionDocRef = doc(db, 'doctors', doctorUid, 'pacientes', patientUid, 'evolucion', tratamientoId);
      await deleteDoc(evolucionDocRef);

      console.log(`Tratamiento ${tratamientoId} eliminado de la evolución`);
      setTratamientosGuardados(prev => prev.filter(trat => trat.id !== tratamientoId));
    } catch (error) {
      console.error('Error al eliminar el tratamiento de la evolución:', error);
    }
  };

  useEffect(() => {
    loadEvolucion();
  }, [loadEvolucion]);

  return (
    <div className="evolucion-tratamiento">
      <h5>Evolución del Paciente</h5>
      {tratamientosGuardados.length > 0 ? (
        tratamientosGuardados.map((tratamiento) => (
          <div key={tratamiento.id} className="evolucion-item">
            <p>{tratamiento.nombre} ({tratamiento.diente})</p>
            <button onClick={() => eliminarTratamientoDeEvolucion(tratamiento.id)}>Eliminar</button>
            <textarea
              placeholder="Agregar nota..."
              onBlur={(e) => agregarNotaAEvolucion(tratamiento.id, e.target.value)}
            ></textarea>
            <ul>
              {tratamiento.notas.map((nota, index) => (
                <li key={index}>{nota.texto} - {new Date(nota.fecha).toLocaleString()}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No hay tratamientos guardados.</p>
      )}
    </div>
  );
};

export default EvolucionDelPaciente;
