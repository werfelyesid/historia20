import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import './HistoriaClinicaOral.css';

const HistoriaClinicaOral = ({ doctorId, patientId, onClose }) => {
  const initialValues = {
    enfermedadActual: '',
    antecedentesPersonales: '',
    compromisoSistemico: '',
    medicacion: '',
    alergias: '',
    habitos: '',
    tensionArterial: '',
    frecuenciaCardiaca: '',
    frecuenciaRespiratoria: '',
    examenClinico: ''
  };

  const validationSchema = Yup.object({
    enfermedadActual: Yup.string(),
    antecedentesPersonales: Yup.string(),
    compromisoSistemico: Yup.string(),
    medicacion: Yup.string(),
    alergias: Yup.string(),
    habitos: Yup.string(),
    tensionArterial: Yup.string(),
    frecuenciaCardiaca: Yup.string(),
    frecuenciaRespiratoria: Yup.string(),
    examenClinico: Yup.string()
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const docRef = doc(db, 'doctors', doctorId, 'pacientes', patientId);
    await setDoc(docRef, values, { merge: true });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="historia-clinica-oral">
      <h2>ANAMNESIS</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <h3>Enfermedad actual y duración:</h3>
              <Field type="text" name="enfermedadActual" />
              <ErrorMessage name="enfermedadActual" component="div" className="error" />
            </div>

            <div>
              <h3>Antecedentes personales en odontología y medicina general:</h3>
              <Field type="text" name="antecedentesPersonales" />
              <ErrorMessage name="antecedentesPersonales" component="div" className="error" />
            </div>

            <div>
              <h3>Compromiso sistémico:</h3>
              <Field type="text" name="compromisoSistemico" />
              <ErrorMessage name="compromisoSistemico" component="div" className="error" />
            </div>

            <div>
              <h3>Medicación:</h3>
              <Field type="text" name="medicacion" />
              <ErrorMessage name="medicacion" component="div" className="error" />
            </div>

            <div>
              <h3>Alergias:</h3>
              <Field type="text" name="alergias" />
              <ErrorMessage name="alergias" component="div" className="error" />
            </div>

            <div>
              <h3>Hábitos (Bruxismo, Succión digital, Respirador oral, Onicofagia, Queilofagia):</h3>
              <Field type="text" name="habitos" />
              <ErrorMessage name="habitos" component="div" className="error" />
            </div>

            <h2>EXAMEN FÍSICO</h2>
            <div>
              <h3>Tensión arterial:</h3>
              <Field type="text" name="tensionArterial" /> mmHg
              <ErrorMessage name="tensionArterial" component="div" className="error" />
            </div>

            <div>
              <h3>Frecuencia cardíaca:</h3>
              <Field type="text" name="frecuenciaCardiaca" />
              <ErrorMessage name="frecuenciaCardiaca" component="div" className="error" />
            </div>

            <div>
              <h3>Frecuencia respiratoria:</h3>
              <Field type="text" name="frecuenciaRespiratoria" />
              <ErrorMessage name="frecuenciaRespiratoria" component="div" className="error" />
            </div>

            <h2>EXAMEN CLÍNICO</h2>
            <div>
              <Field as="textarea" name="examenClinico" />
              <ErrorMessage name="examenClinico" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Guardar cambios y ocultar
            </button>
            <button type="button" onClick={onClose}>
              Cancelar y ocultar
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default HistoriaClinicaOral;
