import React from 'react';
import { Link } from 'react-router-dom';

const ConsentimientoButtons = ({ doctorUid, patientUid }) => {
  return (
    <div>
      <Link to={`/ConsentimientoOperatoria/${doctorUid}/${selectedPatient.uid}/consentimientoOperatoria`}>
            <button>Ver Consentimiento Operatoria</button>
          </Link>
          <Link to={`/ConsentimientoCorona/${doctorUid}/${selectedPatient.uid}/consentimientoCorona`}>
            <button>Ver Consentimiento Corona</button>
          </Link>
          <Link to={`/ConsentimientoExodoncia/${doctorUid}/${selectedPatient.uid}/consentimientoExodoncia`}>
            <button>Ver Consentimiento Exodoncia</button>
          </Link>
          <Link to={`/ConsentimientoEndodoncia/${doctorUid}/${selectedPatient.uid}/consentimientoEndodoncia`}>
            <button>Ver Consentimiento Endodoncia</button>
          </Link>
          <Link to={`/ConsentimientoImplante/${doctorUid}/${selectedPatient.uid}/consentimientoImplante`}>
            <button>Ver Consentimiento Implante</button>
          </Link>
          <Link to={`/ConsentimientoProtesis/${doctorUid}/${selectedPatient.uid}/consentimientoProtesis`}>
            <button>Ver Consentimiento Protesis</button>
          </Link>
          <Link to={`/ConsentimientoOrtodoncia/${doctorUid}/${selectedPatient.uid}/consentimientoOrtodoncia`}>
            <button>Ver Consentimiento Ortodoncia</button>
    </div>
  );
};

export default ConsentimientoButtons;