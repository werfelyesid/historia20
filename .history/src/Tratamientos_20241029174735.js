import React, { useState } from 'react';
export const tratamientosSuperficie = [
    { codigo: '232102', nombre: 'OBTURACIÓN DENTAL CON RESINA DE FOTOCURADO', tipo: 'superficie' },
    { codigo: '232101', nombre: 'OBTURACIÓN DENTAL CON AMALGAMA', tipo: 'superficie' },
    { codigo: '997105', nombre: 'APLICACIÓN DE RESINA PREVENTIVA', tipo: 'superficie' },
    { codigo: '997106', nombre: 'APLICACIÓN DE RESINA PREVENTIVA MÁS SELLANTE', tipo: 'superficie' },
    { codigo: '232103', nombre: 'OBTURACIÓN DENTAL CON IONÓMERO DE VIDRIO', tipo: 'superficie' },
    { codigo: '232401', nombre: 'RECONSTRUCCIÓN DE ÁNGULO INCISAL CON RESINA DE FOTOCURADO', tipo: 'superficie' },
    { codigo: '232402', nombre: 'RECONSTRUCCIÓN DE TERCIO INCISAL CON RESINA DE FOTOCURADO', tipo: 'superficie' },
  ];
  export const tratamientosDiente = [
    { codigo: '230102', nombre: 'EXODONCIA DE DIENTE PERMANENTE MULTIRRADICULAR', tipo: 'diente' },
    { codigo: '230101', nombre: 'EXODONCIA DE DIENTE PERMANENTE UNIRRADICULAR', tipo: 'diente' },
    { codigo: '230201', nombre: 'EXODONCIA DE DIENTE TEMPORAL UNIRRADICULAR', tipo: 'diente' },
    { codigo: '230202', nombre: 'EXODONCIA DE DIENTE TEMPORAL MULTIRRADICULAR', tipo: 'diente' },
    { codigo: '237301', nombre: 'TERAPIA DE CONDUCTO RADICULAR EN DIENTE UNIRRADICULAR', tipo: 'diente' },
    { codigo: '237302', nombre: 'TERAPIA DE CONDUCTO RADICULAR EN DIENTE BIRRADICULAR', tipo: 'diente' },
    { codigo: '237303', nombre: 'TERAPIA DE CONDUCTO RADICULAR EN DIENTE MULTIRRADICULAR', tipo: 'diente' },
    { codigo: '231100', nombre: 'EXODONCIA QUIRÚRGICA UNIRRADICULAR SOD', tipo: 'diente' },
    { codigo: '231200', nombre: 'EXODONCIA QUIRÚRGICA MULTIRRADICULAR SOD', tipo: 'diente' },
    { codigo: '237102', nombre: 'PULPOTOMÍA', tipo: 'diente' },
    { codigo: '237103', nombre: 'PULPECTOMÍA', tipo: 'diente' },
    { codigo: '237201', nombre: 'APEXIFICACIÓN (INDUCCIÓN DE APEXOGÉNESIS)', tipo: 'diente' },
    { codigo: '237203', nombre: 'RECUBRIMIENTO PULPAR DIRECTO', tipo: 'diente' },
    { codigo: '237304', nombre: 'TERAPIA DE CONDUCTO RADICULAR EN DIENTE TEMPORAL UNIRRADICULAR', tipo: 'diente' },
    { codigo: '237305', nombre: 'TERAPIA DE CONDUCTO RADICULAR EN DIENTE TEMPORAL MULTIRRADICULAR', tipo: 'diente' },
    { codigo: '237307', nombre: 'DESOBTURACIÓN DE CONDUCTO RADICULAR', tipo: 'diente' },
    { codigo: '234205', nombre: 'INSERCIÓN DE RETENEDOR INTRARRADICULAR', tipo: 'diente' },
    { codigo: '234201', nombre: 'COLOCACIÓN O INSERCIÓN DE PRÓTESIS FIJA CADA UNIDAD (PILAR Y PÓNTICOS)', tipo: 'diente' },
    { codigo: '233200', nombre: 'RESTAURACIÓN DE DIENTES MEDIANTE INCRUSTACIÓN NO METÁLICA', tipo: 'diente' },
    { codigo: '231301', nombre: 'EXODONCIA DE INCLUIDO EN POSICIÓN ECTÓPICA CON ABORDAJE INTRAORAL', tipo: 'diente' },
    { codigo: '231302', nombre: 'EXODONCIA DE INCLUIDO EN POSICIÓN ECTÓPICA CON ABORDAJE EXTRAORAL', tipo: 'diente' },
    { codigo: '249100', nombre: 'CONTROL DE HEMORRAGIA DENTAL POSQUIRÚRGICA SOD', tipo: 'diente' },
    { codigo: '235100', nombre: 'REIMPLANTE DE DIENTE', tipo: 'diente' },
    { codigo: '240100', nombre: 'OPERCULECTOMÍA', tipo: 'diente' },
    { codigo: '243400', nombre: 'GINGIVECTOMÍA SOD', tipo: 'diente' },
    { codigo: '243501', nombre: 'CUÑA DISTAL', tipo: 'diente' },
    { codigo: '237401', nombre: 'CURETAJE APICAL CON APICECTOMÍA Y OBTURACIÓN RETRÓGRADA (CIRUGÍA PERIRRADICULAR)', tipo: 'diente' },
    { codigo: '234202', nombre: 'RECONSTRUCCIÓN DE MUÑONES', tipo: 'diente' },
    { codigo: '237501', nombre: 'PROCEDIMIENTO CORRECTIVO EN RESORCIÓN RADICULAR (INTERNA Y EXTERNA)', tipo: 'diente' },
    { codigo: '237901', nombre: 'BLANQUEAMIENTO DE DIENTE INTRÍNSECO', tipo: 'diente' },
    { codigo: '236300', nombre: 'IMPLANTE DENTAL ALOPLÁSTICO (OSEOINTEGRACIÓN)', tipo: 'diente' },
  ];
  export const tratamientosBoca = [
    { codigo: '997500', nombre: 'PROFILAXIS DENTAL', tipo: 'boca' },
    { codigo: '990212', nombre: 'SESIÓN EDUCATIVA INDIVIDUAL, POR HIGIENE ORAL', tipo: 'boca' },
    { codigo: '997301', nombre: 'DETARTRAJE SUPRAGINGIVAL', tipo: 'boca' },
    { codigo: '240300', nombre: 'ALISADO RADICULAR, CAMPO CERRADO SOD', tipo: 'boca' },
    { codigo: '234301', nombre: 'INSERCIÓN, ADAPTACIÓN Y CONTROL DE PRÓTESIS REMOVIBLE PARCIAL (SUPERIOR O INFERIOR) MUCOSOPORTADA', tipo: 'boca' },
    { codigo: '234401', nombre: 'INSERCIÓN, ADAPTACIÓN Y CONTROL DE PRÓTESIS MUCOSOPORTADA TOTAL MEDIO CASO SUPERIOR O INFERIOR', tipo: 'boca' },
    { codigo: '234402', nombre: 'INSERCIÓN, ADAPTACIÓN Y CONTROL DE PRÓTESIS MUCOSOPORTADA TOTAL SUPERIOR E INFERIOR', tipo: 'boca' },
    { codigo: '237901', nombre: 'BLANQUEAMIENTO DENTAL INTRÍNSECO POR CAUSAS ENDODÓNTICAS (POR DIENTE)', tipo: 'boca' },
    { codigo: '240500', nombre: 'ADAPTACIÓN DE PLACA NEURO-MIORELAJANTE', tipo: 'boca' },
    { codigo: '248200', nombre: 'AJUSTAMIENTO OCLUSAL SOD', tipo: 'boca' },
    { codigo: '274101', nombre: 'FRENILLECTOMÍA LABIAL VÍA ABIERTA', tipo: 'boca' },
    { codigo: '240600', nombre: 'DRENAJE DE ABSCESOS PERIODONTALES', tipo: 'boca' },
    { codigo: '250001', nombre: 'BIOPSIA CERRADA (PUNCIÓN O ASPIRACIÓN) DE LENGUA', tipo: 'boca' },
    { codigo: '270101', nombre: 'INCISIÓN Y DRENAJE INTRAORAL EN CAVIDAD BUCAL', tipo: 'boca' },    
    { codigo: '256100', nombre: 'FRENILLECTOMÍA LINGUAL NCOC', tipo: 'boca' },
    { codigo: '272103', nombre: 'BIOPSIA ESCISIONAL DE PALADAR', tipo: 'boca' },
    { codigo: '272402', nombre: 'BIOPSIA DE PARED DE CAVIDAD BUCAL', tipo: 'boca' },
    { codigo: '272302', nombre: 'BIOPSIA ESCISIONAL DE LABIO', tipo: 'boca' },
    { codigo: '240200', nombre: 'DETARTRAJE SUBGINGIVAL SOD', tipo: 'boca' },    
    { codigo: '990103', nombre: 'SESIÓN EDUCATIVA GRUPAL POR ODONTOLOGÍA', tipo: 'boca' },
    { codigo: '990203', nombre: 'SESIÓN EDUCATIVA INDIVIDUAL POR ODONTOLOGÍA', tipo: 'boca' },
    { codigo: '997300', nombre: 'CONTROL DE PLACA DENTAL NCOC', tipo: 'boca' },    
    { codigo: '242201', nombre: 'CURETAJE A CAMPO ABIERTO', tipo: 'boca' },
    { codigo: '242202', nombre: 'CIRUGÍA A COLGAJO CON RESECCIÓN RADICULAR (AMPUTACIÓN, HEMISECCIÓN)', tipo: 'boca' },
    { codigo: '242400', nombre: 'REPARACIÓN O PLASTIA PERIODONTAL REGENERATIVA (INJERTOS, MEMBRANAS) SOD', tipo: 'boca' },
    { codigo: '243101', nombre: 'ESCISIÓN DE LESIÓN BENIGNA ENCAPSULADA EN ENCÍA HASTA DE TRES CENTÍMETROS', tipo: 'boca' },
    { codigo: '243110', nombre: 'RESECCIÓN DE LESIÓN DE ENCÍA', tipo: 'boca' },  
    { codigo: '247403', nombre: 'FERULIZACIÓN', tipo: 'boca' }, 
    
    { codigo: '245100', nombre: 'REGULARIZACIÓN DE REBORDES SOD', tipo: 'boca' },
    { codigo: '242204', nombre: 'AUMENTO DE REBORDE PARCIALMENTE EDÉNTULO (SIN MATERIAL)', tipo: 'boca' },
    { codigo: '242300', nombre: 'PLASTIAS PREPROTÉSICAS (AUMENTO DE CORONA CLÍNICA) SOD', tipo: 'boca' },
    { codigo: '247100', nombre: 'COLOCACIÓN DE APARATOLOGÍA FIJA PARA ORTODONCIA (ARCADA)', tipo: 'boca' },
    { codigo: '247201', nombre: 'COLOCACIÓN DE APARATOLOGÍA REMOVIBLE INTRAORAL PARA ORTODONCIA (ARCADA)', tipo: 'boca' },
    { codigo: '247202', nombre: 'COLOCACIÓN DE APARATOLOGÍA REMOVIBLE EXTRAORAL PARA ORTODONCIA (ARCADA)', tipo: 'boca' },
    { codigo: '247300', nombre: 'COLOCACIÓN DE APARATOS DE RETENCIÓN', tipo: 'boca' },
    
    { codigo: '248400', nombre: 'REPARACIÓN DE APARATOLOGÍA FIJA O REMOVIBLE SOD', tipo: 'boca' },
    { codigo: '236300', nombre: 'IMPLANTE DENTAL ALOPLÁSTICO (OSEOINTEGRACIÓN)', tipo: 'boca' },
    { codigo: '227101', nombre: 'REPARACIÓN DE FÍSTULA OROANTRAL Y/U ORONASAL' },
    { codigo: '274305', nombre: 'RESECCIÓN DE LESIÓN EN MUCOSA ORAL', tipo: 'boca' },
  ];
  export const consulta = [
    { codigo: '890203', nombre: 'CONSULTA DE PRIMERA VEZ POR ODONTOLOGÍA GENERAL', tipo: 'consulta' },
    { codigo: '890204', nombre: 'CONSULTA DE PRIMERA VEZ POR ODONTOLOGÍA ESPECIALIZADA', tipo: 'consulta' },
    { codigo: '890303', nombre: 'CONSULTA DE CONTROL O DE SEGUIMIENTO DE PROGRAMA POR ODONTOLOGÍA GENERAL',tipo: 'consulta'},
    { codigo: '890304', nombre: 'CONSULTA DE CONTROL O SEGUIMIENTO DE PROGRAMA POR ODONTOLOGÍA ESPECIALIZADA',tipo: 'consulta'},
    { codigo: '890401', nombre: 'INTERCONSULTA AMBULATORIA',tipo: 'consulta'},
  ];
  export const imagenologia = [
    { codigo: '870114', nombre: 'RADIOGRAFÍA PANORÁMICA DE MAXILARES, SUPERIOR E INFERIOR (ORTOPANTOMOGRAFÍA)', tipo: 'imagenologia' },
    { codigo: '870450', nombre: 'RADIOGRAFÍAS INTRAORALES PERIAPICALES MILIMETRADAS', tipo: 'imagenologia' },
    { codigo: '870451', nombre: 'RADIOGRAFÍAS INTRAORALES PERIAPICALES DIENTES ANTERIORES SUPERIORES', tipo: 'imagenologia' },
    { codigo: '870452', nombre: 'RADIOGRAFÍAS INTRAORALES PERIAPICALES DIENTES ANTERIORES INFERIORES', tipo: 'imagenologia' },
    { codigo: '870453', nombre: 'RADIOGRAFÍAS INTRAORALES PERIAPICALES ZONA DE CANINOS', tipo: 'imagenologia' },
    { codigo: '870454', nombre: 'RADIOGRAFÍAS INTRAORALES PERIAPICALES PREMOLARES', tipo: 'imagenologia' },
    { codigo: '870455', nombre: 'RADIOGRAFÍAS INTRAORALES PERIAPICALES MOLARES', tipo: 'imagenologia' },
    { codigo: '870130', nombre: 'RADIOGRAFÍA DE PERFIL DE CARA', tipo: 'imagenologia' },
    { codigo: '879141', nombre: 'TOMOGRAFÍA COMPUTADA DE MAXILARES (ESTUDIO IMPLANTOLOGÍA)', tipo: 'imagenologia' },
    { codigo: '879150', nombre: 'TOMOGRAFÍA COMPUTADA DE ARTICULACIÓN TEMPOROMANDIBULAR (BILATERAL)', tipo: 'imagenologia' },
    { codigo: '870131', nombre: 'RADIOGRAFÍA DE ARTICULACIÓN TEMPOROMAXILAR (ATM)', tipo: 'imagenologia' },
    { codigo: '870440', nombre: 'RADIOGRAFÍAS INTRAORALES OCLUSALES', tipo: 'imagenologia' },
  ];
  const TratamientoMenu = ({
    activeTratamientoMenu,
    handleTratamientoSelection,
    precios,
    handlePrecioChange,
    toggleMenu
  }) => {
    return (
      <div>
        <button onClick={() => toggleMenu('superficie', 'tratamiento')}>Tratamiento Superficie</button>
        {activeTratamientoMenu === 'superficie' && (
          <ul className="tratamiento-menu">
            {tratamientosSuperficie.map((item, index) => (
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
            {tratamientosDiente.map((item, index) => (
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
            {tratamientosBoca.map((item, index) => (
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
        <button onClick={() => toggleMenu('consulta', 'tratamiento')}>Consultas</button>
        {activeTratamientoMenu === 'consulta' && (
          <ul className="tratamiento-menu">
            {consulta.map((item, index) => (
              <li key={index}>
                <button onClick={() => handleTratamientoSelection(item, 'consulta')}>
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
            {imagenologia.map((item, index) => (
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
      </div>
    );
  };
  
  const Tratamientos = () => {
    const [activeTratamientoMenu, setActiveTratamientoMenu] = useState(null);
    const [precios, setPrecios] = useState({});
  
    const handleTratamientoSelection = (item, tipo) => {
      console.log(`Tratamiento seleccionado: ${item.nombre} (${tipo})`);
    };
  
    const handlePrecioChange = (codigo, precio) => {
      setPrecios((prevPrecios) => ({
        ...prevPrecios,
        [codigo]: precio,
      }));
    };
  
    const toggleMenu = (menu, type) => {
      setActiveTratamientoMenu(activeTratamientoMenu === menu ? null : menu);
    };
  
    return (
      <div>
        <TratamientoMenu
          activeTratamientoMenu={activeTratamientoMenu}
          handleTratamientoSelection={handleTratamientoSelection}
          precios={precios}
          handlePrecioChange={handlePrecioChange}
          toggleMenu={toggleMenu}
        />
      </div>
    );
  };
  
  export default Tratamientos;