import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import './NuevoPaciente.css';
import { addEvolucion } from './services/doctorService';

const NuevoPaciente = ({ doctorUid, onPatientAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    primerApellido: '',
    segundoApellido: '',
    primerNombre: '',
    segundoNombre: '',
    genero: '',
    tipoIdentificacion: '',
    identificacion: '',
    tipoUsuario: '',
    edad: '',
    fechaNacimiento: '',
    estadoCivil: '',
    codigoDepartamento: '',
    codigoMunicipio: '',
    zonaResidencia: '',
    celular: '',
    domicilio: '',
    ocupacion: '',
    responsable: '',
    celularResponsable: '',
    parentesco: '',
    acompanante: '',
    celularAcompanante: '',
    email: '',
    referidoPor: '',
    motivoConsulta: '',
    alarma: '',
    compromisoSistemico: '',
    medicacion: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Si el campo es la fecha de nacimiento, calcular la edad
    if (name === 'fechaNacimiento') {
      const edadCalculada = calcularEdad(value);
      setFormData({
        ...formData,
        fechaNacimiento: value,
        edad: edadCalculada
      });
    }
  };

  // Función para calcular la edad basada en la fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getFirestore();

    try {
      const newPatientRef = await addDoc(collection(db, `doctors/${doctorUid}/pacientes`), formData);
      setSuccess('Paciente registrado exitosamente');
      setError(null);
      
      const fechaHora = new Date().toLocaleString();
      const descripcionEvolucion = `${fechaHora} - Paciente ${formData.primerNombre} ${formData.primerApellido} registrado en el sistema.`;
      await addEvolucion(doctorUid, newPatientRef.id, descripcionEvolucion);

      const newPatient = { ...formData, id: newPatientRef.id };
      onPatientAdded(newPatient); // Llama al callback para actualizar la lista de pacientes

      setFormData({
        primerApellido: '',
        segundoApellido: '',
        primerNombre: '',
        segundoNombre: '',
        genero: '',
        tipoIdentificacion: '',
        identificacion: '',
        tipoUsuario: '',
        edad: '',
        fechaNacimiento: '',
        estadoCivil: '',
        codigoDepartamento: '',
        codigoMunicipio: '',
        zonaResidencia: '',
        celular: '',
        domicilio: '',
        ocupacion: '',
        responsable: '',
        celularResponsable: '',
        parentesco: '',
        acompanante: '',
        celularAcompanante: '',
        email: '',
        referidoPor: '',
        motivoConsulta: '',
        alarma: '',
        compromisoSistemico: '',
        medicacion: ''
      });
    } catch (error) {
      setError('Error al registrar el paciente');
      setSuccess(null);
    }
  };

  const handleCancel = () => {
    onCancel(); // Llama al callback para ocultar el formulario
  };

  return (
    <div className="nuevo-paciente-container">
      <h2>Nuevo Paciente</h2>
      <form onSubmit={handleSubmit}>
        <div className="inline-group">
          <div className="form-group">
            <label>Primer Apellido:</label>
            <input type="text" name="primerApellido" value={formData.primerApellido} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Segundo Apellido:</label>
            <input type="text" name="segundoApellido" value={formData.segundoApellido} onChange={handleInputChange} />
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label>Primer Nombre:</label>
            <input type="text" name="primerNombre" value={formData.primerNombre} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Segundo Nombre:</label>
            <input type="text" name="segundoNombre" value={formData.segundoNombre} onChange={handleInputChange} />
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label>Género:</label>
            <select name="genero" value={formData.genero} onChange={handleInputChange} required>
              <option value="">Seleccionar</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No definido">No definido</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tipo de Identificación:</label>
            <select name="tipoIdentificacion" value={formData.tipoIdentificacion} onChange={handleInputChange} required>
              <option value="">Seleccionar</option>
              <option value="CC">Cédula de ciudadanía</option>
              <option value="CE">Cédula de extranjería</option>
              <option value="CD">Carné diplomático</option>
              <option value="PA">Pasaporte</option>
              <option value="SC">Salvoconducto</option>
              <option value="PE">Permiso Especial de Permanencia</option>
              <option value="RC">Registro civil</option>
              <option value="TI">Tarjeta de identidad</option>
              <option value="CN">Certificado de nacido vivo</option>
              <option value="AS">Adulto sin identificar</option>
              <option value="MS">Menor sin identificar</option>
            </select>
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label>Identificación:</label>
            <input type="text" name="identificacion" value={formData.identificacion} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Tipo de Usuario:</label>
            <select name="tipoUsuario" value={formData.tipoUsuario} onChange={handleInputChange}>
              <option value="">Seleccionar</option>
              <option value="1">Contributivo</option>
              <option value="2">Subsidiado</option>
              <option value="3">Vinculado</option>
              <option value="4">Particular</option>
              <option value="5">Otro</option>
              <option value="6">Víctima con afiliación al Régimen Contributivo</option>
              <option value="7">Víctima con afiliación al Régimen subsidiado</option>
              <option value="8">Víctima no asegurado (Vinculado)</option>
            </select>
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label>Edad:</label>
            <input type="number" name="edad" value={formData.edad} onChange={handleInputChange} readOnly />
          </div>
          <div className="form-group">
            <label>Fecha de Nacimiento:</label>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} required />
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label>Estado Civil:</label>
            <select name="estadoCivil" value={formData.estadoCivil} onChange={handleInputChange}>
              <option value="">Seleccionar</option>
              <option value="Soltero">Soltero</option>
              <option value="Casado">Casado</option>
              <option value="Viuda">Viuda</option>
              <option value="Unión libre">Unión libre</option>
            </select>
          </div>
          <div className="form-group">
            <label>Código del Departamento:</label>
            <input type="text" name="codigoDepartamento" value={formData.codigoDepartamento} onChange={handleInputChange} />
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label>Código del Municipio:</label>
            <input type="text" name="codigoMunicipio" value={formData.codigoMunicipio} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Zona de Residencia:</label>
            <select name="zonaResidencia" value={formData.zonaResidencia} onChange={handleInputChange}>
              <option value="">Seleccionar</option>
              <option value="U">Urbana</option>
              <option value="R">Rural</option>
            </select>
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label>Celular:</label>
            <input type="tel" name="celular" value={formData.celular} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Domicilio y Lugar de Residencia:</label>
            <input type="text" name="domicilio" value={formData.domicilio} onChange={handleInputChange} />
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label>Ocupación:</label>
            <input type="text" name="ocupacion" value={formData.ocupacion} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Responsable:</label>
            <input type="text" name="responsable" value={formData.responsable} onChange={handleInputChange} />
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label>Celular del Responsable:</label>
            <input type="tel" name="celularResponsable" value={formData.celularResponsable} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Parentesco:</label>
            <input type="text" name="parentesco" value={formData.parentesco} onChange={handleInputChange} />
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label>Acompañante:</label>
            <input type="text" name="acompanante" value={formData.acompanante} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Celular del Acompañante:</label>
            <input type="tel" name="celularAcompanante" value={formData.celularAcompanante} onChange={handleInputChange} />
          </div>
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Referido por:</label>
            <input type="text" name="referidoPor" value={formData.referidoPor} onChange={handleInputChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Motivo de Consulta:</label>
          <textarea name="motivoConsulta" value={formData.motivoConsulta} onChange={handleInputChange} maxLength="2000" required></textarea>
        </div>
        <div className="form-group">
          <label>Alarma:</label>
          <textarea name="alarma" value={formData.alarma} onChange={handleInputChange} maxLength="2000"></textarea>
        </div>
        <div className="form-group">
          <label>Compromiso Sistémico:</label>
          <textarea name="compromisoSistemico" value={formData.compromisoSistemico} onChange={handleInputChange} maxLength="2000"></textarea>
        </div>
        <div className="form-group">
          <label>Medicación:</label>
          <textarea name="medicacion" value={formData.medicacion} onChange={handleInputChange} maxLength="1000"></textarea>
        </div>
        <button type="submit">Salvar datos de paciente nuevo</button>
        <button type="button" onClick={handleCancel}>Cancelar</button>
        <button type="button" onClick={() => setFormData({})}>Eliminar datos del paciente</button>
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </form>
    </div>
  );
};

export default NuevoPaciente;