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
    </div>
  );
};

export default ConsentimientoButtons;