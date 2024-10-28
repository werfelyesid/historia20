import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';
import OdontogramaSVG from './OdontogramaSVG';

export const diagnosticosSuperficie = [
  { codigo: 'K021', nombre: 'Caries de la dentina', tipo: 'superficie' },
  { codigo: 'K020', nombre: 'Caries limitada al esmalte', tipo: 'superficie' },
  { codigo: 'K031', nombre: 'Abrasión de los dientes', tipo: 'superficie' },
];

export const diagnosticosDiente = [
  { codigo: 'K045', nombre: 'Periodontitis apical crónica', tipo: 'diente' },
  { codigo: 'K051', nombre: 'Gingivitis crónica', tipo: 'diente' },
  { codigo: 'K021', nombre: 'Caries de la dentina', tipo: 'diente' },
  { codigo: 'K081', nombre: 'Pérdida de dientes debida a accidente, extracción o enfermedad periodontal local', tipo: 'diente' },
  { codigo: 'K040', nombre: 'Pulpitis', tipo: 'diente' },
  { codigo: 'K025', nombre: 'Caries con exposición pulpar', tipo: 'diente' },
  { codigo: 'K041', nombre: 'Necrosis de la pulpa', tipo: 'diente' },
  { codigo: 'K044', nombre: 'Periodontitis apical aguda originada en la pulpa', tipo: 'diente' },
  { codigo: 'K045', nombre: 'Periodontitis apical crónica', tipo: 'diente' },
  { codigo: 'K010', nombre: 'Dientes incluidos o impactados', tipo: 'diente' },
  { codigo: 'K053', nombre: 'Periodontitis crónica', tipo: 'diente' },
  { codigo: 'K103', nombre: 'Alveolitis del maxilar', tipo: 'diente' },
  { codigo: 'K060', nombre: 'Retracción gingival', tipo: 'diente' },
  { codigo: 'K061', nombre: 'Hiperplasia gingival', tipo: 'diente' },
  { codigo: 'S032', nombre: 'Luxación de diente', tipo: 'diente' },
  { codigo: 'K046', nombre: 'Absceso periapical con fístula', tipo: 'diente' },
  { codigo: 'K047', nombre: 'Absceso periapical sin fístula', tipo: 'diente' },
  { codigo: 'K083', nombre: 'Raíz dental retenida', tipo: 'diente' },
  { codigo: 'K000', nombre: 'Anodoncia', tipo: 'diente' },
  { codigo: 'K060', nombre: 'Retracción gingival', tipo: 'diente' },
  { codigo: 'K033', nombre: 'Reabsorción patológica de los dientes', tipo: 'diente' },
  { codigo: 'K090', nombre: 'Quistes originados por el desarrollo de los dientes', tipo: 'diente' },
  { codigo: 'K091', nombre: 'Quistes de las fisuras (no odontogénicos)', tipo: 'diente' },
  { codigo: 'K092', nombre: 'Otros quistes de los maxilares', tipo: 'diente' },
];

export const diagnosticosBoca = [
  { codigo: 'K051', nombre: 'Gingivitis crónica', tipo: 'boca' },
  { codigo: 'K053', nombre: 'Periodontitis crónica', tipo: 'boca' },
  { codigo: 'K003', nombre: 'Dientes moteados', tipo: 'boca' },
  { codigo: 'K076', nombre: 'Trastornos de la articulación temporomaxilar', tipo: 'boca' },
  { codigo: 'K071', nombre: 'Anomalías de la relación maxilobasilar', tipo: 'boca' },
  { codigo: 'K072', nombre: 'Anomalías de la relación entre los arcos dentarios', tipo: 'boca' },
  { codigo: 'K073', nombre: 'Anomalías de la posición del diente', tipo: 'boca' },
  { codigo: 'K074', nombre: 'Maloclusión de tipo no especificado', tipo: 'boca' },
  { codigo: 'K075', nombre: 'Anomalías dentofaciales funcionales', tipo: 'boca' },
  { codigo: 'K120', nombre: 'Estomatitis Aftosa Recurrente', tipo: 'boca' },
  { codigo: 'K006', nombre: 'Alteraciones en la erupción dentaria', tipo: 'boca' },
  { codigo: 'K082', nombre: 'Atrofia del reborde alveolar desdentado', tipo: 'boca' },
  { codigo: 'K132', nombre: 'Leucoplasia y otras alteraciones del epitelio bucal', tipo: 'boca' },
];

const Diagnosticos = () => {
  const { doctorUid, patientUid } = useParams();
  const [selectedDiagnostico, setSelectedDiagnostico] = useState(null);

  const handleDiagnosticoClick = (diagnostico) => {
    setSelectedDiagnostico(diagnostico);
  };

  const applyDiagnostico = useCallback(async (dienteId, superficie) => {
    if (!selectedDiagnostico) {
      console.error('Error: selectedDiagnostico no está definido.');
      return;
    }

    const elementId = superficie ? `${dienteId}(${superficie})` : dienteId;
    const diagnosticoData = {
      diente: dienteId,
      superficie: superficie || '',
      codigo: selectedDiagnostico.codigo,
      nombre: selectedDiagnostico.nombre,
      fecha: new Date().toISOString(),
    };

    try {
      // Guardar diagnóstico en Firestore
      const diagnosticoDocRef = doc(collection(db, `doctors/${doctorUid}/pacientes/${patientUid}/diagnosticos`), elementId);
      await setDoc(diagnosticoDocRef, diagnosticoData);
      console.log('Diagnóstico registrado en la base de datos:', diagnosticoData);

      // Actualizar color en Firestore
      const colorData = { color: 'red' };
      const colorDocRef = doc(collection(db, `doctors/${doctorUid}/pacientes/${patientUid}/colorsOdontograma`), elementId);
      await setDoc(colorDocRef, colorData, { merge: true });
      console.log(`Color actualizado en Firestore para el diente ${elementId}.`);

      // Actualizar color en el SVG
      const element = document.getElementById(elementId);
      if (element) {
        element.setAttribute('stroke', 'red');
        element.setAttribute('stroke-width', '4');
        element.setAttribute('fill', 'red');
      }
    } catch (error) {
      console.error('Error al registrar el diagnóstico y actualizar el color en Firestore:', error);
    }
  }, [doctorUid, patientUid, selectedDiagnostico]);

  const handleElementClick = useCallback((elementId) => {
    const [dienteId, superficie] = elementId.split('(');
    applyDiagnostico(dienteId, superficie ? superficie.replace(')', '') : null);
  }, [applyDiagnostico]);

  return (
    <div>
      <div className="diagnosticos">
        <h5>Diagnóstico Superficie</h5>
        {diagnosticosSuperficie.map((diagnostico) => (
          <button key={diagnostico.id} onClick={() => handleDiagnosticoClick(diagnostico)}>
            {diagnostico.nombre}
          </button>
        ))}
        <h5>Diagnóstico Diente</h5>
        {diagnosticosDiente.map((diagnostico) => (
          <button key={diagnostico.id} onClick={() => handleDiagnosticoClick(diagnostico)}>
            {diagnostico.nombre}
          </button>
        ))}
        <h5>Diagnóstico Boca</h5>
        {diagnosticosBoca.map((diagnostico) => (
          <button key={diagnostico.id} onClick={() => handleDiagnosticoClick(diagnostico)}>
            {diagnostico.nombre}
          </button>
        ))}
      </div>
      <OdontogramaSVG handleElementClick={handleElementClick} />
    </div>
  );
};

export default Diagnosticos;