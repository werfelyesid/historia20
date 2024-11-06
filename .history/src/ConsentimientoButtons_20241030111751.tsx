import React from 'react';
import { Link } from 'react-router-dom';

const ConsentimientoButtons = ({ doctorUid, patientUid }) => {
  return (
    <div>
      <Link to={`/ConsentimientoOperatoria/${doctorUid}/${patientUid}/consentimientoOperatoria`}>
        <button>Ver Consentimiento Operatoria</button>
      </Link>
      <Link to={`/ConsentimientoCorona/${doctorUid}/${patientUid}/consentimientoCorona`}>
        <button>Ver Consentimiento Corona</button>
      </Link>
      <Link to={`/ConsentimientoExodoncia/${doctorUid}/${patientUid}/consentimientoExodoncia`}>
        <button>Ver Consentimiento Exodoncia</button>
      </Link>
      <Link to={`/ConsentimientoEndodoncia/${doctorUid}/${patientUid}/consentimientoEndodoncia`}>
        <button>Ver Consentimiento Endodoncia</button>
      </Link>
      <Link to={`/ConsentimientoImplante/${doctorUid}/${patientUid}/consentimientoImplante`}>
        <button>Ver Consentimiento Implante</button>
      </Link>
      <Link to={`/ConsentimientoProtesis/${doctorUid}/${patientUid}/consentimientoProtesis`}>
        <button>Ver Consentimiento Protesis</button>
      </Link>
      <Link to={`/ConsentimientoOrtodoncia/${doctorUid}/${patientUid}/consentimientoOrtodoncia`}>
        <button>Ver Consentimiento Ortodoncia</button>
      </Link>
    </div>
  );
};

export default ConsentimientoButtons;