import React from 'react';
import { Patient } from '../types';

interface EditBasicDataFormProps {
  patient: Patient;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditBasicDataForm: React.FC<EditBasicDataFormProps> = ({ patient, onChange, onSave, onCancel }) => {
  return (
    <div className="edit-basic-data-form">
      <h3>Editar Datos del Paciente:</h3>
      <form>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="primerNombre"
            value={patient.primerNombre || ''}
            onChange={onChange}
          />
        </div>
        <div>
          <label>Segundo Nombre:</label>
          <input
            type="text"
            name="segundoNombre"
            value={patient.segundoNombre || ''}
            onChange={onChange}
          />
        </div>
        <div>
          <label>Primer Apellido:</label>
          <input
            type="text"
            name="primerApellido"
            value={patient.primerApellido || ''}
            onChange={onChange}
          />
        </div>
        <div>
          <label>Segundo Apellido:</label>
          <input
            type="text"
            name="segundoApellido"
            value={patient.segundoApellido || ''}
            onChange={onChange}
          />
        </div>
        <div>
          <label>Celular:</label>
          <input
            type="text"
            name="celular"
            value={patient.celular || ''}
            onChange={onChange}
          />
        </div>
        <div>
          <label>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={patient.direccion || ''}
            onChange={onChange}
          />
        </div>
        <div>
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={patient.fechaNacimiento || ''}
            onChange={onChange}
          />
        </div>
        <div>
          <label>Historia Médica:</label>
          <textarea
            name="historiaMedica"
            value={patient.historiaMedica || ''}
            onChange={onChange}
          />
        </div>
        <button type="button" onClick={onSave}>Guardar Cambios</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditBasicDataForm;