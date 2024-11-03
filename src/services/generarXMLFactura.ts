import { parse } from "js2xmlparser";

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

interface DatosFactura {
  emisor: Emisor;
  receptor: Receptor;
  detalles: Detalle[];
  impuestos: Impuestos;
  totalFactura: number;
  fechaEmision: string;
}

const generarXMLFactura = (datosFactura: DatosFactura): string | null => {
  // Validación previa para asegurarnos de que datosFactura y sus propiedades existen
  if (!datosFactura || !datosFactura.emisor || !datosFactura.receptor || !datosFactura.detalles || !datosFactura.impuestos) {
    console.error("Datos de factura incompletos o incorrectos");
    return null;
  }

  // Validaciones adicionales por cada campo requerido
  if (!datosFactura.emisor.nit || !datosFactura.emisor.razonSocial || !datosFactura.receptor.nit) {
    console.error("Algunos campos requeridos están faltando");
    return null;
  }

  const factura = {
    Version: "1.0",
    Emisor: {
      NIT: datosFactura.emisor.nit,
      RazonSocial: datosFactura.emisor.razonSocial,
      Direccion: datosFactura.emisor.direccion,
      Ciudad: datosFactura.emisor.ciudad,
    },
    Receptor: {
      NIT: datosFactura.receptor.nit,
      RazonSocial: datosFactura.receptor.razonSocial,
      Direccion: datosFactura.receptor.direccion,
      Ciudad: datosFactura.receptor.ciudad,
    },
    Detalles: {
      Detalle: datosFactura.detalles.map((detalle) => ({
        Descripcion: detalle.descripcion,
        Cantidad: detalle.cantidad,
        ValorUnitario: detalle.valorUnitario,
        ValorTotal: detalle.valorTotal,
      })),
    },
    Impuestos: {
      IVA: datosFactura.impuestos.iva,
      TotalImpuestos: datosFactura.impuestos.totalImpuestos,
    },
    TotalFactura: datosFactura.totalFactura,
    FechaEmision: datosFactura.fechaEmision,
  };

  // Llamar a parse directamente sin repetir 'parse'
  const xml = parse("FacturaElectronica", factura);
  return xml;
};

export default generarXMLFactura;