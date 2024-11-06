import React, { useRef, useEffect, useState } from 'react';

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

interface ConsentimientoOperatoriaProps {
  doctor: Doctor;
  patient: Patient;
}

const ConsentimientoOperatoria: React.FC<ConsentimientoOperatoriaProps> = ({ doctor, patient }) => {
  const [toothNumber, setToothNumber] = useState('Número de diente');
  const currentDate = new Date().toLocaleDateString();
  const currentCity = "Ciudad donde reside"; // Reemplaza con la ciudad actual si es necesario

  const normalTextStyle = { color: 'black' };

  const consentimientoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getToothNumber = () => {
      const number = prompt('¿Cuál es el número del diente a tratar en la operatoria dental?', '');
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
    return () => document.head.removeChild(style);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button onClick={handlePrint} className="print-button">Imprimir</button>
      <div id="consentimiento-print" className="consentimiento-form" ref={consentimientoRef}>
        <h2>CONSENTIMIENTO INFORMADO PARA PROCEDIMIENTO DE OPERATORIA DENTAL</h2>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Doctor:</strong> {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''}</p>
          <p style={normalTextStyle}><strong>Fecha:</strong> {currentDate}</p>
          <p style={normalTextStyle}><strong>Ciudad:</strong> {currentCity}</p>
        </div>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Nombre del paciente:</strong> {patient?.primerNombre || 'N/A'} {patient?.segundoNombre || ''} {patient?.primerApellido || 'N/A'} {patient?.segundoApellido || ''}</p>
          <p style={normalTextStyle}><strong>Documento de Identidad:</strong> {patient?.identificacion || 'N/A'}</p>
          <p style={normalTextStyle}><strong>Número de diente a tratar:</strong> {toothNumber}</p>
        </div>

        <h2>Descripción del Procedimiento:</h2>
        <p style={normalTextStyle}>
          Se me ha explicado que el procedimiento de operatoria dental (restauración dental) recomendado para mi diente número {toothNumber} consiste en la eliminación de caries, defectos o restauraciones anteriores, y en la posterior reconstrucción del diente utilizando materiales de restauración como resinas compuestas, amalgamas, o materiales cerámicos.
        </p>

        <h2>Riesgos y Complicaciones:</h2>
        <p style={normalTextStyle}>Entiendo que hay ciertos riesgos inherentes y potenciales asociados con los procedimientos de operatoria dental, que incluyen, pero no se limitan a:</p>
        <ul style={normalTextStyle}>
          <li>Sensibilidad dental: Es común experimentar sensibilidad al calor, al frío, o al aire después del procedimiento, que puede ser temporal o, en algunos casos, prolongarse.</li>
          <li>Necesidad de tratamiento adicional: En algunos casos, el tratamiento puede irritar el nervio del diente, lo que podría requerir un tratamiento adicional, como una endodoncia (tratamiento de conducto).</li>
          <li>Revelación de condiciones subyacentes: Durante el procedimiento, al retirar caries o restauraciones anteriores, puede revelarse una condición más grave que requiera tratamiento adicional, como cirugía de encías, extracción dental, o procedimientos relacionados.</li>
          <li>Fracturas o fallos en la restauración: Las restauraciones dentales pueden fracturarse, desprenderse o fallar con el tiempo, lo que podría requerir reparación o reemplazo.</li>
          <li>Caries recurrente: Existe la posibilidad de que se desarrolle caries alrededor o debajo de la restauración con el tiempo, lo que podría requerir una nueva intervención.</li>
          <li>Impacto de comida: Pueden ocurrir problemas de impacto de comida entre los dientes restaurados, lo que podría requerir un cuidado meticuloso por parte del paciente.</li>
          <li>Cambios en la mordida: Es posible que después de la restauración se produzcan cambios en la mordida, lo que podría causar disfunción de la articulación mandibular, y en raros casos, podría requerir tratamiento adicional.</li>
        </ul>

        <h2>Importancia de la Atención Postoperatoria:</h2>
        <p style={normalTextStyle}>
          Se me ha informado de la importancia de seguir todas las recomendaciones postoperatorias para asegurar la durabilidad de la restauración. Esto incluye mantener una buena higiene oral, asistir a las citas de control, y reportar cualquier anomalía o dolor persistente al Dr. {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''}.
        </p>

        <h2>Alternativas al Tratamiento:</h2>
        <p style={normalTextStyle}>
          El Dr. {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''} me ha explicado las alternativas al procedimiento de operatoria dental, que incluyen no tratar el diente afectado y monitorear su estado, lo cual podría conllevar riesgos como la progresión de la caries, infecciones, problemas estéticos, o la necesidad de procedimientos más invasivos en el futuro.
        </p>

        <h2>Consentimiento y Autorización:</h2>
        <p style={normalTextStyle}>
          He recibido una explicación clara y comprensible sobre los riesgos, beneficios y posibles complicaciones del procedimiento de operatoria dental. Acepto voluntariamente someterme a este procedimiento y autorizo al Dr. {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''} a realizar cualquier intervención adicional que sea necesaria para tratar cualquier complicación que pudiera surgir.
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

export default ConsentimientoOperatoria;