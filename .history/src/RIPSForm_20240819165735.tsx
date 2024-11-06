// src/RIPSForm.js
import React, { useState } from 'react';
import { saveAs } from 'file-saver';

function RIPSForm({ patient, treatments }) {
  const [ripsData, setRipsData] = useState({
    codigoProcedimiento: '',
    descripcionProcedimiento: '',
    diagnostico: '',
    valorProcedimiento: '',
    // Agrega más campos según lo requerido
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRipsData({
      ...ripsData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generar el archivo JSON con los datos del formulario
    const ripsJSON = {
      paciente: {
        id: patient?.id,
        nombre: `${patient?.primerNombre} ${patient?.primerApellido}`,
        // Otros datos del paciente
      },
      procedimientos: treatments.map((treatment) => ({
        codigo: ripsData.codigoProcedimiento,
        descripcion: ripsData.descripcionProcedimiento,
        diagnostico: ripsData.diagnostico,
        valor: ripsData.valorProcedimiento,
        // Otros detalles del tratamiento
      })),
      // Agrega más estructuras según lo requerido
    };

    // Convertir a JSON y guardar
    const blob = new Blob([JSON.stringify(ripsJSON, null, 2)], { type: 'application/json' });
    saveAs(blob, `RIPS_${patient?.primerNombre}_${patient?.primerApellido}.json`);
  };

  return (
    <div>
      <h3>Formulario para Generar RIPS - Odontología</h3>
      <p>Paciente: {patient?.primerNombre} {patient?.primerApellido}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Código del Procedimiento:</label>
          <input type="text" name="codigoProcedimiento" value={ripsData.codigoProcedimiento} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Descripción del Procedimiento:</label>
          <input type="text" name="descripcionProcedimiento" value={ripsData.descripcionProcedimiento} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Diagnóstico:</label>
          <input type="text" name="diagnostico" value={ripsData.diagnostico} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Valor del Procedimiento:</label>
          <input type="text" name="valorProcedimiento" value={ripsData.valorProcedimiento} onChange={handleInputChange} required />
        </div>
        {/* Añade más campos según sea necesario */}
        <button type="submit">Generar RIPS</button>
      </form>
    </div>
  );
}

export default RIPSForm;
