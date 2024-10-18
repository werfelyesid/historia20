import { db } from '../firebaseConfig'; // Importar configuración de Firestore

export const getPreciosTratamientos = async () => {
  const preciosSnapshot = await db.collection('preciosTratamientos').get();
  const preciosData = {};
  preciosSnapshot.forEach(doc => {
    preciosData[doc.id] = doc.data();
  });
  return preciosData;
};

export const actualizarPrecioTratamiento = async (preciosActualizados) => {
  const batch = db.batch();

  Object.keys(preciosActualizados).forEach(categoria => {
    const categoriaRef = db.collection('preciosTratamientos').doc(categoria);
    batch.set(categoriaRef, preciosActualizados[categoria]);
  });

  await batch.commit();
};
