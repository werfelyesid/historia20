import React from 'react';
import { tratamientos } from './tratamientos';

const TratamientoMenu = ({
  activeTratamientoMenu,
  toggleMenu,
  handleTratamientoSelection,
  precios,
  handlePrecioChange,
  guardarPrecios
}) => {
  return (
    <div className="tratamiento">
    <h5>Tratamiento</h5>
    <button onClick={() => toggleMenu('consultas', 'tratamiento')}>Consultas</button>
    {activeTratamientoMenu === 'consultas' && (
      <ul className="tratamiento-menu">
        {tratamientos.consultas.map((item, index) => (
          <li key={index}>
            <button onClick={() => handleTratamientoSelection(item, 'consultas')}>
              <span>{item.codigo}</span> - <span>{item.nombre}</span>
            </button>
          </li>
        ))}
      </ul>
    )}
    <button onClick={() => toggleMenu('superficie', 'tratamiento')}>Tratamiento Superficie</button>
    {activeTratamientoMenu === 'superficie' && (
      <ul className="tratamiento-menu">
        {tratamientos.superficie.map((item, index) => (
          <li key={index}>
            <button onClick={() => handleTratamientoSelection(item, 'superficie')}>
              <span>{item.codigo}</span> - <span>{item.nombre}</span>
            </button>
            <input
              type="number"
              value={precios[item.codigo] || ''}
              onChange={(e) => handlePrecioChange(item.codigo, e.target.value)}
              placeholder="Precio"
            />
          </li>
        ))}
      </ul>
    )}
    <button onClick={() => toggleMenu('diente', 'tratamiento')}>Tratamiento Diente</button>
    {activeTratamientoMenu === 'diente' && (
      <ul className="tratamiento-menu">
        {tratamientos.diente.map((item, index) => (
          <li key={index}>
            <button onClick={() => handleTratamientoSelection(item, 'diente')}>
              <span>{item.codigo}</span> - <span>{item.nombre}</span>
            </button>
            <input
              type="number"
              value={precios[item.codigo] || ''}
              onChange={(e) => handlePrecioChange(item.codigo, e.target.value)}
              placeholder="Precio"
            />
          </li>
        ))}
      </ul>
    )}
    <button onClick={() => toggleMenu('boca', 'tratamiento')}>Tratamiento Boca</button>
    {activeTratamientoMenu === 'boca' && (
      <ul className="tratamiento-menu">
        {tratamientos.boca.map((item, index) => (
          <li key={index}>
            <button onClick={() => handleTratamientoSelection(item, 'boca')}>
              <span>{item.codigo}</span> - <span>{item.nombre}</span>
            </button>
            <input
              type="number"
              value={precios[item.codigo] || ''}
              onChange={(e) => handlePrecioChange(item.codigo, e.target.value)}
              placeholder="Precio"
            />
          </li>
        ))}
      </ul>
    )}
    <button onClick={() => toggleMenu('imagenologia', 'tratamiento')}>Imagenología</button>
    {activeTratamientoMenu === 'imagenologia' && (
      <ul className="tratamiento-menu">
        {tratamientos.imagenologia.map((item, index) => (
          <li key={index}>
            <button onClick={() => handleTratamientoSelection(item, 'imagenologia')}>
              <span>{item.codigo}</span> - <span>{item.nombre}</span>
            </button>
            <input
              type="number"
              value={precios[item.codigo] || ''}
              onChange={(e) => handlePrecioChange(item.codigo, e.target.value)}
              placeholder="Precio"
            />
          </li>
        ))}
      </ul>
    )}
    <button onClick={guardarPrecios}>Guardar Precios</button>
  </div>
  );
};

export { TratamientoMenu };
