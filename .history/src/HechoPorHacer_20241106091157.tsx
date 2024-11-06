import React from 'react';
import { Treatment } from '../types';

interface HechoPorHacerProps {
  treatments: Treatment[];
}

const HechoPorHacer: React.FC<HechoPorHacerProps> = ({ treatments }) => {
  return (
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
        {treatments.map((treatment, index) => (
          <tr key={index}>
            <td>{new Date(treatment.fecha).toLocaleDateString()}</td>
            <td>{treatment.diente}</td>
            <td>{treatment.superficie || 'N/A'}</td>
            <td>{treatment.nombre}</td>
            <td>{treatment.valor}</td>
            <td>{treatment.ejecutado ? 'Sí' : 'No'}</td>
            <td>{treatment.valorEjecutado}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HechoPorHacer;