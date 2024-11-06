import React, { useRef, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

interface Doctor {
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  registroProfesional: string;
  correoElectronico: string;
  celular: string;
}

interface Patient {
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  identificacion: string;
}

interface ConsentimientoExodonciaProps {
  doctorUid: string;
  patientUid: string;
}

const ConsentimientoExodoncia: React.FC<ConsentimientoExodonciaProps> = ({ doctorUid, patientUid }) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [toothNumber, setToothNumber] = useState('Número de diente');
  const currentDate = new Date().toLocaleDateString();
  const currentCity = "Ciudad donde reside"; // Reemplaza con la ciudad actual si es necesario

  const normalTextStyle = { color: 'black' };

  const consentimientoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorDocRef = doc(db, 'doctors', doctorUid);
        const doctorDoc = await getDoc(doctorDocRef);
        if (doctorDoc.exists()) {
          setDoctor(doctorDoc.data() as Doctor);
        }
      } catch (error) {
        console.error('Error al obtener datos del doctor:', error);
      }
    };

    const fetchPatientData = async () => {
      try {
        const patientDocRef = doc(db, 'doctors', doctorUid, 'pacientes', patientUid);
        const patientDoc = await getDoc(patientDocRef);
        if (patientDoc.exists()) {
          setPatient(patientDoc.data() as Patient);
        }
      } catch (error) {
        console.error('Error al obtener datos del paciente:', error);
      }
    };

    fetchDoctorData();
    fetchPatientData();

    const getToothNumber = () => {
      const number = prompt('¿Cuál es el número del diente a extraer?', '');
      if (number) {
        setToothNumber(number);
      }
    };
    getToothNumber();

    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * {
          visibility: hidden; /* Oculta todo el contenido por defecto */
        }
        #consentimiento-print, #consentimiento-print * {
          visibility: visible; /* Solo muestra el contenido del consentimiento */
        }
        #consentimiento-print {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        body {
          font-size: 9px; /* Reduce un poco más el tamaño de la fuente */
          margin: 0; /* Reduce los márgenes para aprovechar más espacio */
        }
        #consentimiento-print {
          padding: 8px; /* Ajusta el padding */
        }
        h2 {
          font-size: 13px; /* Ajusta el tamaño de los encabezados */
        }
        h3 {
          font-size: 11px; /* Ajusta el tamaño de los subencabezados */
        }
        p, ul, li {
          margin: 1px 0; /* Reduce el espacio entre líneas */
        }
        .compact-row {
          display: flex;
          justify-content: space-between;
        }
        .compact-row p {
          margin-right: 8px; /* Ajusta el espaciado entre los elementos en la misma línea */
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [doctorUid, patientUid]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button onClick={handlePrint} className="print-button">Imprimir</button>
      <div id="consentimiento-print" className="consentimiento-form" ref={consentimientoRef}>
        <h2>CONSENTIMIENTO INFORMADO PARA EXTRACCIÓN DENTAL</h2>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Doctor:</strong> {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''}</p>
          <p style={normalTextStyle}><strong>Fecha:</strong> {currentDate}</p>
          <p style={normalTextStyle}><strong>Ciudad:</strong> {currentCity}</p>
        </div>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Nombre del paciente:</strong> {patient?.primerNombre || 'N/A'} {patient?.segundoNombre || ''} {patient?.primerApellido || 'N/A'} {patient?.segundoApellido || ''}</p>
          <p style={normalTextStyle}><strong>Documento de Identidad:</strong> {patient?.identificacion || 'N/A'}</p>
          <p style={normalTextStyle}><strong>Número de diente a extraer:</strong> {toothNumber}</p>
        </div>

        <h2>Descripción del Procedimiento:</h2>
        <p style={normalTextStyle}>
          Se me ha explicado que el procedimiento de extracción dental recomendado para mi diente número {toothNumber} consiste en la extracción del diente debido a caries, infección, fractura, o por razones ortodónticas.
        </p>

        <h2>Riesgos y Complicaciones:</h2>
        <p style={normalTextStyle}>Entiendo que hay ciertos riesgos inherentes y potenciales asociados con los procedimientos de extracción dental, que incluyen, pero no se limitan a:</p>
        <ul style={normalTextStyle}>
          <li>Sangrado: Es común experimentar sangrado después del procedimiento, que puede ser temporal o, en algunos casos, prolongarse.</li>
          <li>Infección: Existe el riesgo de infección en el sitio de la extracción, que puede requerir tratamiento adicional con antibióticos.</li>
          <li>Dolor: Es posible experimentar dolor después del procedimiento, que puede ser manejado con analgésicos.</li>
          <li>Daño a dientes adyacentes: Durante el procedimiento, puede ocurrir daño a los dientes adyacentes, que puede requerir tratamiento adicional.</li>
          <li>Fractura de la mandíbula: En raros casos, puede ocurrir una fractura de la mandíbula durante la extracción de un diente.</li>
          <li>Reacción a la anestesia: Existe el riesgo de una reacción adversa a la anestesia utilizada durante el procedimiento.</li>
        </ul>

        <h2>Importancia de la Atención Postoperatoria:</h2>
        <p style={normalTextStyle}>
          Se me ha informado de la importancia de seguir todas las recomendaciones postoperatorias para asegurar una correcta cicatrización. Esto incluye mantener una buena higiene oral, evitar fumar, y asistir a las citas de control.
        </p>

        <h2>Alternativas al Tratamiento:</h2>
        <p style={normalTextStyle}>
          El Dr. {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''} me ha explicado las alternativas al procedimiento de extracción dental, que incluyen no tratar el diente afectado y monitorear su estado, lo cual podría conllevar riesgos como la progresión de la caries, infecciones, problemas estéticos, o la necesidad de procedimientos más invasivos en el futuro.
        </p>

        <h2>Consentimiento y Autorización:</h2>
        <p style={normalTextStyle}>
          He recibido una explicación clara y comprensible sobre los riesgos, beneficios y posibles complicaciones del procedimiento de extracción dental. Acepto voluntariamente someterme a este procedimiento y autorizo al Dr. {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''} a realizar cualquier intervención adicional que sea necesaria para tratar cualquier complicación que pudiera surgir.
        </p>

        <br />
        <div className="compact-row signature-section">
          <p style={normalTextStyle}>Firma del Paciente: ________________________________________</p>
          <p style={normalTextStyle}>Nombre: {patient?.primerNombre || 'N/A'} {patient?.segundoNombre || ''} {patient?.primerApellido || 'N/A'} {patient?.segundoApellido || ''}</p>
          <p style={normalTextStyle}>Documento: {patient?.identificacion || 'N/A'}</p>
        </div>
        
        <div className="compact-row">
          <p style={normalTextStyle}>Firma del Doctor: __________________________________________</p>
          <p style={normalTextStyle}>Nombre: {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''}</p>
          <p style={normalTextStyle}>Registro: {doctor?.registroProfesional || 'N/A'}</p>
        </div>
      </div>
      <button onClick={handlePrint} className="print-button">Imprimir</button>
    </>
  );
}

export default ConsentimientoExodoncia;