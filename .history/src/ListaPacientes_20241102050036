import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientsByDoctorUid } from './services/doctorService';

interface Patient {
  id: string;
  primerNombre: string;
  primerApellido: string;
  // Agrega otros campos necesarios aquí
}

const ListaPacientes: React.FC<{ doctorUid: string }> = ({ doctorUid }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      const patientsList = await getPatientsByDoctorUid(doctorUid);
      setPatients(patientsList);
    };

    fetchPatients();
  }, [doctorUid]);

  const handlePatientsClick = (patientUid: string) => {
    navigate(`/odontograma/${doctorUid}/${patientUid}`);
  };

  return (
    <div>
      <h1>Lista de Pacientes</h1>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id} onClick={() => handlePatientsClick(patient.id)}>
            {patient.primerNombre} {patient.primerApellido}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaPacientes;