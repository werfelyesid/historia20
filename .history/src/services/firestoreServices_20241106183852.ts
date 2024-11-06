import { db } from '../firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Patient } from '../types';

export const getPatientByUid = async (uid: string): Promise<Patient | null> => {
  try {
    const docRef = doc(db, 'patients', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Patient;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting patient:', error);
    return null;
  }
};

export const getAllPatients = async (): Promise<Patient[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'patients'));
    return querySnapshot.docs.map(doc => doc.data() as Patient);
  } catch (error) {
    console.error('Error getting patients:', error);
    return [];
  }
};