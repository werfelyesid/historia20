import React from 'react';

interface AppointmentFormProps {
  selectedPatient: Patient;
  selectedTime: string | null;
  duration: number;
  note: string;
  setDuration: (duration: number) => void;
  setNote: (note: string) => void;
  bookAppointment: (time: string) => void;
  setSelectedTime: (time: string | null) => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  selectedPatient,
  selectedTime,
  duration,
  note,
  setDuration,
  setNote,
  bookAppointment,
  setSelectedTime,
}) => {
  return (
    <div className="appointment-form">
      <h3>Asignar cita para {selectedPatient.primerNombre}</h3>
      <label>
        Duración:
        <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10))}>
          <option value={5}>5 minutos</option>
          <option value={10}>10 minutos</option>
          <option value={15}>15 minutos</option>
          <option value={20}>20 minutos</option>
          <option value={30}>30 minutos</option>
          <option value={45}>45 minutos</option>
          <option value={60}>1 hora</option>
          <option value={90}>1,5 horas</option>
          <option value={120}>2 horas</option>
        </select>
      </label>
      <label>
        Nota:
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Añadir nota opcional..."
        />
      </label>
      <button onClick={() => bookAppointment(selectedTime!)}>Confirmar</button>
      <button onClick={() => setSelectedTime(null)}>Cancelar</button>
    </div>
  );
};

export default AppointmentForm;