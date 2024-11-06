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

interface ConsentimientoImplanteProps {
  doctor: Doctor;
  patient: Patient;
}

const ConsentimientoImplante: React.FC<ConsentimientoImplanteProps> = ({ doctor, patient }) => {
  const [toothNumber, setToothNumber] = useState('Número de diente');
  const currentDate = new Date().toLocaleDateString();
  const currentCity = "Ciudad donde reside"; // Reemplaza con la ciudad actual si es necesario

  const normalTextStyle = { color: 'black' };

  const consentimientoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getToothNumber = () => {
      const number = prompt('¿Cuál es el número del diente a implantar?', '');
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
        <h2>CONSENTIMIENTO INFORMADO IMPLANTES DENTALES</h2>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Doctor:</strong> {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''}</p>
          <p style={normalTextStyle}><strong>Fecha:</strong> {currentDate}</p>
          <p style={normalTextStyle}><strong>Ciudad:</strong> {currentCity}</p>
        </div>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Nombre del paciente:</strong> {patient?.primerNombre || 'N/A'} {patient?.segundoNombre || ''} {patient?.primerApellido || 'N/A'} {patient?.segundoApellido || ''}</p>
          <p style={normalTextStyle}><strong>Documento de Identidad:</strong> {patient?.identificacion || 'N/A'}</p>
          <p style={normalTextStyle}><strong>Número de diente a implantar:</strong> {toothNumber}</p>
        </div>

        <h2>Descripción del Procedimiento:</h2>
        <p style={normalTextStyle}>
          Me han informado completamente de la naturaleza de la cirugía ambulatoria del implante dental, del procedimiento que se utilizara, de los riesgos y beneficios de la cirugía, los tratamientos alternativos disponibles y la necesidad de autocuidado y cuidado de seguimiento.
          He tenido la oportunidad de hacer las preguntas en relación con el tratamiento y de discutir mis preocupaciones con el odontólogo. Después de una deliberación minuciosa, otorgo mi consentimiento para realizar la cirugía de implante dental como me informaron durante la consulta y la presentación del plan de tratamiento como se describí en este documento junto con los costos asociados.
        </p>

        <p style={normalTextStyle}>
          También consiento en el uso de un sistema o método de implante alternativo si se encuentran condiciones clínicas que son desfavorables para el uso del sistema de implante que me han descrito. Si las condiciones clínicas impiden la colocación de los implantes, yo autorizo al Dr. {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''} a decidir el manejo quirúrgico de esa situación.
        </p>

        <h2>Anestesia:</h2>
        <p style={normalTextStyle}>
          La intervención requiere anestesia local cuyos riesgos son: Ulceración de la mucosa, dolor, limitaciones en el movimiento de la apertura de la boca (que puede requerir tratamiento alternativo), baja de tensión, sensación de mareo, alergias, urticaria, dermatitis de contacto, edema angioneurótico, fibrilación. Aunque la técnica se realice correctamente, existe la posibilidad de fracaso por razones biológicas, que puede requerir la repetición de la intervención.
        </p>
        <p style={normalTextStyle}>
          Otros posibles efectos incluyen: procesos edematosos, inflamación, hematomas, dolor, laceraciones en la mucosa del labio, mejilla o lengua que no dependen de la técnica ni de su correcta realización. Posibilidad de lesionar el seno maxilar, sinusitis que deba ser tratada por un especialista competente, lesiones de tipo nervioso, comunicación con las fosas nasales y lesionar raíces de dientes adyacentes, y excepcionalmente, fractura maxilar que requiera tratamiento posterior.
        </p>

        <h2>Riesgos y Complicaciones:</h2>
        <p style={normalTextStyle}>
          Se me ha explicado que aunque la técnica se realice correctamente, existe un porcentaje de fracasos entre el 8 y el 10 por ciento. He sido informado de las complicaciones potenciales de este procedimiento quirúrgico, que incluye además de las anteriores: deshicencia de sutura, falta de integración del implante con el hueso, imposibilidad de colocar un implante en la localización prevista, fractura mandibular en casos excepcionales, y complicaciones inherentes a la prótesis dental.
        </p>

        <p style={normalTextStyle}>
          Acepto cooperar con las recomendaciones del especialista mientras esté a cargo de mi tratamiento, comprendiendo que cualquier falta de seguimiento de las mismas podrá provocar resultados inferiores a los esperados. He sido informado/a, en términos que he comprendido, del alcance de dicho tratamiento. En la entrevista he tenido la oportunidad de proponer y resolver mis posibles dudas, y de obtener cuanta información complementaria he creído necesaria.
        </p>

        <p style={normalTextStyle}>
          Yo certifico que he leído y entendido completamente este documento. Por la presente consiento en realizar el tratamiento necesario.
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

export default ConsentimientoImplante;