import React from 'react';
import { Patient } from '../types';

interface PatientsListProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

const PatientsList: React.FC<PatientsListProps> = ({ patients, onSelectPatient }) => {
  return (
    <ul className="patients-list">
      {patients.map((patient) => (
        <li key={patient.uid} onClick={() => onSelectPatient(patient)}>
          {patient.primerNombre || 'N/A'} {patient.primerApellido || 'N/A'}
        </li>
      ))}
    </ul>
  );
};

export default PatientsList;