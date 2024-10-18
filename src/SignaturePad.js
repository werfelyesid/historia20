import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './SignaturePad.css'; // Opcional para agregar estilos

const SignaturePad = ({ onSave }) => {
  const sigCanvas = useRef({});

  const clear = () => {
    sigCanvas.current.clear();
  };

  const save = () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Por favor, firma en el recuadro.");
    } else {
      const signature = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      onSave(signature); // Pasa la firma al padre
    }
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
      />
      <button onClick={clear}>Limpiar</button>
      <button onClick={save}>Guardar Firma</button>
    </div>
  );
};

export default SignaturePad;
