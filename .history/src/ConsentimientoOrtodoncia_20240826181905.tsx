import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

function ConsentimientoOrtodoncia({ doctor, patient }) {
  const [acudiente, setAcudiente] = useState('');
  const [documentoAcudiente, setDocumentoAcudiente] = useState('');
  const [isMinor, setIsMinor] = useState(false);
  const consentimientoRef = useRef(null);

  const currentDate = new Date().toLocaleDateString();
  const currentCity = "Ciudad donde reside"; // Reemplaza con la ciudad actual si es necesario

  useEffect(() => {
    const promptForAcudiente = () => {
      const isMinorResponse = window.prompt('Si el paciente es menor de edad, escriba "1". De lo contrario, deje vacío.');
      if (isMinorResponse === '1') {
        setIsMinor(true);
        const nombreAcudiente = window.prompt('Ingrese el nombre y apellido del acudiente:');
        const docAcudiente = window.prompt('Ingrese el número de documento de identidad del acudiente:');
        setAcudiente(nombreAcudiente);
        setDocumentoAcudiente(docAcudiente);
      }
    };
    promptForAcudiente();

    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        #consentimiento-print, #consentimiento-print * {
          visibility: visible;
        }
        #consentimiento-print {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        body {
          font-size: 12px;
          margin: 0;
        }
        #consentimiento-print {
          padding: 20px;
        }
        h2 {
          font-size: 16px;
        }
        h3 {
          font-size: 14px;
        }
        p, ul, li {
          margin: 2px 0;
        }
        .compact-row {
          display: flex;
          justify-content: space-between;
        }
        .compact-row p {
          margin-right: 10px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSave = async () => {
    const fecha = new Date().toLocaleString();
    try {
      const evolucionRef = collection(db, 'doctors', doctor.uid, 'pacientes', patient.uid, 'evoluciones');
      const descripcion = isMinor
        ? `Se firma el consentimiento de ortodoncia del paciente menor de edad ${patient.primerNombre} ${patient.primerApellido}, con el acudiente ${acudiente}.`
        : `Se firma el consentimiento de ortodoncia del paciente ${patient.primerNombre} ${patient.primerApellido}.`;
      await addDoc(evolucionRef, {
        descripcion,
        fecha,
      });
      alert('Consentimiento guardado y registrado en la evolución del paciente.');
    } catch (error) {
      console.error('Error al guardar el consentimiento en la evolución:', error);
      alert('Hubo un error al guardar el consentimiento.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button onClick={handlePrint} className="print-button">Imprimir</button>
      <button onClick={handleSave} className="save-button">Guardar</button>

      <div id="consentimiento-print" className="consentimiento-form" ref={consentimientoRef}>
        <h2>CONSENTIMIENTO INFORMADO PARA TRATAMIENTO DE ORTODONCIA</h2>

        <div className="compact-row">
          <p><strong>Doctor:</strong> {doctor?.name || 'N/A'}</p>
          <p><strong>Fecha:</strong> {currentDate}</p>
          <p><strong>Ciudad:</strong> {currentCity}</p>
        </div>

        <div className="compact-row">
          <p><strong>Nombre del paciente:</strong> {patient?.primerNombre || 'N/A'} {patient?.segundoNombre || ''} {patient?.primerApellido || 'N/A'} {patient?.segundoApellido || ''}</p>
          <p><strong>Documento de Identidad:</strong> {patient?.identificacion || 'N/A'}</p>
        </div>

        <h2>Descripción del Tratamiento:</h2>
        <p>
          Se advierte al(a) paciente que se le propone un plan de tratamiento adecuado, sin embargo, cuando por razones de tiempo,
          económicas o por simple decisión de él, pide que se realicen tratamientos alternativos, tales como camuflar (mejorar apariencia
          sin corrección de fondo), o simplemente alinear los resultados no va a ser los óptimos esperados. Se advierte que la erupción de las muelas del juicio, o cordales, podrían volver a torcer los dientes, es posible que se requiera la extracción de las cordales al final del tratamiento de ortodoncia.
        </p>
        <p>
          Se informa al(a) paciente que no todos los resultados esperados son estéticos, existen otros resultados funcionales y en sus
          estructuras de la boca, que pueden no ser perceptibles estéticamente.
        </p>
        <p>
          Comportamientos del(a) paciente como tumbar los brackets, dañar o botar los aparatos, no usar los elásticos, no ponerse los
          retenedores o aparatos de contención, inasistencia a citas o mala higiene oral alteran el pronóstico del tratamiento e inclusive
          pueden producir mayores daños en su salud.
        </p>
       
        <p>
          Existe riesgo de retracciones de la encía (Se expone la raiz del diente), no previsibles, debidas al efecto de los movimientos dentarios.
        </p>
        <p>
          Algunos pacientes son más susceptibles a que se produzca la reabsorción de la raíz de uno o varios dientes sometidos a tratamiento
          de ortodoncia, lo que puede cambiar el plan de tratamiento.
        </p>
        <p>
          Puede haber molestia o dolor en la articulación de la mandíbula (al lado del oído) el tratamiento de ortodoncia puede durar de uno a 3 años, incluso en casos raros puede tardarse un poco más. 
        </p>
        <p>
          Existe el riesgo del desarrollo imprevisible de la erupción dentaria, el crecimiento de los maxilares o de respuesta de dientes o
          hueso a las fuerzas ortodónticas, lo que obliga a cambiar el plan de tratamiento, requiriendo en ocasiones extracciones de dientes
          definitivos para conseguir espacio lo que conduce que el tiempo del tratamiento se prolongue.
        </p>
        <p>
          Los primeros días luego de los controles se puede presentar dolor moderado, es normal, comuniquese con su doctor para tomar analgésicos, también es posible la aparición de heridas en los carrillos debido a que los arcos de la ortodoncia podrían moverse y causar molestia, el doctor le ha entregado un kit con una cera para que se aplique en la zona para disminuir el dolor mientras solicita la cita con su doctor. 
        </p>
<p>El uso de los retenedores es necesario para asegurar los dientes en su posición y prevenir que los dientes pierdan su correcta alineación, su uso debera ser de al menos 16 horas diarias, durante dos o tres años después de terminada la ortodoncia, nunca ponga los retenedores en una servilleta, los perderá y si  los daña o extravía deberá avisar al doctor para solicitar su reemplazo, ( los deberá volver a pagar) recuerde que de esto depende el éxito de su tratamiento.</p>
        {/* Firma del paciente o del acudiente */}
        {isMinor ? (
          <div>
            <p>Firma del Acudiente: ________________________________________</p>
            <p>Nombre del Acudiente: {acudiente}</p>
            <p>Documento del Acudiente: {documentoAcudiente}</p>
            <p>Adulto responsable del menor</p>
          </div>
        ) : (
          <div>
            <p>Firma del Paciente: ________________________________________</p>
            <p>Nombre: {patient?.primerNombre || 'N/A'} {patient?.segundoNombre || ''} {patient?.primerApellido || 'N/A'} {patient?.segundoApellido || ''}</p>
            <p>Documento: {patient?.identificacion || 'N/A'}</p>
          </div>
        )}

        <div className="compact-row">
          <p>Firma del Doctor: __________________________________________</p>
          <p>Nombre: {doctor?.name || 'N/A'}</p>
          <p>Registro: {doctor?.registroProfesional || 'N/A'}</p>
        </div>
      </div>
    </>
  );
}

export default ConsentimientoOrtodoncia;
