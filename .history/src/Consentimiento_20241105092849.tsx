import React from 'react';
import { useParams } from 'react-router-dom';
import ConsentimientoOperatoria from './ConsentimientoOperatoria';
import ConsentimientoCorona from './ConsentimientoCorona';
import ConsentimientoExodoncia from './ConsentimientoExodoncia';
import ConsentimientoEndodoncia from './ConsentimientoEndodoncia';
import ConsentimientoImplante from './ConsentimientoImplante';
import ConsentimientoProtesis from './ConsentimientoProtesis';
import ConsentimientoOrtodoncia from './ConsentimientoOrtodoncia';

interface ConsentimientoParams {
  doctorUid: string;
  patientUid: string;
  activeTab: string;
  [key: string]: string | undefined; // Firma de índice para string
}

const Consentimiento: React.FC = () => {
  const { doctorUid, patientUid, activeTab } = useParams<ConsentimientoParams>();

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
    </div>
  );
};

export default Consentimiento;