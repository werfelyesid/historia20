import React, { useState, useEffect } from 'react';
import { getPreciosTratamientos, actualizarPrecioTratamiento } from './services/precioService'; // Servicios para obtener y actualizar precios
import './GestionPrecios.css';

const GestionPrecios = () => {
  const [precios, setPrecios] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrecios = async () => {
      try {
        const preciosData = await getPreciosTratamientos();
        setPrecios(preciosData);
      } catch (error) {
        setError('Error al cargar los precios');
      } finally {
        setLoading(false);
      }
    };

    fetchPrecios();
  }, []);

  const handlePrecioChange = (categoria, codigo, nuevoPrecio) => {
    setPrecios((prevPrecios) => ({
      ...prevPrecios,
      [categoria]: {
        ...prevPrecios[categoria],
        [codigo]: nuevoPrecio,
      },
    }));
  };

  const handleGuardar = async () => {
    try {
      await actualizarPrecioTratamiento(precios);
      alert('Precios actualizados con éxito');
    } catch (error) {
      alert('Error al actualizar los precios');
    }
  };

  if (loading) return <p>Cargando precios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="gestion-precios">
      <h2>Gestión de Precios de Tratamientos</h2>
      {Object.keys(precios).map((categoria) => (
        <div key={categoria} className="categoria">
          <h3>{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h3>
          <ul>
            {Object.keys(precios[categoria]).map((codigo) => (
              <li key={codigo}>
                <span>{codigo} - {precios[categoria][codigo].nombre}</span>
                <input
                  type="number"
                  value={precios[categoria][codigo].precio}
                  onChange={(e) => handlePrecioChange(categoria, codigo, e.target.value)}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={handleGuardar}>Guardar Cambios</button>
    </div>
  );
};

export default GestionPrecios;
