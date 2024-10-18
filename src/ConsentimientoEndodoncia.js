import React, { useRef, useEffect, useState } from 'react';

function ConsentimientoEndodoncia({ doctor, patient }) {
  const [toothNumbers, setToothNumbers] = useState('Número del diente');
  const currentDate = new Date().toLocaleDateString();
  const currentCity = "Ciudad donde reside"; // Reemplaza con la ciudad actual si es necesario

  const normalTextStyle = { color: 'black' };

  const consentimientoRef = useRef(null);

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
        <h2>CONSENTIMIENTO INFORMADO PARA PROCEDIMIENTO DE ENDODONCIA</h2>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Doctor:</strong> {doctor?.name || 'N/A'}</p>
          <p style={normalTextStyle}><strong>Fecha:</strong> {currentDate}</p>
          <p style={normalTextStyle}><strong>Ciudad:</strong> {currentCity}</p>
        </div>

        <div className="compact-row">
          <p style={normalTextStyle}><strong>Nombre del paciente:</strong> {patient?.primerNombre || 'N/A'} {patient?.segundoNombre || ''} {patient?.primerApellido || 'N/A'} {patient?.segundoApellido || ''}</p>
          <p style={normalTextStyle}><strong>Documento de Identidad:</strong> {patient?.identificacion || 'N/A'}</p>
          <p style={normalTextStyle}><strong>Número del diente a tratar:</strong> {toothNumbers}</p>
        </div>

        <h2>Descripción del Procedimiento:</h2>
        <p style={normalTextStyle}>
          Se me ha explicado detalladamente por el Dr. {doctor?.name || 'N/A'} que el procedimiento de endodoncia a realizar en la pieza dental número {toothNumbers} consiste en la eliminación del tejido pulpar enfermo o infectado, conocido comúnmente como "quitar el nervio". Este procedimiento incluye la limpieza y desinfección de la cámara pulpar y los conductos radiculares, los cuales serán posteriormente rellenados con un material sellador para impedir el paso de bacterias y toxinas infecciosas, con el fin de conservar el diente o molar afectado.
        </p>

        <h2>Riesgos y Complicaciones:</h2>
        <p style={normalTextStyle}>Se me ha informado que, a pesar de realizarse correctamente la técnica, existen ciertos riesgos y complicaciones asociadas con el procedimiento de endodoncia, entre los que se incluyen:</p>
        <ul style={normalTextStyle}>
          <li>Infección residual o procesos quísticos: Existe la posibilidad de que la infección o un proceso quístico o granulomatoso no se elimine completamente, lo que podría requerir una cirugía periapical en las semanas o incluso años siguientes.</li>
          <li>Relleno corto o largo: Es posible que, a pesar de realizarse correctamente la técnica, el relleno del conducto quede corto o largo, lo que podría comprometer la efectividad del tratamiento.</li>
          <li>Cambio de color: El diente o molar tratado podría cambiar de color y oscurecerse ligeramente después del procedimiento.</li>
          <li>Debilidad y fractura del diente: El diente tratado podría debilitarse y tener una mayor tendencia a fracturarse debido a la pérdida de estructura dental sana. En estos casos, podría ser necesario realizar una restauración adicional con coronas protésicas y/o refuerzos intra-radiculares para proteger el diente.</li>
          <li>Dolor postoperatorio: Es posible que después del tratamiento endodóncico experimente dolor al morder o una mayor sensibilidad en la pieza tratada. Este dolor suele resolverse solo en un período de tiempo relativamente corto. En algunos casos, se podria presentar dolor muy severo durante una semana, incluso podria presentarse inflamación facial con deformación del contorno facial durante 4 dias. Comuníquese con el doctor en caso de presentar estos síntomas.   </li>
          <li>Fallo del tratamiento: Aunque se realice el tratamiento de manera correcta, existe la posibilidad de que no se obtengan los resultados deseados, lo que podría requerir una nueva intervención o cirugía periapical.</li>
          <li>Riesgo de fractura de instrumentos: Durante el tratamiento, puede romperse un instrumento dentro del conducto radicular o ser aspirado. En estos casos, podría ser necesaria una intervención quirúrgica para eliminar el instrumento.</li>
        </ul>

        <h2>Recomendaciones Postoperatorias:</h2>
        <p style={normalTextStyle}>
          Se me ha indicado seguir las siguientes recomendaciones después del tratamiento para asegurar una recuperación adecuada:
        </p>
        <ul style={normalTextStyle}>
          <li>Evitar masticar con el diente tratado hasta que la sensibilidad haya desaparecido por completo y se haya realizado cualquier restauración adicional necesaria.</li>
          <li>Tome un analgésico como Acetaminofen (asegurese que no sea alérgico al acetaminofen, pregunte al doctor por la dosis) cada 4 horas los dos primeros días despues del procedimiento para disminuir el dolor post endodoncia.</li>
          <li>Mantener una buena higiene oral para prevenir infecciones posteriores.</li>
          <li>Programar una restauración adicional si el diente se ha debilitado considerablemente, como una corona protésica o refuerzos intra-radiculares.</li>
          <li>Informar al Dr. {doctor?.name || 'N/A'} sobre cualquier dolor persistente o complicaciones que surjan después del procedimiento.</li>
        </ul>

        <h2>Consentimiento y Autorización:</h2>
        <p style={normalTextStyle}>
          He recibido una explicación clara y comprensible sobre los riesgos, beneficios y posibles complicaciones del procedimiento de endodoncia, así como la necesidad potencial de una restauración adicional para proteger el diente tratado. Acepto voluntariamente someterme a este procedimiento y autorizo al Dr. {doctor?.name || 'N/A'} a realizar cualquier intervención adicional que sea necesaria para tratar cualquier complicación que pudiera surgir.
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

export default ConsentimientoEndodoncia;
