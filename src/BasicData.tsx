import React from 'react';
import { Patient } from './types'; // Asegúrate de que la ruta sea correcta

interface BasicDataProps {
  patient: Patient;
  onEditClick: () => void;
}

const BasicData: React.FC<BasicDataProps> = ({ patient, onEditClick }) => {
  return (
    <div className="basic-data">
      <h3>Datos del Paciente:</h3>
      <p>Nombre: {patient.primerNombre || 'N/A'} {patient.segundoNombre || ''} {patient.primerApellido || 'N/A'} {patient.segundoApellido || ''}</p>
      <p>Identificación: {patient.identificacion || 'N/A'}</p>
      <p>Género: {patient.genero || 'N/A'}</p>
      <p>Fecha de Nacimiento: {patient.fechaNacimiento || 'N/A'}</p>
      <p>Edad: {patient.edad || 'N/A'} años</p>
      <p>Estado Civil: {patient.estadoCivil || 'N/A'}</p>
      <p>Celular: {patient.celular || 'N/A'}</p>
      <p>Domicilio: {patient.domicilio || 'N/A'}</p>
      <p>Ocupación: {patient.ocupacion || 'N/A'}</p>
      <p>Motivo de Consulta: {patient.motivoConsulta || 'N/A'}</p>
      <button onClick={onEditClick}>Editar Datos Básicos</button>
    </div>
  );
};

export default BasicData;