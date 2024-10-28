import React, { useEffect, useState, useCallback } from 'react';
import './Odontograma.css';
import { tratamientos } from './tratamientos';
import { diagnosticos } from './diagnosticos';
import { db } from './firebaseConfig';
import { doc, getDoc, getDocs, setDoc, collection } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import OdontogramaSVG from './OdontogramaSVG';
import { DiagnosticoMenu } from './DiagnosticoMenu';
import { TratamientoMenu } from './TratamientoMenu';

const Odontograma = () => {
  const [doctorUid, setDoctorUid] = useState(null);
  const [patientUid, setPatientUid] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para gestionar la carga
  const auth = getAuth();
  const [activeDiagnosticoMenu, setActiveDiagnosticoMenu] = useState(null);
  const [activeTratamientoMenu, setActiveTratamientoMenu] = useState(null);
  const [selectedTratamiento, setSelectedTratamiento] = useState(null);
  const [selectedDiagnostico, setSelectedDiagnostico] = useState(null);
  const [precios, setPrecios] = useState({});
  const [diagnosticosGuardados, setDiagnosticosGuardados] = useState([]);
  const [hechoPorHacer, setHechoPorHacer] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  


  
    const precargarDatos = async () => {
      try {
        // Ahora accedemos a la ruta correcta dentro de 'users/{userId}/doctors/{doctorUid}/pacientes/{patientUid}'
        const diagnosticosSnapshot = await getDocs(collection(db, `users/${auth.currentUser.uid}/doctors/${doctorUid}/pacientes/${patientUid}/diagnosticos`));
        const tratamientosSnapshot = await getDocs(collection(db, `users/${auth.currentUser.uid}/doctors/${doctorUid}/pacientes/${patientUid}/hechoPorHacer`));

        const diagnosticos = diagnosticosSnapshot.docs.map(doc => doc.data());
        const tratamientos = tratamientosSnapshot.docs.map(doc => doc.data());

        setDiagnosticosGuardados(diagnosticos);
        setHechoPorHacer(tratamientos);
      } catch (error) {
        console.error('Error al precargar datos:', error);
      }
    };

    precargarDatos();
  }, [doctorUid, patientUid]);
    
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

  const handleTabClick = (tab) => {
    setActiveTab((prevTab) => (prevTab === tab ? null : tab));
  };

  useEffect(() => {
    console.log(`Pestaña activa: ${activeTab}`);
  }, [activeTab]);

  const showTooltip = useCallback((event) => {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) {
      console.error("Tooltip element not found");
      return;
    }

    tooltip.textContent = `Diente: ${event.target.getAttribute('id')}`;
    tooltip.style.display = 'block';
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
  }, []);

  const hideTooltip = useCallback(() => {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }, []);

  const agregarNotaAEvolucion = useCallback(async (dienteId, codigoTratamiento, nota) => {
    try {
      const evolucionDocRef = doc(db, 'doctors', doctorUid, 'pacientes', patientUid, 'evolucion', `${dienteId}-${codigoTratamiento}`);
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
  }, [doctorUid, patientUid]);

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
      const diagnosticoDocRef = doc(db, 'doctors', doctorUid, 'pacientes', patientUid, 'diagnosticos', diagnosticoDocId);
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
  }, [doctorUid, patientUid, selectedDiagnostico]);

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
        const odontogramaDocRef = doc(db, 'doctors', doctorUid, 'pacientes', patientUid, 'odontograma', elementId);
        await setDoc(odontogramaDocRef, { color: newFill }, { merge: true });
        console.log(`Tratamiento guardado correctamente en Firestore para el diente ${elementId}.`);
      } catch (error) {
        console.error('Error al registrar el tratamiento en Firestore:', error);
      }
    } else {
      console.error('No se encontró el elemento:', elementId);
    }
  }, [doctorUid, patientUid, selectedTratamiento, precios]);

  const handleElementClick = useCallback((elementId) => {
    const { dienteId, superficie } = parseElementId(elementId);

    if (selectedDiagnostico) {
      applyDiagnostico(dienteId, superficie, selectedDiagnostico.tipo);
    } else if (selectedTratamiento) {
      applyTreatment(dienteId, superficie);
    } else {
      alert('Seleccione un diagnóstico o tratamiento primero');
    }
  }, [applyDiagnostico, applyTreatment, selectedDiagnostico, selectedTratamiento]);

  const toggleMenu = (menu, type) => {
    if (type === 'diagnostico') {
      setActiveTratamientoMenu(null);
      setActiveDiagnosticoMenu(activeDiagnosticoMenu === menu ? null : menu);
    } else if (type === 'tratamiento') {
      setActiveDiagnosticoMenu(null);
      setActiveTratamientoMenu(activeTratamientoMenu === menu ? null : menu);
    }
  };

  return (
    <div className="odontograma-container">
      <OdontogramaSVG handleElementClick={handleElementClick} showTooltip={showTooltip} hideTooltip={hideTooltip} />
      <div className="diagnostico-tratamiento">
        <DiagnosticoMenu
          activeDiagnosticoMenu={activeDiagnosticoMenu}
          toggleMenu={toggleMenu}
          handleDiagnosticoSelection={setSelectedDiagnostico}
        />
        <TratamientoMenu
          activeTratamientoMenu={activeTratamientoMenu}
          toggleMenu={toggleMenu}
          handleTratamientoSelection={setSelectedTratamiento}
          precios={precios}
          handlePrecioChange={(codigo, nuevoPrecio) => setPrecios(prev => ({ ...prev, [codigo]: nuevoPrecio }))}
          guardarPrecios={async () => {
            try {
              await setDoc(doc(db, 'precios', 'tratamientos'), precios);
              console.log('Precios guardados con éxito:', precios);
            } catch (error) {
              console.error('Error al guardar los precios:', error);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Odontograma;
