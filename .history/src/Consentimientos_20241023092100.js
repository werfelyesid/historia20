import React from 'react';
import ConsentimientoOperatoria from './ConsentimientoOperatoria';
import ConsentimientoCorona from './ConsentimientoCorona';
import ConsentimientoExodoncia from './ConsentimientoExodoncia';
import ConsentimientoEndodoncia from './ConsentimientoEndodoncia';
import ConsentimientoImplante from './ConsentimientoImplante';
import ConsentimientoProtesis from './ConsentimientoProtesis';
import ConsentimientoOrtodoncia from './ConsentimientoOrtodoncia';
import { Link, useParams } from 'react-router-dom';

function Consentimientos() {
  const { doctorUid, patientUid } = useParams();  return (
    <div>
      <h2>Consentimientos</h2>
      <ul>
        <li><ConsentimientoOperatoria /></li>
        <li><ConsentimientoCorona /></li>
        <li><ConsentimientoExodoncia /></li>
        <li><ConsentimientoEndodoncia /></li>
        <li><ConsentimientoImplante /></li>
        <li><ConsentimientoProtesis /></li>
        <li><ConsentimientoOrtodoncia /></li>
      </ul>
      <Link to={`/historia-clinica/${doctorUid}/${patientUid}`}>
        <button>Regresar a Historia Clínica</button>
      </Link>
    </div>
  );
}

export default Consentimientos;