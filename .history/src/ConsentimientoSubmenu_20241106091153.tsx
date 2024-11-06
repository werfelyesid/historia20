import React from 'react';
import ConsentimientoButtons from './ConsentimientoButtons';

interface ConsentimientosSubmenuProps {
  doctorUid: string;
  patientUid: string | undefined;
}

const ConsentimientosSubmenu: React.FC<ConsentimientosSubmenuProps> = ({ doctorUid, patientUid }) => {
  return (
    <div className="consentimientos-submenu">
      <ConsentimientoButtons doctorUid={doctorUid} patientUid={patientUid} />
    </div>
  );
};

export default ConsentimientosSubmenu;