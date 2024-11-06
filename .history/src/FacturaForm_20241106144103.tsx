import React, { useState, ChangeEvent } from 'react';
import { saveAs } from 'file-saver';
import generarXMLFactura from './services/generarXMLFactura';

interface Emisor {
  nit: string;
  razonSocial: string;
  direccion: string;
  ciudad: string;
}

interface Receptor {
  nit: string;
  razonSocial: string;
  direccion: string;
  ciudad: string;
}

interface Detalle {
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
}

interface Impuestos {
  iva: number;
  totalImpuestos: number;
}

interface FormData {
  emisor: Emisor;
  receptor: Receptor;
  detalles: Detalle[];
  impuestos: Impuestos;
  totalFactura: number;
  fechaEmision: string;
}

const FacturaForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    emisor: {
      nit: '',
      razonSocial: '',
      direccion: '',
      ciudad: '',
    },
    receptor: {
      nit: '',
      razonSocial: '',
      direccion: '',
      ciudad: '',
    },
    detalles: [
      { descripcion: '', cantidad: 1, valorUnitario: 0, valorTotal: 0 }
    ],
    impuestos: {
      iva: 0,
      totalImpuestos: 0,
    },
    totalFactura: 0,
    fechaEmision: new Date().toISOString(),
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, section: string, index?: number) => {
    const { name, value } = e.target;
    if (section === 'detalles' && index !== undefined) {
      const newDetalles = [...formData.detalles];
      const key = name as keyof Detalle;
      newDetalles[index][key] = key === 'cantidad' || key === 'valorUnitario' ? Number(value) : value;
      newDetalles[index].valorTotal = newDetalles[index].cantidad * newDetalles[index].valorUnitario;
      setFormData({
        ...formData,
        detalles: newDetalles,
        totalFactura: newDetalles.reduce((acc, item) => acc + item.valorTotal, 0),
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section as keyof FormData],
          [name]: value,
        },
      });
    }
  };

  const handleAddDetail = () => {
    setFormData({
      ...formData,
      detalles: [...formData.detalles, { descripcion: '', cantidad: 1, valorUnitario: 0, valorTotal: 0 }],
    });
  };

  const handleGenerateXML = () => {
    const xmlFactura = generarXMLFactura(formData);
    const blobXML = new Blob([xmlFactura], { type: 'application/xml' });
    saveAs(blobXML, 'facturaElectronica.xml');
  };

  return (
    <div>
      <h2>Generar Factura</h2>
      <h3>Datos del Emisor</h3>
      <input type="text" name="nit" placeholder="NIT" value={formData.emisor.nit} onChange={(e) => handleInputChange(e, 'emisor')} />
      <input type="text" name="razonSocial" placeholder="Razón Social" value={formData.emisor.razonSocial} onChange={(e) => handleInputChange(e, 'emisor')} />
      <input type="text" name="direccion" placeholder="Dirección" value={formData.emisor.direccion} onChange={(e) => handleInputChange(e, 'emisor')} />
      <input type="text" name="ciudad" placeholder="Ciudad" value={formData.emisor.ciudad} onChange={(e) => handleInputChange(e, 'emisor')} />
      
      <h3>Datos del Receptor</h3>
      <input type="text" name="nit" placeholder="NIT" value={formData.receptor.nit} onChange={(e) => handleInputChange(e, 'receptor')} />
      <input type="text" name="razonSocial" placeholder="Razón Social" value={formData.receptor.razonSocial} onChange={(e) => handleInputChange(e, 'receptor')} />
      <input type="text" name="direccion" placeholder="Dirección" value={formData.receptor.direccion} onChange={(e) => handleInputChange(e, 'receptor')} />
      <input type="text" name="ciudad" placeholder="Ciudad" value={formData.receptor.ciudad} onChange={(e) => handleInputChange(e, 'receptor')} />

      <h3>Detalles</h3>
      {formData.detalles.map((detalle, index) => (
        <div key={index}>
          <input type="text" name="descripcion" placeholder="Descripción" value={detalle.descripcion} onChange={(e) => handleInputChange(e, 'detalles', index)} />
          <input type="number" name="cantidad" placeholder="Cantidad" value={detalle.cantidad} onChange={(e) => handleInputChange(e, 'detalles', index)} />
          <input type="number" name="valorUnitario" placeholder="Valor Unitario" value={detalle.valorUnitario} onChange={(e) => handleInputChange(e, 'detalles', index)} />
          <input type="number" name="valorTotal" placeholder="Valor Total" value={detalle.valorTotal} readOnly />
        </div>
      ))}
      <button onClick={handleAddDetail}>Agregar Detalle</button>

      <h3>Impuestos</h3>
      <input type="number" name="iva" placeholder="IVA" value={formData.impuestos.iva} onChange={(e) => handleInputChange(e, 'impuestos')} />
      <input type="number" name="totalImpuestos" placeholder="Total Impuestos" value={formData.impuestos.totalImpuestos} readOnly />

      <h3>Total Factura: {formData.totalFactura}</h3>
      <button onClick={handleGenerateXML}>Generar XML</button>
    </div>
  );
}

export default FacturaForm;