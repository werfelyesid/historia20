import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Odontograma.css';
import { tratamientos } from './Tratamientos';
import { diagnosticosSuperficie, diagnosticosDiente, diagnosticosBoca } from './Diagnosticos';
import { db } from './firebaseConfig';
import { doc, getDoc, getDocs, setDoc, collection } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import OdontogramaSVG from './OdontogramaSVG';
//import { DiagnosticoMenu } from './DiagnosticoMenu';
import { TratamientoMenu } from './TratamientoMenu';

const Odontograma = () => {
  const { doctorUid, patientUid } = useParams();
  const [doctorUidState, setDoctorUid] = useState(doctorUid);
  const [patientUidState, setPatientUid] = useState(patientUid);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();
  const navigate = useNavigate();
  const [activeDiagnosticoMenu, setActiveDiagnosticoMenu] = useState(null);
  const [activeTratamientoMenu, setActiveTratamientoMenu] = useState(null);
  const [selectedTratamiento, setSelectedTratamiento] = useState(null);
  const [selectedDiagnostico, setSelectedDiagnostico] = useState(null);
  const [precios, setPrecios] = useState({});
  const [diagnosticosGuardados, setDiagnosticosGuardados] = useState([]);
  const [hechoPorHacer, setHechoPorHacer] = useState([]);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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

            if (doctorData.doctorUid && doctorData.patientUid) {
              setDoctorUid(doctorData.doctorUid);
              setPatientUid(doctorData.patientUid);
              setIsLoading(false); // Cambia el estado de carga a false una vez que se obtienen los valores
            } else {
              console.error("Los datos no contienen doctorUid o patientUid.");
              setIsLoading(false); // Asegura que también se detenga la carga si hay error
            }
          } else {
            console.error("No se encontró el documento del doctor en Firestore.");
            setIsLoading(false);
          }
        } else {
          console.error("No hay usuario autenticado.");
          navigate('/login'); // Redirige al usuario a la página de inicio de sesión si no está autenticado
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error al obtener doctorUid y patientUid:', error);
        setIsLoading(false);
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
          const diagnosticosSnapshot = await getDocs(collection(db, `doctors/${doctorUidState}/pacientes/${patientUidState}/diagnosticos`));
          const tratamientosSnapshot = await getDocs(collection(db, `doctors/${doctorUidState}/pacientes/${patientUidState}/hechoPorHacer`));

          const diagnosticos = diagnosticosSnapshot.docs.map(doc => doc.data());
          const tratamientos = tratamientosSnapshot.docs.map(doc => doc.data());

          console.log('precargarDatos - diagnosticos:', diagnosticos); // Debugging statement
          console.log('precargarDatos - tratamientos:', tratamientos); // Debugging statement

          setDiagnosticosGuardados(diagnosticos);
          setHechoPorHacer(tratamientos);
        } catch (error) {
          console.error('Error al precargar datos:', error);
        }
      };

      precargarDatos();
    }
  }, [doctorUidState, patientUidState]);

  const handleDiagnosticoClick = (diagnostico) => {
    setSelectedDiagnostico(diagnostico);
    setActiveDiagnosticoMenu(diagnostico);
  };

  const handleTratamientoClick = (tratamiento) => {
    setSelectedTratamiento(tratamiento);
    setActiveTratamientoMenu(tratamiento);
  };

  // Función necesaria para extraer ID del diente y superficie
  const parseElementId = (elementId) => {
    const elementIdStr = String(elementId);
    const match = elementIdStr.match(/^(\d+)(?:\((\w+)\))?$/);
    if (match) {
      return {
        dienteId: match[1],
        superficie: match[2] || null,
      };
    }
    return { dienteId: elementIdStr, superficie: null };
  };

  const showTooltip = useCallback((event) => {
    setTooltipContent(`Diente: ${event.target.getAttribute('id')}`);
    setTooltipPosition({ x: event.pageX + 10, y: event.pageY + 10 });
    console.log('showTooltip - tooltipContent:', tooltipContent, 'tooltipPosition:', tooltipPosition); // Debugging statement
  }, [tooltipContent, tooltipPosition]);

  const hideTooltip = useCallback(() => {
    setTooltipContent('');
    console.log('hideTooltip - tooltipContent:', tooltipContent); // Debugging statement
  }, [tooltipContent]);

  const agregarNotaAEvolucion = useCallback(async (dienteId, codigoTratamiento, nota) => {
    try {
      const evolucionDocRef = doc(db, 'doctors', doctorUidState, 'pacientes', patientUidState, 'evolucion', `${dienteId}-${codigoTratamiento}`);
      const evolucionSnapshot = await getDoc(evolucionDocRef);
      console.log('agregarNotaAEvolucion - evolucionSnapshot:', evolucionSnapshot); // Debugging statement

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
  }, [doctorUidState, patientUidState]);

  const applyDiagnostico = useCallback(async (dienteId, superficie, tipoDiagnostico) => {
    if (!selectedDiagnostico) {
      console.error('Error: selectedDiagnostico no está definido.');
      return;
    }

    let elementId;
    if (tipoDiagnostico === 'superficie') {
      if (!superficie) {
        return;
      }
      elementId = `${dienteId}(${superficie})`;
    } else if (tipoDiagnostico === 'diente') {
      elementId = dienteId;
    } else if (tipoDiagnostico === 'boca') {
      elementId = null;
    }

    const diagnosticoData = {
      diente: tipoDiagnostico !== 'boca' ? dienteId : '',
      superficie: tipoDiagnostico === 'superficie' ? superficie : '',
      codigo: selectedDiagnostico.codigo,
      nombre: selectedDiagnostico.nombre,
      fecha: new Date().toISOString(),
      tipo: tipoDiagnostico,
    };

    try {
      const diagnosticoDocId = tipoDiagnostico !== 'boca' 
        ? `${elementId}-${selectedDiagnostico.codigo}`
        : `${selectedDiagnostico.codigo}`;
      const diagnosticoDocRef = doc(db, 'doctors', doctorUidState, 'pacientes', patientUidState, 'diagnosticos', diagnosticoDocId);
      await setDoc(diagnosticoDocRef, diagnosticoData);
      console.log('Diagnóstico registrado en la base de datos:', diagnosticoData);
      setDiagnosticosGuardados(prev => [...prev, diagnosticoData]);

      if (tipoDiagnostico === 'superficie' && ['K020', 'K021', 'K031'].includes(selectedDiagnostico.codigo)) {
        const element = document.getElementById(elementId);
        if (element) {
          element.setAttribute('stroke', 'red');
          element.setAttribute('stroke-width', '4');
          element.setAttribute('fill', 'red');
        }
      }
    } catch (error) {
      console.error('Error al registrar el diagnóstico en la base de datos:', error);
    }
  }, [doctorUidState, patientUidState, selectedDiagnostico]);

  const applyTreatment = useCallback(async (dienteId, superficie) => {
    if (!selectedTratamiento) {
      console.error('Error: selectedTratamiento no está definido.');
      return;
    }

    const elementId = superficie ? `${dienteId}(${superficie})` : dienteId;
    const element = document.getElementById(elementId);

    if (element) {
      const currentFill = element.getAttribute('fill');
      const newFill = currentFill === 'yellow' ? 'transparent' : 'yellow';
      element.setAttribute('fill', newFill);

      const treatmentData = {
        diente: dienteId,
        superficie: superficie || '',
        codigo: selectedTratamiento.codigo,
        nombre: selectedTratamiento.nombre,
        valor: precios[selectedTratamiento.codigo] || 0,
        fecha: new Date().toISOString(),
        ejecutado: 'No',
        valorEjecutado: 0,
      };

      try {
        const odontogramaDocRef = doc(db, 'doctors', doctorUidState, 'pacientes', patientUidState, 'odontograma', elementId);
        await setDoc(odontogramaDocRef, { color: newFill }, { merge: true });
        console.log(`Tratamiento guardado correctamente en Firestore para el diente ${elementId}.`);
      } catch (error) {
        console.error('Error al registrar el tratamiento en Firestore:', error);
      }
    } else {
      console.error('No se encontró el elemento:', elementId);
    }
  }, [doctorUidState, patientUidState, selectedTratamiento, precios]);

  const handleElementClick = useCallback((elementId) => {
    const { dienteId, superficie } = parseElementId(elementId);

    if (selectedDiagnostico) {
      applyDiagnostico(dienteId, superficie, selectedDiagnostico.tipo);
    } else if (selectedTratamiento) {
      applyTreatment(dienteId, superficie);
    } else {
      alert('Seleccione un diagnóstico o tratamiento primero');
    }
    console.log('handleElementClick - elementId:', elementId, 'dienteId:', dienteId, 'superficie:', superficie); // Debugging statement
  }, [applyDiagnostico, applyTreatment, selectedDiagnostico, selectedTratamiento]);

  const toggleMenu = (menu, type) => {
    if (type === 'diagnostico') {
      setActiveTratamientoMenu(null);
      setActiveDiagnosticoMenu(activeDiagnosticoMenu === menu ? null : menu);
    } else if (type === 'tratamiento') {
      setActiveDiagnosticoMenu(null);
      setActiveTratamientoMenu(activeTratamientoMenu === menu ? null : menu);
    }
    console.log('toggleMenu - menu:', menu, 'type:', type); // Debugging statement
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
        <button onClick={() => {/* lógica para guardar precios */}}>Guardar Precios</button>
      </div>
      <OdontogramaSVG handleElementClick={handleElementClick} showTooltip={showTooltip} hideTooltip={hideTooltip} />
      <div className="menu-container">
        <button onClick={() => toggleMenu('superficie', 'diagnostico')}>Diagnóstico Superficie</button>
        <button onClick={() => toggleMenu('diente', 'diagnostico')}>Diagnóstico Diente</button>
        <button onClick={() => toggleMenu('boca', 'diagnostico')}>Diagnóstico Boca</button>
      </div>
      {activeDiagnosticoMenu && (
        <DiagnosticoMenu
          diagnosticos={
            activeDiagnosticoMenu === 'superficie'
              ? diagnosticosSuperficie
              : activeDiagnosticoMenu === 'diente'
              ? diagnosticosDiente
              : diagnosticosBoca
          }
        />
      )}
      {activeTratamientoMenu && <TratamientoMenu tratamiento={activeTratamientoMenu} />}
    </div>
  );
};

export default Odontograma;