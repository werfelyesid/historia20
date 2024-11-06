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

interface ConsentimientoEndodonciaProps {
  doctor: Doctor;
  patient: Patient;
}

const ConsentimientoEndodoncia: React.FC<ConsentimientoEndodonciaProps> = ({ doctor, patient }) => {
  const [toothNumbers, setToothNumbers] = useState('Número del diente');
  const currentDate = new Date().toLocaleDateString();
  const currentCity = "Ciudad donde reside"; // Reemplaza con la ciudad actual si es necesario

  const normalTextStyle = { color: 'black' };

  const consentimientoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getToothNumber = () => {
      const number = prompt('¿Cuál es el número del diente a tratar en la endodoncia?', '');
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
        <h2>CONSENTIMIENTO INFORMADO PARA TRATAMIENTO DE ENDODONCIA</h2>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Doctor:</strong> {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''}</p>
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
          Se me ha informado que un tratamiento de endodoncia ha sido recomendado para mi diente/dientes número {toothNumbers} debido a la infección o daño en la pulpa dental. El procedimiento implica la eliminación de la pulpa infectada, la limpieza y desinfección del conducto radicular, y el sellado del conducto con un material de obturación.
        </p>
        <p style={normalTextStyle}>
          Durante el procedimiento, se utilizará anestesia local para minimizar el dolor y la incomodidad. Es posible que se necesiten varias visitas para completar el tratamiento, y en algunos casos, se puede requerir una corona para proteger el diente tratado.
        </p>

        <h2>Riesgos y Complicaciones:</h2>
        <p style={normalTextStyle}>Se me ha explicado que, aunque el tratamiento de endodoncia es un procedimiento común y generalmente seguro, existen ciertos riesgos y complicaciones potenciales, entre los cuales se incluyen:</p>
        <ul style={normalTextStyle}>
          <li>Sensibilidad dental: Es posible que experimente sensibilidad al calor, al frío, o al aire después del tratamiento.</li>
          <li>Infección: Aunque se toman medidas para prevenir infecciones, existe un riesgo de infección que podría requerir tratamiento adicional.</li>
          <li>Fractura del diente: El diente tratado puede volverse más frágil y susceptible a fracturas.</li>
          <li>Necesidad de tratamiento adicional: En algunos casos, el tratamiento de endodoncia puede no ser suficiente para salvar el diente, y puede ser necesario realizar una cirugía de conducto radicular o una extracción dental.</li>
          <li>Reacciones adversas a la anestesia: Aunque raras, pueden ocurrir reacciones adversas a la anestesia utilizada durante el procedimiento.</li>
        </ul>

        <h2>Importancia de la Atención Postoperatoria:</h2>
        <p style={normalTextStyle}>
          Se me ha informado que es fundamental seguir las instrucciones postoperatorias proporcionadas por el dentista para asegurar una recuperación adecuada y minimizar el riesgo de complicaciones. Esto incluye mantener una buena higiene oral, asistir a todas las citas de seguimiento y evitar masticar alimentos duros en el diente tratado hasta que se haya colocado una restauración definitiva.
        </p>

        <h2>Alternativas al Tratamiento:</h2>
        <p style={normalTextStyle}>
          El dentista me ha explicado las alternativas al tratamiento de endodoncia, que incluyen la extracción del diente afectado y la colocación de un implante dental, un puente o una prótesis parcial para reemplazar el diente perdido.
        </p>

        <h2>Consentimiento y Autorización:</h2>
        <p style={normalTextStyle}>
          Entiendo la naturaleza y el propósito del tratamiento de endodoncia. Se me ha explicado que la odontología no es una ciencia exacta y que el éxito del tratamiento no puede ser garantizado. Después de haber recibido respuestas satisfactorias a todas mis preguntas, doy mi consentimiento y autorizo al Dr. {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''} a realizar el tratamiento necesario para mi condición dental, incluyendo cualquier anestesia y/o medicamentos que sean necesarios.
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

export default ConsentimientoEndodoncia;