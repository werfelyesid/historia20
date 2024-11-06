import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface FormData {
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  documentoPaciente: string;
  tipoUsuario: string;
  nombreMedicamento: string;
  concentracionForma: string;
  viaAdministracion: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  cantidadUnidades: string;
  indicaciones: string;
  vigencia: string;
  nombreDoctor: string;
  registroProfesional: string;
  fecha: string;
}

interface Params {
  doctorUid: string;
  patientUid: string;
}

const Prescripcion: React.FC = () => {
  const { doctorUid, patientUid } = useParams<Params>(); // Obtener los parámetros de la URL
  const [formData, setFormData] = useState<FormData>({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    documentoPaciente: '',
    tipoUsuario: '',
    nombreMedicamento: '',
    concentracionForma: '',
    viaAdministracion: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    cantidadUnidades: '',
    indicaciones: '',
    vigencia: 'Treinta días a partir de la fecha de expedición', // Valor por defecto
    nombreDoctor: '',
    registroProfesional: '',
    fecha: ''
  });

  const auth = getAuth();

  useEffect(() => {
    const fetchPatientData = async () => {
      if (doctorUid && patientUid) {
        try {
          const patientDocRef = doc(db, 'doctors', doctorUid, 'pacientes', patientUid);
          const patientDoc = await getDoc(patientDocRef);
          if (patientDoc.exists()) {
            const patientData = patientDoc.data();
            setFormData((prevData) => ({
              ...prevData,
              primerNombre: patientData.primerNombre,
              segundoNombre: patientData.segundoNombre || '',
              primerApellido: patientData.primerApellido,
              segundoApellido: patientData.segundoApellido || '',
              documentoPaciente: patientData.identificacion,
              tipoUsuario: patientData.tipoUsuario || '',
            }));
          }
        } catch (error) {
          console.error('Error al obtener datos del paciente:', error);
        }
      }
    };

    const fetchDoctorData = async () => {
      const user = auth.currentUser;
      if (user && doctorUid) {
        try {
          const doctorDocRef = doc(db, 'doctors', doctorUid);
          const doctorDoc = await getDoc(doctorDocRef);
          if (doctorDoc.exists()) {
            const doctorData = doctorDoc.data();
            setFormData((prevData) => ({
              ...prevData,
              nombreDoctor: doctorData.name,
              registroProfesional: doctorData.registroProfesional,
              fecha: new Date().toISOString().split('T')[0]
            }));
          }
        } catch (error) {
          console.error('Error al obtener datos del doctor:', error);
        }
      }
    };

    fetchPatientData();
    fetchDoctorData();
  }, [doctorUid, patientUid, auth]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const timestamp = new Date().toISOString();
      const prescriptionDocRef = doc(db, 'doctors', doctorUid, 'pacientes', patientUid, 'prescripcion', timestamp);

      // Guardar la prescripción en Firestore
      await setDoc(prescriptionDocRef, formData);
      console.log('Prescripción guardada en Firestore:', formData);

      // Añadir resumen de la prescripción a la evolución del paciente
      const resumen = `Fecha: ${formData.fecha}, Hora: ${timestamp.split('T')[1].split('.')[0]}, Medicamento: ${formData.nombreMedicamento}, Presentación: ${formData.concentracionForma}, Dosis: ${formData.dosis}, Frecuencia: ${formData.frecuencia}`;

      const evolucionesCollectionRef = collection(db, 'doctors', doctorUid, 'pacientes', patientUid, 'evoluciones');
      await addDoc(evolucionesCollectionRef, { descripcion: resumen, fechaHora: timestamp });

      console.log('Evolución actualizada con el resumen de la prescripción:', resumen);
    } catch (error) {
      console.error('Error al guardar la prescripción y actualizar la evolución:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="prescription-form-container" style={{ fontSize: '12px' }}>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden; /* Oculta todos los elementos en la página */
            }
            .prescription-form-container, .prescription-form-container * {
              visibility: visible; /* Solo muestra la prescripción */
            }
            .prescription-form-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            /* Oculta el botón de imprimir */
            button {
              display: none !important;
            }
          }
        `}
      </style>
      <h2 style={{ fontSize: '16px' }}>Prescripción Médica</h2>
      <button onClick={handlePrint} style={{ fontSize: '12px' }}>Imprimir</button>
      <form onSubmit={handleSubmit} className="prescription-form">
        {/* Agrupando los campos en una sola línea con diferentes proporciones */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 2 }}>
            <label>Paciente:</label>
            <input
              type="text"
              name="primerNombre"
              value={formData.primerNombre}
              onChange={handleChange}
              readOnly
              style={{ width: '100%' }}
            />
            <input
              type="text"
              name="segundoNombre"
              value={formData.segundoNombre}
              onChange={handleChange}
              readOnly
              style={{ width: '100%' }}
            />
            <input
              type="text"
              name="primerApellido"
              value={formData.primerApellido}
              onChange={handleChange}
              readOnly
              style={{ width: '100%' }}
            />
            <input
              type="text"
              name="segundoApellido"
              value={formData.segundoApellido}
              onChange={handleChange}
              readOnly
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Identificación:</label>
            <input
              type="text"
              name="documentoPaciente"
              value={formData.documentoPaciente}
              onChange={handleChange}
              readOnly
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Tipo de Usuario:</label>
            <input
              type="text"
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        {/* Resto de los campos */}
        <div>
          <label>Nombre del Medicamento :</label>
          <input
            type="text"
            name="nombreMedicamento"
            value={formData.nombreMedicamento}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Concentración y Forma Farmacéutica:</label>
          <input
            type="text"
            name="concentracionForma"
            value={formData.concentracionForma}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Vía de Administración:</label>
          <input
            type="text"
            name="viaAdministracion"
            value={formData.viaAdministracion}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Dosis:</label>
          <input
            type="text"
            name="dosis"
            value={formData.dosis}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Frecuencia de Administración:</label>
          <input
            type="text"
            name="frecuencia"
            value={formData.frecuencia}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Duración del Tratamiento:</label>
          <input
            type="text"
            name="duracion"
            value={formData.duracion}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Cantidad Total de Unidades:</label>
          <input
            type="text"
            name="cantidadUnidades"
            value={formData.cantidadUnidades}
            onChange={handleChange}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Indicaciones:</label>
          <textarea
            name="indicaciones"
            value={formData.indicaciones}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Vigencia de la Prescripción:</label>
          <input
            type="text"
            name="vigencia"
            value={formData.vigencia}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Nombre del Doctor:</label>
          <input
            type="text"
            name="nombreDoctor"
            value={formData.nombreDoctor}
            onChange={handleChange}
            readOnly
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Registro Profesional:</label>
          <input
            type="text"
            name="registroProfesional"
            value={formData.registroProfesional}
            onChange={handleChange}
            readOnly
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            readOnly
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" style={{ fontSize: '12px' }}>Guardar Prescripción</button>
      </form>
      <button onClick={handlePrint} style={{ fontSize: '12px' }}>Imprimir</button>
      <Link to={`/historia-clinica/${doctorUid}/${patientUid}`}>
        <button>Regresar a Historia Clínica</button>
      </Link>
    </div>
  );
};

export default Prescripcion;