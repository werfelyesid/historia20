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

interface ConsentimientoExodonciaProps {
  doctor: Doctor;
  patient: Patient;
}

const ConsentimientoExodoncia: React.FC<ConsentimientoExodonciaProps> = ({ doctor, patient }) => {
  const [toothNumbers, setToothNumbers] = useState('Número del diente');
  const currentDate = new Date().toLocaleDateString();
  const currentCity = "Ciudad donde reside"; // Reemplaza con la ciudad actual si es necesario

  const normalTextStyle = { color: 'black' };

  const consentimientoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getToothNumber = () => {
      const number = prompt('¿Cuál es el número del diente a extraer?', '');
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
        <h2>CONSENTIMIENTO INFORMADO PARA PROCEDIMIENTO DE EXODONCIA</h2>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Doctor:</strong> {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''}</p>
          <p style={normalTextStyle}><strong>Fecha:</strong> {currentDate}</p>
          <p style={normalTextStyle}><strong>Ciudad:</strong> {currentCity}</p>
        </div>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Nombre del paciente:</strong> {patient?.primerNombre || 'N/A'} {patient?.segundoNombre || ''} {patient?.primerApellido || 'N/A'} {patient?.segundoApellido || ''}</p>
          <p style={normalTextStyle}><strong>Documento de Identidad:</strong> {patient?.identificacion || 'N/A'}</p>
          <p style={normalTextStyle}><strong>Número de dientes a extraer:</strong> {toothNumbers}</p>
        </div>

        <h2>Descripción del Procedimiento:</h2>
        <p style={normalTextStyle}>
          Se me ha explicado por parte del Dr. {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''} que el procedimiento de exodoncia (extracción dental) consiste en la remoción de los dientes indicados para tratar afecciones dentales que no pueden ser resueltas con otros tratamientos conservadores. Este procedimiento implica la extracción de los dientes ({toothNumbers}), y se deben tomar precauciones específicas durante el período postoperatorio.
        </p>

        <h2>Riesgos y Complicaciones:</h2>
        <p style={normalTextStyle}>Se me ha informado de los siguientes riesgos y complicaciones asociados con el procedimiento de exodoncia:</p>
        <ul style={normalTextStyle}>
          <li>Infección postoperatoria: Existe el riesgo de que se desarrolle una infección después de la extracción, lo que podría requerir tratamiento adicional.</li>
          <li>Cicatrización retardada (alveolitis seca): Puede ocurrir una cicatrización lenta, lo que requerirá cuidados postoperatorios frecuentes.</li>
          <li>Hinchazón, morados e inflamación: Es común experimentar hinchazón, moretones e inflamación en la zona tratada, acompañados de dolor.</li>
          <li>Estiramiento de las comisuras de la boca: Esto puede resultar en grietas o moretones en los labios.</li>
          <li>Daño a los dientes contiguos: Durante el procedimiento, existe la posibilidad de dañar dientes adyacentes, empastes o fundas.</li>
          <li>Pérdida de sangre: En algunos casos, podría ser necesario tratamiento adicional para controlar la hemorragia.</li>
          <li>Reacciones a la medicación: Podrían presentarse efectos secundarios o reacciones adversas a los medicamentos recetados.</li>
          <li>Formación de bordes afilados o astillas de hueso: Estos pueden aparecer más adelante y requerir una intervención quirúrgica menor para ser removidos o suavizados.</li>
          <li>Fragmentos de raíz o hueso: Es posible que se dejen pequeños fragmentos en la mandíbula, los cuales podrían emerger más tarde y requerir tratamiento.</li>
          <li>Dificultad para abrir la boca: Podría haber dificultad para abrir la boca después del procedimiento, o en raros casos, fractura o dislocación de la mandíbula.</li>
          <li>Daño a los nervios: Existe el riesgo de daño a los nervios, que podría resultar en entumecimiento o hormigueo temporal o permanente en el labio, barbilla, lengua, u otras áreas.</li>
          <li>Implicación de la cavidad nasal: En algunos casos, especialmente en la extracción de dientes superiores, podría haber una comunicación con la cavidad nasal que requeriría atención adicional.</li>
        </ul>

        <h2>Riesgos de la Anestesia:</h2>
        <p style={normalTextStyle}>
          La aplicación de anestesia para manejar el dolor conlleva sus propios riesgos, tales como:
        </p>
        <ul style={normalTextStyle}>
          <li>Hematoma (moretón).</li>
          <li>Parálisis temporal o permanente.</li>
          <li>Mareo, dolor de cabeza, alteración del gusto.</li>
          <li>Taquicardia o reacciones adversas al anestésico.</li>
          <li>Mordeduras en la zona anestesiada debido a la falta de sensibilidad.</li>
        </ul>

        <h2>Recomendaciones Postoperatorias:</h2>
        <p style={normalTextStyle}>
          Se me ha instruido que después del procedimiento de exodoncia debo seguir las siguientes recomendaciones para asegurar una recuperación adecuada:
        </p>
        <ul style={normalTextStyle}>
          <li>Evitar ciertas actividades: No asolearse, no serenarse, no realizar ejercicio físico, no escupir, no cocinar, no ingerir bebidas alcohólicas, ni trasnocharse durante los primeros 3 días.</li>
          <li>Aplicación de hielo: Colocar una bolsa con hielo en la región de la cara donde se realizó la extracción durante las primeras 12 horas. Luego de este tiempo, se pueden aplicar paños de agua tibia en la región externa facial.</li>
          <li>Morder la gasa: Se debe morder la gasa colocada durante el procedimiento durante dos (2) horas.</li>
          <li>Uso de antibióticos: Si el Dr. {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''} ha prescrito antibióticos, debo completar el tratamiento según las indicaciones.</li>
          <li>Higiene personal: Lavar las manos antes y después de cada comida, y antes y después de ir al baño.</li>
          <li>Dieta: Mantener una dieta líquida y fría durante el día del procedimiento.</li>
          <li>Incapacidad: Se me ha dado una incapacidad de tres días para evitar esfuerzos innecesarios y facilitar la recuperación.</li>
        </ul>

        <h2>Obligaciones del Paciente:</h2>
        <p style={normalTextStyle}>
          Entiendo que, como paciente, tengo las siguientes obligaciones para asegurar el éxito del tratamiento:
        </p>
        <ul style={normalTextStyle}>
          <li>Informar al doctor: Debo comunicar todas las circunstancias relevantes sobre mi estado de salud, antecedentes médicos, medicamentos que consumo, y cualquier cambio en mi condición.</li>
          <li>Colaboración activa: Debo seguir todas las instrucciones proporcionadas por el Dr. {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''} y asistir a todas las citas programadas.</li>
          <li>Higiene oral: Mantener una buena higiene oral es crucial para prevenir complicaciones postoperatorias.</li>
        </ul>

        <h2>Consentimiento y Autorización:</h2>
        <p style={normalTextStyle}>
          He recibido una explicación clara y comprensible acerca de los riesgos, beneficios y posibles complicaciones del procedimiento de exodoncia. Acepto voluntariamente someterme a este procedimiento y autorizo al Dr. {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''} a realizar cualquier intervención adicional que sea necesaria para tratar cualquier complicación que pudiera surgir.
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