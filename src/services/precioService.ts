import { db } from '../firebaseConfig'; // Importar configuración de Firestore
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';

// Definir la interfaz para los precios de tratamientos
interface PreciosTratamientos {
  [key: string]: any;
}

export const getPreciosTratamientos = async (): Promise<PreciosTratamientos> => {
  const preciosSnapshot = await getDocs(collection(db, 'preciosTratamientos'));
  const preciosData: PreciosTratamientos = {};
  preciosSnapshot.forEach((doc) => {
    preciosData[doc.id] = doc.data();
  });
  return preciosData;
};

export const actualizarPrecioTratamiento = async (preciosActualizados: PreciosTratamientos): Promise<void> => {
  const batch = writeBatch(db);

  Object.keys(preciosActualizados).forEach((categoria) => {
    const categoriaRef = doc(db, 'preciosTratamientos', categoria);
    batch.set(categoriaRef, preciosActualizados[categoria]);
  });

  await batch.commit();
};