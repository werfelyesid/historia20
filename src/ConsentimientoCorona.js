import React, { useRef, useEffect, useState } from 'react';

function ConsentimientoCorona({ doctor, patient }) {
  const [toothNumbers, setToothNumbers] = useState('Número de diente');
  const currentDate = new Date().toLocaleDateString();
  const currentCity = "Ciudad donde reside"; // Reemplaza con la ciudad actual si es necesario

  const normalTextStyle = { color: 'black' };

  const consentimientoRef = useRef(null);

  useEffect(() => {
    const getToothNumber = () => {
      const number = prompt('¿Cuál es el número del diente o dientes que recibirán la corona de porcelana?', '');
      if (number) {
        setToothNumbers(number);
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
        <h2>CONSENTIMIENTO INFORMADO PARA COLOCACIÓN DE CORONA DE PORCELANA</h2>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Doctor:</strong> {doctor?.name || 'N/A'}</p>
          <p style={normalTextStyle}><strong>Fecha:</strong> {currentDate}</p>
          <p style={normalTextStyle}><strong>Ciudad:</strong> {currentCity}</p>
        </div>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Nombre del paciente:</strong> {patient?.primerNombre || 'N/A'} {patient?.segundoNombre || ''} {patient?.primerApellido || 'N/A'} {patient?.segundoApellido || ''}</p>
          <p style={normalTextStyle}><strong>Documento de Identidad:</strong> {patient?.identificacion || 'N/A'}</p>
          <p style={normalTextStyle}><strong>Número(s) del diente(s):</strong> {toothNumbers}</p>
        </div>

        <h2>Descripción del Procedimiento:</h2>
        <p style={normalTextStyle}>
          Se me ha informado que una corona de porcelana ha sido recomendada para mi diente/dientes número {toothNumbers} debido a la debilitación causada por caries, restauraciones previas, o tratamientos de conducto (endodoncia). Las coronas cubren y protegen los dientes, y también pueden ser colocadas por razones estéticas o para cambiar la mordida. El procedimiento requerirá al menos dos visitas al consultorio, y en algunos casos, visitas adicionales para ajustes.
        </p>
        <p style={normalTextStyle}>
          Durante la primera visita, el diente será reducido en tamaño para hacer espacio para la corona. Luego, se tomará una impresión del diente para crear una corona personalizada. Mientras la corona definitiva es fabricada por el laboratorio dental, se colocará una corona temporal en el diente, que deberá ser cementada nuevamente lo antes posible para evitar complicaciones.
        </p>

        <h2>Riesgos y Complicaciones:</h2>
        <p style={normalTextStyle}>Se me ha explicado que, aunque las coronas de porcelana son un tratamiento eficaz para restaurar dientes dañados, existen ciertos riesgos y complicaciones potenciales, entre los cuales se incluyen:</p>
        <ul style={normalTextStyle}>
          <li>Sensibilidad dental: Es posible que experimente sensibilidad al calor, al frío, o al aire después de la colocación de la corona.</li>
          <li>Necesidad de tratamiento de conducto: El tratamiento puede irritar el nervio del diente, lo que podría requerir un tratamiento de conducto posterior.</li>
          <li>Condición subyacente grave: Una vez que se retiran los rellenos anteriores y la caries, podría revelarse una condición más grave que requiera tratamiento adicional, como cirugía de encías, extracción dental, o procedimientos relacionados.</li>
          <li>Fracturas: Las coronas pueden fracturarse, y las fracturas grandes podrían requerir la colocación de una nueva corona.</li>
          <li>Caries recurrentes: La caries puede reaparecer alrededor o debajo de la corona, lo que podría requerir una nueva restauración.</li>
          <li>Impacto de comida: Podría haber impacto de comida debajo del puente o alrededor de la corona, lo que puede requerir un cuidado meticuloso por parte del paciente.</li>
          <li>Problemas de mordida: Cambios en la mordida después de la colocación de la corona podrían causar disfunción de la articulación mandibular, lo que podría requerir tratamiento adicional.</li>
          <li>Líneas negras en el borde de la encía: En coronas con base de metal, puede aparecer una línea negra en el borde de la encía si esta se retrae, lo que podría requerir una nueva corona.</li>
        </ul>

        <h2>Importancia de la Atención Postoperatoria:</h2>
        <p style={normalTextStyle}>
          Se me ha informado que es fundamental asistir a todas las citas programadas para asegurar que la corona temporal permanezca en su lugar y que la corona permanente se ajuste correctamente. No cumplir con estas indicaciones puede comprometer el ajuste de la corona final y podría requerir rehacer el procedimiento, lo que generaría costos adicionales.
        </p>

        <h2>Alternativas al Tratamiento:</h2>
        <p style={normalTextStyle}>
          El dentista me ha explicado las alternativas a la colocación de una corona de porcelana, que incluyen no tratar el diente y continuar con el monitoreo de su estado, lo que podría conllevar riesgos como la fractura del diente, problemas estéticos o funcionales, o la necesidad de extracciones en el futuro.
        </p>

        <h2>Consentimiento y Autorización:</h2>
        <p style={normalTextStyle}>
          Entiendo la naturaleza y el propósito del tratamiento con coronas de porcelana. Se me ha explicado que la odontología no es una ciencia exacta y que el éxito del tratamiento no puede ser garantizado. Después de haber recibido respuestas satisfactorias a todas mis preguntas, doy mi consentimiento y autorizo al Dr. {doctor?.name || 'N/A'} a realizar el tratamiento necesario para mi condición dental, incluyendo cualquier anestesia y/o medicamentos que sean necesarios.
        </p>

        <br />
        <div className="compact-row signature-section">
          <p style={normalTextStyle}>Firma del Paciente: ________________________________________</p>
          <p style={normalTextStyle}>Nombre: {patient?.primerNombre || 'N/A'} {patient?.segundoNombre || ''} {patient?.primerApellido || 'N/A'} {patient?.segundoApellido || ''}</p>
          <p style={normalTextStyle}>Documento: {patient?.identificacion || 'N/A'}</p>
        </div>
        
        <div className="compact-row">
          <p style={normalTextStyle}>Firma del Doctor: __________________________________________</p>
          <p style={normalTextStyle}>Nombre: {doctor?.name || 'N/A'}</p>
          <p style={normalTextStyle}>Registro: {doctor?.registroProfesional || 'N/A'}</p>
        </div>
      </div>
      <button onClick={handlePrint} className="print-button">Imprimir</button>
    </>
  );
}

export default ConsentimientoCorona;
