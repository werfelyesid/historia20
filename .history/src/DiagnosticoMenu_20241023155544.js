import React from 'react';
import { diagnosticos } from './Diagnosticos';

const DiagnosticoMenu = ({ activeDiagnosticoMenu, toggleMenu, handleDiagnosticoSelection }) => {
  return (
    <div className="diagnostico">
      <h5>Diagnóstico</h5>
      <button onClick={() => toggleMenu('superficie', 'diagnostico')}>Diagnóstico Superficie</button>
      {activeDiagnosticoMenu === 'superficie' && (
        <ul className="diagnostico-menu">
          {diagnosticos.superficie.map((item, index) => (
            <li key={index}>
              <button onClick={() => handleDiagnosticoSelection(item)}>
                <span>{item.codigo}</span> - <span>{item.nombre}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => toggleMenu('diente', 'diagnostico')}>Diagnóstico Diente</button>
      {activeDiagnosticoMenu === 'diente' && (
        <ul className="diagnostico-menu">
          {diagnosticos.diente.map((item, index) => (
            <li key={index}>
              <button onClick={() => handleDiagnosticoSelection(item)}>
                <span>{item.codigo}</span> - <span>{item.nombre}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => toggleMenu('boca', 'diagnostico')}>Diagnóstico Boca</button>
      {activeDiagnosticoMenu === 'boca' && (
        <ul className="diagnostico-menu">
          {diagnosticos.boca.map((item, index) => (
            <li key={index}>
              <button onClick={() => handleDiagnosticoSelection(item)}>
                <span>{item.codigo}</span> - <span>{item.nombre}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Exportación nombrada
export { DiagnosticoMenu };
