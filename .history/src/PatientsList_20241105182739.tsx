import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientsByDoctorUid } from './services/doctorService';

interface Patient {
  id: string;
  primerNombre: string;
  primerApellido: string;
  // Agrega otros campos necesarios aquí
}

const PatientsList: React.FC<{ doctorUid: string }> = ({ doctorUid }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsList = await getPatientsByDoctorUid(doctorUid);
        setPatients(patientsList);
      } catch (error) {
        console.error('Error al obtener la lista de pacientes:', error);
      }
    };

    fetchPatients();
  }, [doctorUid]);

  const handlePatientClick = (patientId: string) => {
    navigate(`/historia-clinica/${doctorUid}/${patientId}`);
  };

  return (
    <div>
      <h2>Lista de Pacientes</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id} onClick={() => handlePatientClick(patient.id)}>
            {patient.primerNombre} {patient.primerApellido}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientsList;