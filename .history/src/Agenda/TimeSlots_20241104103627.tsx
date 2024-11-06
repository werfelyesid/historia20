import React from 'react';

interface Appointment {
  name: string;
  phone: string;
  confirmed: boolean;
  attended: boolean | null;
  duration: number;
  slots: string[];
  note: string;
  date: string;
  time: string;
  parentSlot?: string;
  hidden?: boolean;
}

interface Patient {
  id: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  identificacion: string;
  celular: string;
  motivoConsulta: string;
  telefono?: string;
}

interface TimeSlotsProps {
  availableTimeSlots: string[];
  appointments: { [key: string]: Appointment };
  setSelectedTime: (time: string | null) => void;
  deleteAppointment: (time: string) => void;
  markAttendance: (time: string, attended: boolean) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  availableTimeSlots,
  appointments,
  setSelectedTime,
  deleteAppointment,
  markAttendance,
}) => {
  return (
    <div className="time-slots">
      {availableTimeSlots.map((slot, index) => {
        const appointment = appointments[slot];
        return (
          <div
            key={index}
            className={`time-slot ${appointment ? 'occupied' : ''}`}
            onClick={() => !appointment && setSelectedTime(slot)}
          >
            {slot}
            {appointment && ` - ${appointment.name} (${appointment.duration} min)`}
            {appointment && appointment.note && (
              <div className="appointment-note">
                Nota: {appointment.note}
              </div>
            )}
            {appointment && (
              <div className="appointment-buttons">
                <button
                  className={`confirm ${appointment.confirmed ? 'confirmed' : ''}`}
                  onClick={() => {
                    const updatedAppointments = { ...appointments };
                    updatedAppointments[slot].confirmed = !updatedAppointments[slot].confirmed;
                    setAppointments(updatedAppointments);
                  }}
                >
                  {appointment.confirmed ? 'Confirmada' : 'Por confirmar'}
                </button>
                <button className="delete" onClick={() => deleteAppointment(slot)}>Eliminar</button>
                <button className="attend" onClick={() => markAttendance(slot, true)}>Asistió</button>
                <button className="not-attend" onClick={() => markAttendance(slot, false)}>No asistió</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlots;