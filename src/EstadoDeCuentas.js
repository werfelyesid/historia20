import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import './HistoriaClinica.css';

function EstadoDeCuentas({ doctorId, patientId }) {
  const [treatments, setTreatments] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [doctorDocument, setDoctorDocument] = useState('');
  const [patientName, setPatientName] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [abonos, setAbonos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState(0);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const estadoDeCuentasCollection = collection(db, 'doctors', doctorId, 'pacientes', patientId, 'estadoDeCuentas');
        const snapshot = await getDocs(estadoDeCuentasCollection);
        const treatmentsList = snapshot.docs.map(doc => doc.data());

        setTreatments(treatmentsList);

        const total = treatmentsList.reduce((acc, treatment) => acc + parseFloat(treatment.valor || 0), 0);
        setTotalValue(total);
      } catch (error) {
        console.error('Error al obtener los tratamientos de Estado de Cuentas:', error);
      }
    };

    const fetchDoctorAndPatientNames = async () => {
      try {
        const doctorDoc = await getDoc(doc(db, 'doctors', doctorId));
        if (doctorDoc.exists()) {
          setDoctorName(doctorDoc.data().name);
          setDoctorDocument(doctorDoc.data().documento);
        }

        const patientDoc = await getDoc(doc(db, 'doctors', doctorId, 'pacientes', patientId));
        if (patientDoc.exists()) {
          const patientData = patientDoc.data();
          setPatientName(`${patientData.primerNombre} ${patientData.primerApellido}`);
        }
      } catch (error) {
        console.error('Error al obtener los nombres del doctor y paciente:', error);
      }
    };

    const fetchAbonos = async () => {
      try {
        const abonosCollection = collection(db, 'doctors', doctorId, 'pacientes', patientId, 'abonos');
        const snapshot = await getDocs(abonosCollection);
        const abonosList = snapshot.docs.map(doc => doc.data());

        setAbonos(abonosList);
      } catch (error) {
        console.error('Error al obtener los abonos:', error);
      }
    };

    fetchTreatments();
    fetchDoctorAndPatientNames();
    fetchAbonos();
  }, [doctorId, patientId]);

  const handleAddPayment = async () => {
    if (newPayment <= 0) {
      alert("Por favor, ingrese un valor válido para el abono.");
      return;
    }

    const currentDateTime = new Date();
    const newAbono = {
      amount: parseFloat(newPayment),
      date: currentDateTime.toLocaleDateString(),
      time: currentDateTime.toLocaleTimeString(),
    };

    try {
      await addDoc(collection(db, 'doctors', doctorId, 'pacientes', patientId, 'abonos'), newAbono);
      
      // Actualizar la lista de abonos y recalcular el saldo pendiente
      setAbonos((prevAbonos) => [...prevAbonos, newAbono]);
      setIsModalOpen(false); // Cerrar el modal
      setNewPayment(0); // Reiniciar el valor del nuevo pago
    } catch (error) {
      console.error('Error al agregar el abono:', error);
    }
  };

  const handlePrintReceipt = () => {
    window.print(); // Imprimir la página actual
  };

  const totalAbonos = abonos.reduce((acc, abono) => acc + abono.amount, 0);

  return (
    <div className="estado-de-cuentas historia-clinica-oral">
      <h2>Estado de Cuentas</h2>
      <h3>{patientName}</h3>
      <ul className="treatment-list">
        {treatments.map((treatment, index) => (
          <li key={index}>
            {treatment.codigo} - {treatment.nombre} - {treatment.diente} - ${treatment.valor} - {treatment.estado}
          </li>
        ))}
      </ul>
      <div className="account-summary">
        <p>Total del tratamiento: ${totalValue}</p>
        <p>Saldo pendiente: ${totalValue - totalAbonos}</p>
        <button onClick={() => setIsModalOpen(true)}>Agregar un pago</button>
        <button onClick={handlePrintReceipt}>Imprimir recibo de pago</button>
      </div>

      <div className="abonos-list">
        <h4>Abonos</h4>
        <ul>
          {abonos.map((abono, index) => (
            <li key={index}>
              ${abono.amount} - {abono.date} - {abono.time}
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Recibo de pago</h3>
            <p>Factura o Concepto: Tratamiento Dental</p>
            <p>Importe Cobrado:</p>
            <input 
              type="number" 
              value={newPayment}
              onChange={(e) => setNewPayment(e.target.value)}
            />
            <p>Importe Pendiente: ${totalValue - totalAbonos}</p>
            <p>Fecha de Cobro: {new Date().toLocaleDateString()}</p>
            <p>Doctor: {doctorName} - Documento: {doctorDocument}</p>
            <button onClick={handleAddPayment}>Guardar</button>
            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="signature-section">
        <hr />
        <p>{doctorName}</p>
      </div>
    </div>
  );
}

export default EstadoDeCuentas;
