import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

interface Abono {
  amount: number;
  date: string;
}

interface EstadoDeCuentasProps {
  doctorUid: string;
  patientUid: string;
}

const EstadoDeCuentas: React.FC<EstadoDeCuentasProps> = ({ doctorUid, patientUid }) => {
  const [abonos, setAbonos] = useState<Abono[]>([]);
  const [newPayment, setNewPayment] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbonos = async () => {
      try {
        const abonosSnapshot = await getDocs(collection(db, 'doctors', doctorUid, 'pacientes', patientUid, 'abonos'));
        const abonosList = abonosSnapshot.docs.map(doc => doc.data() as Abono);
        setAbonos(abonosList);
      } catch (error) {
        setError('Error al obtener los abonos.');
      } finally {
        setLoading(false);
      }
    };

    fetchAbonos();
  }, [doctorUid, patientUid]);

  const handleAddPayment = async () => {
    const newAbono: Abono = {
      amount: newPayment,
      date: new Date().toLocaleDateString(),
    };

    try {
      await addDoc(collection(db, 'doctors', doctorUid, 'pacientes', patientUid, 'abonos'), newAbono);
      
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

  if (loading) {
    return <p>Cargando estado de cuentas...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="estado-de-cuentas historia-clinica-oral">
      <h2>Estado de Cuentas</h2>
      <p>Total Abonos: {totalAbonos}</p>
      <button onClick={() => setIsModalOpen(true)}>Agregar Abono</button>
      <button onClick={handlePrintReceipt}>Imprimir Recibo</button>

      {isModalOpen && (
        <div className="modal">
          <h3>Agregar Abono</h3>
          <input
            type="number"
            value={newPayment}
            onChange={(e) => setNewPayment(Number(e.target.value))}
          />
          <button onClick={handleAddPayment}>Agregar</button>
          <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
        </div>
      )}

      <ul>
        {abonos.map((abono, index) => (
          <li key={index}>
            {abono.date}: {abono.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EstadoDeCuentas;