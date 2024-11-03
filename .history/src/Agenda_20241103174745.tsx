import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './Agenda.css';
// Definir las interfaces para los props y el estado
interface AgendaProps {
  doctor: Doctor;
  selectedPatient: Patient;
}

interface Appointment {
  [key: string]: string;
}

// Generar slots de 15 minutos para mostrar en la agenda
const generateTimeSlots = (start, end, interval) => {
  let slots = [];
  let currentTime = new Date(start);

  while (currentTime < end) {
    slots.push(currentTime.toTimeString().slice(0, 5)); // Formato HH:MM en 24 horas
    currentTime = new Date(currentTime.getTime() + interval * 60000);
  }

  return slots;
};

const Agenda = ({ doctor, selectedPatient }) => {
  const [appointments, setAppointments] = useState({});
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(15); // Duración por defecto de 15 minutos
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorAvailability, setDoctorAvailability] = useState(null);
  const [tempAvailability, setTempAvailability] = useState(null);
  const [configuring, setConfiguring] = useState(false);
  const [lunchBreak, setLunchBreak] = useState({ start: '12:00', end: '14:00' });
  const [note, setNote] = useState(''); // Estado para la nota

  // Nueva función para cargar citas desde Firestore
  const fetchAppointments = useCallback(async () => {
    try {
      const q = query(
        collection(doc(db, 'doctors', doctor.uid), 'agenda'),
        where('date', '==', selectedDate) // Filtrar por fecha seleccionada
      );

      const querySnapshot = await getDocs(q);
      const loadedAppointments = {};

      querySnapshot.forEach((doc) => {
        const appointmentData = doc.data();
        loadedAppointments[appointmentData.time] = appointmentData;
      });

      setAppointments(loadedAppointments); // Actualizamos las citas cargadas
    } catch (error) {
      console.error('Error al cargar las citas desde Firestore:', error);
    }
  }, [doctor.uid, selectedDate]); // Memorizar la función dependiendo de doctor.id y selectedDate

  useEffect(() => {
    if (doctor) {
      fetchAppointments(); // Cargamos las citas cada vez que se cambia de doctor o de fecha
    }
  }, [doctor, selectedDate, fetchAppointments]);

  useEffect(() => {
    const fetchDoctorAvailability = async () => {
      if (doctor && doctor.uid) {
        try {
          const docRef = doc(db, 'doctors', doctor.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const availability = docSnap.data().availability || {};
            const lunch = docSnap.data().lunchBreak || { start: '12:00', end: '14:00' };
            setDoctorAvailability(availability);
            setTempAvailability(availability);
            setLunchBreak(lunch);
  
            console.log("Disponibilidad cargada:", availability);
          }
        } catch (error) {
          console.error('Error fetching doctor availability:', error);
        }
      }
    };
  
    fetchDoctorAvailability();
  }, [doctor, selectedDate]);

  const getDayOfWeek = (date) => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayIndex = new Date(date).getDay();
    return days[dayIndex];
  };

  const dayOfWeek = getDayOfWeek(selectedDate);
  const availability = doctorAvailability?.[dayOfWeek] || {
    start: '06:00',
    end: '19:00',
  };

  const startTime = new Date();
  const endTime = new Date();
  const [startHour, startMinute] = availability.start.split(':');
  const [endHour, endMinute] = availability.end.split(':');

  startTime.setHours(startHour, startMinute, 0, 0);
  endTime.setHours(endHour, endMinute, 0, 0);

  // Generar los slots de 15 minutos (bloques visibles en la agenda)
  const timeSlots = generateTimeSlots(startTime, endTime, 15);

  // Excluir el tiempo de almuerzo de los slots visibles
  const lunchStart = new Date(`1970-01-01T${lunchBreak.start}:00`);
  const lunchEnd = new Date(`1970-01-01T${lunchBreak.end}:00`);
  const availableTimeSlots = timeSlots.filter(slot => {
    const slotTime = new Date(`1970-01-01T${slot}:00`);
    return slotTime < lunchStart || slotTime >= lunchEnd;
  });

  // Función para reservar una cita
  const bookAppointment = async (time) => {
    if (!selectedPatient) {
      alert('Por favor, seleccione un paciente para asignar una cita.');
      return;
    }

    let endTime = new Date(`1970-01-01T${time}:00`);
    endTime.setMinutes(endTime.getMinutes() + duration); // Ajustamos el tiempo final basado en la duración

    const endSlot = endTime.toTimeString().slice(0, 5);

    const newAppointments = { ...appointments };
    let currentTime = time;
    let slotsBooked = [];

    // Ocupar los slots necesarios basados en la duración seleccionada
    while (currentTime !== endSlot) {
      if (newAppointments[currentTime]) {
        alert('Esta hora ya está ocupada.');
        return;
      }
      slotsBooked.push(currentTime);
      const currentTimeDate = new Date(`1970-01-01T${currentTime}:00`);
      currentTimeDate.setMinutes(currentTimeDate.getMinutes() + 5); // Seguimos usando intervalos de 5 minutos internamente
      currentTime = currentTimeDate.toTimeString().slice(0, 5);
    }

    // Añadimos la nota al registro de la cita
    newAppointments[time] = {
      name: selectedPatient.primerNombre,
      phone: selectedPatient.telefono || 'N/A',
      confirmed: false,
      attended: null,
      duration: duration,
      slots: slotsBooked,
      note: note, // Guardamos la nota
      date: selectedDate, // Añadimos la fecha
      time, // Añadimos la hora
    };

    slotsBooked.forEach(slot => {
      if (slot !== time) {
        newAppointments[slot] = { parentSlot: time, hidden: true };
      }
    });

    setAppointments(newAppointments);
    setSelectedTime(null);
    setNote(''); // Limpiamos la nota después de reservar la cita

    // Guardar la cita en Firestore en la subcolección 'agenda'
    try {
      const agendaRef = collection(doc(db, 'doctors', doctor.id), 'agenda');
      const newAppointmentRef = doc(agendaRef);
      await setDoc(newAppointmentRef, newAppointments[time]);
      console.log('Cita añadida con éxito a la agenda del doctor:', doctor.id);
    } catch (error) {
      console.error('Error al agregar la cita en la agenda:', error);
    }
  };

  const deleteAppointment = (time) => {
    const appointment = appointments[time];
    if (appointment?.parentSlot) return;

    const newAppointments = { ...appointments };
    appointment.slots.forEach(slot => {
      delete newAppointments[slot];
    });

    setAppointments(newAppointments);
  };

  const markAttendance = (time, attended) => {
    const appointment = appointments[time];
    if (appointment?.parentSlot) return;

    const updatedAppointments = { ...appointments };
    appointment.slots.forEach(slot => {
      if (updatedAppointments[slot]) {
        updatedAppointments[slot].attended = attended;
      }
    });

    setAppointments(updatedAppointments);
  };

  const startConfiguringAvailability = () => {
    setConfiguring(true);
    setTempAvailability(doctorAvailability);
  };

  const cancelConfiguringAvailability = () => {
    setConfiguring(false);
    setTempAvailability(doctorAvailability);
  };

  const saveAvailability = async () => {
    try {
      await setDoc(
        doc(db, 'doctors', doctor.id),
        { availability: tempAvailability, lunchBreak },
        { merge: true }
      );
      setDoctorAvailability(tempAvailability);
      setConfiguring(false);
      alert('Disponibilidad actualizada con éxito.');
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const updateTempAvailability = (day, type, value) => {
    const updatedAvailability = { ...tempAvailability };
    if (!updatedAvailability[day]) {
      updatedAvailability[day] = { start: '06:00', end: '22:00' };
    }
    updatedAvailability[day][type] = value;
    setTempAvailability(updatedAvailability);
  };

  return (
    <div className="agenda">
      <h2>Agenda del Dr. {doctor.name}</h2>
      <label>
        Seleccionar fecha:
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min="2024-06-01"
          max="2054-06-01"
        />
      </label>
      {selectedTime && selectedPatient && (
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
            Nota: {/* Añadimos un campo de texto para la nota */}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Añadir nota opcional..."
            />
          </label>
          <button onClick={() => bookAppointment(selectedTime)}>Confirmar</button>
          <button onClick={() => setSelectedTime(null)}>Cancelar</button>
        </div>
      )}
      {configuring ? (
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
      ) : (
        <>
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
                  {appointment && appointment.note && ( // Condicional para mostrar la nota
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
          <button className="configure-availability" onClick={startConfiguringAvailability}>
            Configurar Disponibilidad
          </button>
        </>
      )}
    </div>
  );
};

export default Agenda;
