import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Importa Link
import { fetchHechoPorHacer, getDoctorByUid, getPatientByUid, getEvoluciones, updatePatientData, addEvolucion } from './services/doctorService';
import NuevoPaciente from './NuevoPaciente';
import Agenda from './Agenda';
import Odontograma from './Odontograma';
import EstadoDeCuentas from './EstadoDeCuentas';
import Prescripcion from './Prescripcion';
import HistoriaClinicaOral from './HistoriaClinicaOral';
import FacturaForm from './FacturaForm';
import RIPSForm from './RIPSForm';
import ConsentimientoButtons from './ConsentimientoButtons'; 
import './HistoriaClinica.css';

function HistoriaClinica() {
  const { doctorUid } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [evoluciones, setEvoluciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [hechoPorHacer, setHechoPorHacer] = useState([]);
  const [editedPatient, setEditedPatient] = useState(null);

  useEffect(() => {
    console.log('doctorUid:', doctorUid); // Debugging statement
    const fetchDoctorData = async () => {
      try {
        const doctorData = await getDoctorByUid(doctorUid);
        console.log('Doctor data:', doctorData); // Debugging statement
        if (doctorData) {
          setDoctor(doctorData);

          const patientPromises = doctorData.patients.map(async (patient) => {
            const patientData = await getPatientByUid(doctorUid, patient.id);
            return patientData;
          });

          const fetchedPatients = await Promise.all(patientPromises);
          setPatients(fetchedPatients);
          setSelectedPatient(fetchedPatients[0] || null);
          setEditedPatient(fetchedPatients[0] || null);
        } else {
          setError('No se encontraron datos del doctor');
        }
      } catch (error) {
        setError('Error al obtener datos del doctor');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorUid) {
      fetchDoctorData();
    } else {
      setError('El UID del doctor no está definido');
    }
  }, [doctorUid]);

  const fetchEvoluciones = async (patientUid) => {
    try {
      const evoluciones = await getEvoluciones(doctorUid, patientUid);
      setEvoluciones(evoluciones);
    } catch (error) {
      setError('Error al obtener la evolución del paciente.');
    }
  };

  const handlePatientAdded = async (newPatient) => {
    try {
      if (!newPatient.uid) {
        throw new Error('El nuevo paciente no tiene un UID válido.');
      }

      const descripcionEvolucion = `Paciente ingresado en fecha ${new Date().toLocaleDateString()} a la hora ${new Date().toLocaleTimeString()}. Datos básicos: Nombre: ${newPatient.primerNombre} ${newPatient.primerApellido}, Identificación: ${newPatient.uidentificacion}, Género: ${newPatient.genero}, Fecha de Nacimiento: ${newPatient.fechaNacimiento}.`;

      await addEvolucion(doctorUid, newPatient.uid, descripcionEvolucion);

      setPatients((prevPatients) => [...prevPatients, newPatient]);
      setSelectedPatient(newPatient);
      setEditedPatient(newPatient);
      setActiveTab('evolucion');
      await fetchEvoluciones(newPatient.uid);
    } catch (error) {
      console.error('Error al agregar evolución del nuevo paciente:', error);
    }
  };

  const handleCancelNewPatient = () => {
    setActiveTab(null);
  };

  const handleEvolucionDelPacienteClick = async () => {
    if (selectedPatient) {
      await fetchEvoluciones(selectedPatient.uid);
      setActiveTab('evolucion');
    } else {
      alert('Por favor, selecciona un paciente primero.');
    }
  };

  const handleHechoPorHacerClick = async () => {
    if (selectedPatient) {
      const treatments = await fetchHechoPorHacer(doctorUid, selectedPatient.uid);
      setHechoPorHacer(treatments);
      setActiveTab('hechoPorHacer');
    } else {
      alert('Por favor, selecciona un paciente primero.');
    }
  };

  const handleEditClick = () => {
    setActiveTab('editBasicData');
  };

  const handleCancelEdit = () => {
    setActiveTab(null);
  };

  const handleSaveEdit = async () => {
    try {
      await updatePatientData(doctorUid, editedPatient.uid, editedPatient);
      setSelectedPatient(editedPatient);
      setActiveTab(null);
    } catch (error) {
      console.error('Error al guardar los datos del paciente:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient({
      ...editedPatient,
      [name]: value,
    });
  };

  return (
    <div className="historia-clinica">
      <div className="globalnav-link-text-container">
        <ul>
          <li><button onClick={() => setActiveTab('agenda')}>Agenda</button></li>
          <li><button onClick={() => setActiveTab('newPatient')}>Agregar Paciente</button></li>
          <li><button onClick={() => setActiveTab('patientList')}>Lista de pacientes</button></li>
          <li><button onClick={() => setActiveTab('basicData')}>Datos básicos</button></li>
          <li><button onClick={() => setActiveTab('historiaClinicaOral')}>Historia clínica oral</button></li>
          <li><button onClick={() => setActiveTab('odontograma')}>Odontograma</button></li>
          <li><button onClick={() => setActiveTab('estadoDeCuentas')}>Estado de cuentas</button></li>
          <li><button onClick={() => setActiveTab('facturaForm')}>FEV</button></li>
          <li><button onClick={() => setActiveTab('RIPSForm')}>RIPS</button></li>
          <li><button onClick={handleHechoPorHacerClick}>Hecho por hacer</button></li>
          <li><button onClick={handleEvolucionDelPacienteClick}>Evolución del paciente</button></li>
          <li><button onClick={() => setActiveTab('prescripcion')}>Prescripciones del paciente</button></li>
          <li><button onClick={() => setActiveTab('consentimientos')}>Consentimientos</button></li>
        </ul>
      </div>

      {activeTab === 'basicData' && selectedPatient && (
        <div className="basic-data">
          <h3>Datos del Paciente:</h3>
          {selectedPatient ? (
            <>
              <p>Nombre: {selectedPatient.primerNombre || 'N/A'} {selectedPatient.segundoNombre || 'N/A'} {selectedPatient.primerApellido || 'N/A'} {selectedPatient.segundoApellido || 'N/A'}</p>
              <p>Identificación: {selectedPatient.identificacion || 'N/A'}</p>
              <p>Género: {selectedPatient.genero || 'N/A'}</p>
              <p>Fecha de Nacimiento: {selectedPatient.fechaNacimiento || 'N/A'}</p>
              <p>Edad: {selectedPatient.edad || 'N/A'} años</p>
              <p>Estado Civil: {selectedPatient.estadoCivil || 'N/A'}</p>
              <p>Celular: {selectedPatient.celular || 'N/A'}</p>
              <p>Domicilio: {selectedPatient.domicilio || 'N/A'}</p>
              <p>Ocupación: {selectedPatient.ocupacion || 'N/A'}</p>
              <p>Motivo de Consulta: {selectedPatient.motivoConsulta || 'N/A'}</p>
              <button onClick={handleEditClick}>Editar Datos Básicos</button>
            </>
          ) : (
            <p>No se ha seleccionado ningún paciente.</p>
          )}
        </div>
      )}

      {hechoPorHacer.length > 0 && activeTab === 'hechoPorHacer' && (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Diente</th>
              <th>Superficie</th>
              <th>Tratamiento</th>
              <th>Valor total</th>
              <th>Ejecutado</th>
              <th>Valor ejecutado</th>
              <th>Evolución de tratamiento</th>
            </tr>
          </thead>
          <tbody>
            {hechoPorHacer.map((treatment, index) => (
              <tr key={index}>
                <td>{new Date(treatment.fecha).toLocaleDateString()}</td>
                <td>{treatment.diente}</td>
                <td>{treatment.superficie || 'N/A'}</td>
                <td>{treatment.nombre}</td>
                <td>{treatment.valor}</td>
                <td>{treatment.ejecutado}</td>
                <td>{treatment.valorEjecutado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'consentimientos' && (
        <div className="consentimientos-submenu">
          <ul>
            <li><button onClick={() => setActiveTab('consentimientoOperatoria')}>Consentimiento operatoria</button></li>
            <li><button onClick={() => setActiveTab('consentimientoCorona')}>Consentimiento corona</button></li>
            <li><button onClick={() => setActiveTab('consentimientoExodoncia')}>Consentimiento exodoncia</button></li>
            <li><button onClick={() => setActiveTab('consentimientoEndodoncia')}>Consentimiento endodoncia</button></li>
            <li><button onClick={() => setActiveTab('consentimientoImplante')}>Consentimiento implante</button></li>
            <li><button onClick={() => setActiveTab('consentimientoProtesis')}>Consentimiento prótesis</button></li>
            <li><button onClick={() => setActiveTab('consentimientoOrtodoncia')}>Consentimiento ortodoncia</button></li>
          </ul>
        </div>
      )}

      {activeTab === 'odontograma' && (
        <Odontograma
          doctorUid={doctorUid}
          patientUid={selectedPatient?.uid}
        />
      )}

      {activeTab === 'estadoDeCuentas' && (
        <EstadoDeCuentas
          doctorUid={doctorUid}
          patientUid={selectedPatient?.uid}
        />
      )}
      {activeTab === 'historiaClinicaOral' && (
        <HistoriaClinicaOral
          doctorUid={doctorUid}
          patientUid={selectedPatient?.uid}
        />
      )}
      {activeTab === 'newPatient' && (
        <NuevoPaciente
          doctorUid={doctorUid}
          onPatientAdded={handlePatientAdded}
          onCancel={handleCancelNewPatient}
        />
      )}

      {activeTab === 'facturaForm' && (
        <FacturaForm
          patient={selectedPatient}
          treatments={[]}
        />
      )}

      {activeTab === 'RIPSForm' && (
        <RIPSForm
          patient={selectedPatient}
          treatments={[]}
        />
      )}

      {activeTab === 'evolucion' && evoluciones.length > 0 && (
        <div className="evolucion-paciente">
          <h3>Evolución del Paciente</h3>
          <ul>
            {evoluciones.map((evolucion) => (
              <li key={evolucion.uid}>
                <p>{evolucion.fechaHora}</p>
                <p>{evolucion.descripcion}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'agenda' && (
        <Agenda
          doctor={doctor}
          selectedPatient={selectedPatient}
        />
      )}

      {activeTab === 'patientList' && (
        <ul className="patients-list">
         {patients.map((patient) => (
  <li key={patient.uid} onClick={() => {
    console.log('Selected patient:', patient);
    setSelectedPatient(patient);
  }}>
    {patient.primerNombre || 'N/A'} {patient.primerApellido || 'N/A'}
  </li>
))}
        </ul>
      )}

      {activeTab === 'editBasicData' && (
        <div className="edit-basic-data-form">
          <h3>Editar Datos del Paciente:</h3>
          <form>
            <div>
              <label>Nombre:</label>
              <input
                type="text"
                name="primerNombre"
                value={editedPatient?.primerNombre || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Segundo Nombre:</label>
              <input
                type="text"
                name="segundoNombre"
                value={editedPatient?.segundoNombre || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Primer Apellido:</label>
              <input
                type="text"
                name="primerApellido"
                value={editedPatient?.primerApellido || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Segundo Apellido:</label>
              <input
                type="text"
                name="segundoApellido"
                value={editedPatient?.segundoApellido || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Celular:</label>
              <input
                type="text"
                name="celular"
                value={editedPatient?.celular || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={editedPatient?.direccion || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Fecha de Nacimiento:</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={editedPatient?.fechaNacimiento || ''}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Historia Médica:</label>
              <textarea
                name="historiaMedica"
                value={editedPatient?.historiaMedica || ''}
                onChange={handleInputChange}
              />
            </div>
            <button type="button" onClick={handleSaveEdit}>Guardar Cambios</button>
            <button type="button" onClick={handleCancelEdit}>Cancelar</button>
          </form>
        </div>
      )}

      {activeTab === 'prescripcion' && (
        <Prescripcion
          doctorUid={doctorUid}
          patientUid={selectedPatient?.uid}
        />
      )}
      
      {loading ? (
        <p>Cargando datos del doctor...</p>
      ) : error ? (
        <p>{error}</p>
      ) : null}


<div>
      <h4>Historia Clínica Odontológica</h4>
      {selectedPatient && (
        <>
          <ConsentimientoButtons doctorUid={doctorUid} patientUid={selectedPatient.uid} />
        </>
      )}
      {error ? (
        <p>{error}</p>
      ) : null}
    </div>
    </div>
  );
}

export default HistoriaClinica;