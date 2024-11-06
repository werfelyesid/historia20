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

  // Proporcionar valores predeterminados si son undefined
  const validDoctorUid = doctorUid || 'defaultDoctorUid';
  const validPatientUid = patientUid || 'defaultPatientUid';

  return (
    <div>
      <h2>Consentimientos</h2>
      {activeTab === 'consentimientoOperatoria' && (
        <ConsentimientoOperatoria doctorUid={validDoctorUid} patientUid={validPatientUid} />
      )}
      {activeTab === 'consentimientoCorona' && (
        <ConsentimientoCorona doctorUid={validDoctorUid} patientUid={validPatientUid} />
      )}
      {activeTab === 'consentimientoExodoncia' && (
        <ConsentimientoExodoncia doctorUid={validDoctorUid} patientUid={validPatientUid} />
      )}
      {activeTab === 'consentimientoEndodoncia' && (
        <ConsentimientoEndodoncia doctorUid={validDoctorUid} patientUid={validPatientUid} />
      )}
      {activeTab === 'consentimientoImplante' && (
        <ConsentimientoImplante doctorUid={validDoctorUid} patientUid={validPatientUid} />
      )}
      {activeTab === 'consentimientoProtesis' && (
        <ConsentimientoProtesis doctorUid={validDoctorUid} patientUid={validPatientUid} />
      )}
      {activeTab === 'consentimientoOrtodoncia' && (
        <ConsentimientoOrtodoncia doctorUid={validDoctorUid} patientUid={validPatientUid} />
      )}
    </div>
  );
};

export default Consentimiento;