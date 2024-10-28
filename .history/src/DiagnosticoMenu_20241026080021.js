import React from 'react';
import { diagnosticosSuperficie, diagnosticosDiente, diagnosticosBoca } from './Diagnosticos';

const DiagnosticoMenu = ({ activeDiagnosticoMenu, toggleMenu, handleDiagnosticoSelection }) => {
  let diagnosticos = [];

  if (activeDiagnosticoMenu === 'superficie') {
    diagnosticos = diagnosticosSuperficie;
  } else if (activeDiagnosticoMenu === 'diente') {
    diagnosticos = diagnosticosDiente;
  } else if (activeDiagnosticoMenu === 'boca') {
    diagnosticos = diagnosticosBoca;
  }

  return (
    <div className="diagnostico">
      <h5>Diagnóstico</h5>
      <button onClick={() => toggleMenu('superficie', 'diagnostico')}>Diagnóstico Superficie</button>
      <button onClick={() => toggleMenu('diente', 'diagnostico')}>Diagnóstico Diente</button>
      <button onClick={() => toggleMenu('boca', 'diagnostico')}>Diagnóstico Boca</button>
      {activeDiagnosticoMenu && (
        <ul className="diagnostico-menu">
          {diagnosticos.map((item, index) => (
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

export default DiagnosticoMenu;