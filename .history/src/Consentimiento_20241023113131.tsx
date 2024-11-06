import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ConsentimientoOperatoria from './ConsentimientoOperatoria';
import ConsentimientoCorona from './ConsentimientoCorona';
import ConsentimientoExodoncia from './ConsentimientoExodoncia';
import ConsentimientoEndodoncia from './ConsentimientoEndodoncia';
import ConsentimientoImplante from './ConsentimientoImplante';
import ConsentimientoProtesis from './ConsentimientoProtesis';
import ConsentimientoOrtodoncia from './ConsentimientoOrtodoncia';

function Consentimiento() {
  const { doctorUid, patientUid, activeTab } = useParams();

  return (
    <div>
      <h2>Consentimientos</h2>
      {activeTab === 'consentimientoOperatoria' && (
        <ConsentimientoOperatoria doctorUid={doctorUid} patientUid={patientUid} />
      )}
      {activeTab === 'consentimientoCorona' && (
        <ConsentimientoCorona doctorUid={doctorUid} patientUid={patientUid} />
      )}
      {activeTab === 'consentimientoExodoncia' && (
        <ConsentimientoExodoncia doctorUid={doctorUid} patientUid={patientUid} />
      )}
      {activeTab === 'consentimientoEndodoncia' && (
        <ConsentimientoEndodoncia doctorUid={doctorUid} patientUid={patientUid} />
      )}
      {activeTab === 'consentimientoImplante' && (
        <ConsentimientoImplante doctorUid={doctorUid} patientUid={patientUid} />
      )}
      {activeTab === 'consentimientoProtesis' && (
        <ConsentimientoProtesis doctorUid={doctorUid} patientUid={patientUid} />
      )}
      {activeTab === 'consentimientoOrtodoncia' && (
        <ConsentimientoOrtodoncia doctorUid={doctorUid} patientUid={patientUid} />
      )}
      <Link to={`/historia-clinica/${doctorUid}/${patientUid}`}>
        <button>Regresar a Historia Clínica</button>
      </Link>
    </div>
  );
}

export default Consentimiento;