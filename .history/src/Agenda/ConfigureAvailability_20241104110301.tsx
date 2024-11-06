import React from 'react';

interface ConfigureAvailabilityProps {
  tempAvailability: { [key: string]: { start: string; end: string } } | null;
  lunchBreak: { start: string; end: string };
  updateTempAvailability: (day: string, type: 'start' | 'end', value: string) => void;
  setLunchBreak: (lunchBreak: { start: string; end: string }) => void;
  saveAvailability: () => void;
  cancelConfiguringAvailability: () => void;
}

const ConfigureAvailability: React.FC<ConfigureAvailabilityProps> = ({
  tempAvailability,
  lunchBreak,
  updateTempAvailability,
  setLunchBreak,
  saveAvailability,
  cancelConfiguringAvailability,
}) => {
  return (
    <div className="configure-form">
      <h3>Configurar Disponibilidad</h3>
      {['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].map((day) => (
        <div key={day} className="day-config">
          <label>{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
          <input
            type="time"
            value={tempAvailability?.[day]?.start || '06:00'}
            onChange={(e) => updateTempAvailability(day, 'start', e.target.value)}
            step="900" // Esto fuerza el formato de 24 horas en algunos navegadores
          />
          <span>a</span>
          <input
            type="time"
            value={tempAvailability?.[day]?.end || '22:00'}
            onChange={(e) => updateTempAvailability(day, 'end', e.target.value)}
            step="900" // Esto fuerza el formato de 24 horas en algunos navegadores
          />
        </div>
      ))}
      <div className="day-config">
        <label>Almuerzo:</label>
        <input
          type="time"
          value={lunchBreak.start}
          onChange={(e) => setLunchBreak({ ...lunchBreak, start: e.target.value })}
          step="900"
        />
        <span>a</span>
        <input
          type="time"
          value={lunchBreak.end}
          onChange={(e) => setLunchBreak({ ...lunchBreak, end: e.target.value })}
          step="900"
        />
      </div>
      <div className="configure-buttons">
        <button onClick={saveAvailability}>Guardar</button>
        <button onClick={cancelConfiguringAvailability}>Cancelar</button>
      </div>
    </div>
  );
};

export default ConfigureAvailability;