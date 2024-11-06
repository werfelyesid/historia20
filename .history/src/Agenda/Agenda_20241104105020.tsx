import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './Agenda.css';
import ConfigureAvailability from './ConfigureAvailability';
import AppointmentForm from './AppointmentForm';
import TimeSlots from './TimeSlots';

// Definir las interfaces para los props y el estado
interface AgendaProps {
  doctor: Doctor | null;
  selectedPatient: Patient | null;
}

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

interface Doctor {
  uid: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  celular: string;
  especialidad: string;
  registroProfesional: string;
  ciudad: string;
  role: string;
  availability?: { [key: string]: { start: string; end: string } };
  lunchBreak?: { start: string; end: string };
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

// Generar slots de 15 minutos para mostrar en la agenda
const generateTimeSlots = (start: Date, end: Date, interval: number): string[] => {
  let slots: string[] = [];
  let currentTime = new Date(start);

  while (currentTime < end) {
    slots.push(currentTime.toTimeString().slice(0, 5)); // Formato HH:MM en 24 horas
    currentTime = new Date(currentTime.getTime() + interval * 60000);
  }

  return slots;
};

const Agenda: React.FC<AgendaProps> = ({ doctor, selectedPatient }) => {
  const [appointments, setAppointments] = useState<{ [key: string]: Appointment }>({});
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(15); // Duración por defecto de 15 minutos
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [doctorAvailability, setDoctorAvailability] = useState<{ [key: string]: { start: string; end: string } } | null>(null);
  const [tempAvailability, setTempAvailability] = useState<{ [key: string]: { start: string; end: string } } | null>(null);
  const [configuring, setConfiguring] = useState<boolean>(false);
  const [lunchBreak, setLunchBreak] = useState<{ start: string; end: string }>({ start: '12:00', end: '14:00' });
  const [note, setNote] = useState<string>(''); // Estado para la nota

  // Nueva función para cargar citas desde Firestore
  const fetchAppointments = useCallback(async () => {
    if (!doctor) return;

    try {
      const q = query(
        collection(doc(db, 'doctors', doctor.uid), 'agenda'),
        where('date', '==', selectedDate) // Filtrar por fecha seleccionada
      );

      const querySnapshot = await getDocs(q);
      const loadedAppointments: { [key: string]: Appointment } = {};

      querySnapshot.forEach((doc) => {
        const appointmentData = doc.data() as Appointment;
        loadedAppointments[appointmentData.time] = appointmentData;
      });

      setAppointments(loadedAppointments); // Actualizamos las citas cargadas
    } catch (error) {
      console.error('Error al cargar las citas desde Firestore:', error);
    }
  }, [doctor, selectedDate]); // Memorizar la función dependiendo de doctor.id y selectedDate

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

  const getDayOfWeek = (date: string): string => {
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
  const [startHour, startMinute] = availability.start.split(':').map(Number);
  const [endHour, endMinute] = availability.end.split(':').map(Number);

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
  const bookAppointment = async (time: string) => {
    if (!selectedPatient) {
      alert('Por favor, seleccione un paciente para asignar una cita.');
      return;
    }

    let endTime = new Date(`1970-01-01T${time}:00`);
    endTime.setMinutes(endTime.getMinutes() + duration); // Ajustamos el tiempo final basado en la duración

    const endSlot = endTime.toTimeString().slice(0, 5);

    const newAppointments = { ...appointments };
    let currentTime = time;
    let slotsBooked: string[] = [];

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
        newAppointments[slot] = { parentSlot: time, hidden: true } as Appointment;
      }
    });

    setAppointments(newAppointments);
    setSelectedTime(null);
    setNote(''); // Limpiamos la nota después de reservar la cita

    // Guardar la cita en Firestore en la subcolección 'agenda'
    try {
      if (doctor) {
        const agendaRef = collection(doc(db, 'doctors', doctor.uid), 'agenda');
        const newAppointmentRef = doc(agendaRef);
        await setDoc(newAppointmentRef, newAppointments[time]);
        console.log('Cita añadida con éxito a la agenda del doctor:', doctor.uid);
      }
    } catch (error) {
      console.error('Error al agregar la cita en la agenda:', error);
    }
  };

  const deleteAppointment = (time: string) => {
    const appointment = appointments[time];
    if (appointment?.parentSlot) return;

    const newAppointments = { ...appointments };
    appointment.slots.forEach(slot => {
      delete newAppointments[slot];
    });

    setAppointments(newAppointments);
  };

  const markAttendance = (time: string, attended: boolean) => {
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
      if (doctor) {
        await setDoc(
          doc(db, 'doctors', doctor.uid),
          { availability: tempAvailability, lunchBreak },
          { merge: true }
        );
        setDoctorAvailability(tempAvailability);
        setConfiguring(false);
        alert('Disponibilidad actualizada con éxito.');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const updateTempAvailability = (day: string, type: 'start' | 'end', value: string) => {
    const updatedAvailability = { ...tempAvailability };
    if (!updatedAvailability[day]) {
      updatedAvailability[day] = { start: '06:00', end: '22:00' };
    }
    updatedAvailability[day][type] = value;
    setTempAvailability(updatedAvailability);
  };

  if (!doctor) {
    return <div>Cargando datos del doctor...</div>;
  }

  return (
    <div className="agenda">
      <h2>
        Agenda del Dr(a). {doctor.primerNombre} {doctor.primerApellido}
        {selectedPatient && (
          <>
            , Patient: {selectedPatient.primerApellido} {selectedPatient.segundoApellido}, {selectedPatient.primerNombre}, {selectedPatient.celular}
          </>
        )}
      </h2>
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
        <AppointmentForm
          selectedPatient={selectedPatient}
          selectedTime={selectedTime}
          duration={duration}
          note={note}
          setDuration={setDuration}
          setNote={setNote}
          bookAppointment={bookAppointment}
          setSelectedTime={setSelectedTime}
        />
      )}
      {configuring ? (
        <ConfigureAvailability
          tempAvailability={tempAvailability}
          lunchBreak={lunchBreak}
          updateTempAvailability={updateTempAvailability}
          setLunchBreak={setLunchBreak}
          saveAvailability={saveAvailability}
          cancelConfiguringAvailability={cancelConfiguringAvailability}
        />
      ) : (
        <>
          <TimeSlots
            availableTimeSlots={availableTimeSlots}
            appointments={appointments}
            setSelectedTime={setSelectedTime}
            deleteAppointment={deleteAppointment}
            markAttendance={markAttendance}
          />
          <button className="configure-availability" onClick={startConfiguringAvailability}>
            Configurar Disponibilidad
          </button>
        </>
      )}
    </div>
  );
};

export default Agenda;