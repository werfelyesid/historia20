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

interface ConsentimientoProtesisProps {
  doctorUid: string;
  patientUid: string;
}

const ConsentimientoProtesis: React.FC<ConsentimientoProtesisProps> = ({ doctorUid, patientUid }) => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [protesisType, setProtesisType] = useState<string>('Tipo de prótesis');
  const currentDate: string = new Date().toLocaleDateString();
  const currentCity: string = "Ciudad donde reside"; // Reemplaza con la ciudad actual si es necesario

  const normalTextStyle: React.CSSProperties = { color: 'black' };
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

    const getProtesisType = () => {
      const type = prompt('¿Cuál es el tipo de prótesis? (Ej: superior, inferior)', '');
      if (type) {
        setProtesisType(type);
      }
    };
    getProtesisType();

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
      <h2>CONSENTIMIENTO DE PROTESIS DENTAL REMOVIBLE</h2>

<div className="compact-row">
  <p style={normalTextStyle}><strong>Doctor:</strong> {doctor ? `${doctor.primerNombre} ${doctor.segundoNombre || ''} ${doctor.primerApellido} ${doctor.segundoApellido || ''}` : 'N/A'}</p>
  <p style={normalTextStyle}><strong>Fecha:</strong> {currentDate}</p>
  <p style={normalTextStyle}><strong>Ciudad:</strong> {currentCity}</p>
</div>

<div className="compact-row">
  <p style={normalTextStyle}><strong>Nombre del paciente:</strong> {patient?.primerNombre || 'N/A'} {patient?.segundoNombre || ''} {patient?.primerApellido || 'N/A'} {patient?.segundoApellido || ''}</p>
  <p style={normalTextStyle}><strong>Documento de Identidad:</strong> {patient?.identificacion || 'N/A'}</p>
  <p style={normalTextStyle}><strong>Prótesis dental:</strong> {protesisType}</p>
</div>
        <h2>Descripción del Procedimiento:</h2>
        <p style={normalTextStyle}>
          Usted tiene derecho a conocer el procedimiento al que va a ser sometido y las complicaciones más frecuentes que ocurren. Este documento intenta explicarle todas estas cuestiones, léalo atentamente y consulte todas las dudas que se le planteen. 
        </p>
        <p style={normalTextStyle}>
          A propósito declaro haber sido informado y haber comprendido acabadamente que el objeto del tratamiento que es reponer dientes ausentes a través de aparatos portadores de dientes artificiales que se sujetan a los naturales mediante dispositivos no rígido (ganchos) y a veces se asientan sobre el hueso cubierto de mucosa.
        </p>
        <p style={normalTextStyle}>
          Tratamiento alternativo: Puede ser una prótesis sobre implantes, que se descarta por ser demasiado costosa, o una prótesis fija.
        </p>
        <p style={normalTextStyle}>
          Aclaro que mi Odontólogo ha examinado mi boca debidamente. Que se me ha explicado otras alternativas a este tratamiento y que se ha estudiado y considerado estos métodos que se me informaron, siendo mi voluntad que se me realice el tratamiento objeto del presente consentimiento.
        </p>

        <h2>Limitaciones:</h2>
        <p style={normalTextStyle}>
          Al carecer de fijación mecánica al hueso, estos aparatos experimentan una cierta movilidad, más evidente al comer, sobre todo el inferior. Otra limitación es de carácter estético, debido a que según las indicaciones técnicas y mecánicas derivadas de la confección de prótesis removible en muchas ocasiones no será posible la reproducción de la posición de los dientes naturales.
        </p>
        <p style={normalTextStyle}>
          La duración de la prótesis removible es limitada por lo que deberá renovarse periódicamente.
        </p>

        <h2>Riesgos típicos:</h2>
        <ul style={normalTextStyle}>
          <li>Sensación extraña de ocupación.</li>
          <li>Más producción de saliva de lo normal.</li>
          <li>Disminución del sentido del gusto.</li>
          <li>Dificultades de pronunciación de ciertos sonidos.</li>
          <li>Es probable que se muerda fácilmente en las mejillas o lengua.</li>
          <li>Algunas molestias (dolor, inflación, ulceración) en las zonas donde apoyan las prótesis.</li>
          <li>Probablemente se muevan al comer, al menos inicialmente, por lo que deberá masticar de los dos lados.</li>
          <li>De no mantener una conducta de higiene y limpieza, es probable que cambio de color.</li>
        </ul>

        <h2>Consecuencias de no realizar el tratamiento:</h2>
        <ul style={normalTextStyle}>
          <li>Reabsorción ósea. (Pérdida del volumen del hueso de ambos maxilares).</li>
          <li>Problemas en la articulación de la mandíbula.</li>
          <li>Problemas en la digestión.</li>
          <li>Alteración en la pronunciación de las palabras y estética.</li>
          <li>Cambios en la mordida normal.</li>
          <li>Mayor movilidad de los dientes.</li>
          <li>Problemas de encía.</li>
          <li>Pérdida de los dientes presentes en boca.</li>
        </ul>

        <h2>Recomendaciones:</h2>
        <ul style={normalTextStyle}>
          <li>Los primeros días procure cerrar la boca y masticar con cuidado para no morderse y sobrecargar las encías.</li>
          <li>Inicialmente, mastique suavemente alimentos blandos y no pegajosos, pasando poco a poco a comer productos más consistentes.</li>
          <li>Para tratar heridas de mordeduras puede utilizar cicatrizantes.</li>
        </ul>

        <h2>Indicaciones:</h2>
        <ul style={normalTextStyle}>
          <li>Lavar la prótesis y la boca después de cada comida para evitar la formación de sarro.</li>
          <li>Limpie las partes metálicas con un hisopo embebido en alcohol, hasta que la superficie quede brillante.</li>
          <li>Quitarse la prótesis para dormir, para que los tejidos descansen.</li>
          <li>Mantener la prótesis en agua mientras esté fuera de la boca para evitar golpes y deformaciones.</li>
          <li>Masajear las encías para mejorar la circulación y prevenir en lo posible su reabsorción.</li>
          <li>Realizar revisiones cada seis meses para observar el estado de los dientes y mucosas, realizar adaptaciones para corregir desajustes provocados por el cambio de forma de los maxilares y posición de los dientes.</li>
          <li>Acudir a una consulta inmediata siempre que aparezcan heridas, llagas, dolor o inestabilidad de la prótesis.</li>
        </ul>

        <p style={normalTextStyle}>
          He leído las instrucciones de manejo, cuidado y mantenimiento que me ha entregado el Dr/a {doctor?.primerNombre || 'N/A'} {doctor?.segundoNombre || ''} {doctor?.primerApellido || 'N/A'} {doctor?.segundoApellido || ''} y he comprendido todas las explicaciones que se me han facilitado en un lenguaje claro y sencillo. He podido realizar todas las observaciones y se me han aclarado todas las dudas; por lo que estoy completamente de acuerdo con lo consignado en esta fórmula de consentimiento.
        </p>
        <p style={normalTextStyle}>
          Entiendo que la colocación de la prótesis no constituye el acto final del tratamiento, sino que es necesario un proceso de adaptación que puede exigir retoques, por lo que me comprometo a regresar a la próxima consulta.
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

export default ConsentimientoProtesis;
