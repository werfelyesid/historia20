interface Paciente {
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  edad: number;
  genero: string;
}

interface Servicio {
  codigo: string;
  descripcion: string;
  cantidad: number;
  valorUnitario: number;
  valorTotal: number;
}

interface DatosRIPS {
  paciente: Paciente;
  servicios: Servicio[];
  totalServicios: number;
  fechaPrestacion: string;
}

const generarJSONRIPS = (datosRIPS: DatosRIPS): string => {
  const rips = {
    version: "1.0",
    paciente: {
      nombre: datosRIPS.paciente.nombre,
      tipoDocumento: datosRIPS.paciente.tipoDocumento,
      numeroDocumento: datosRIPS.paciente.numeroDocumento,
      edad: datosRIPS.paciente.edad,
      genero: datosRIPS.paciente.genero,
    },
    servicios: datosRIPS.servicios.map((servicio) => ({
      codigo: servicio.codigo,
      descripcion: servicio.descripcion,
      cantidad: servicio.cantidad,
      valorUnitario: servicio.valorUnitario,
      valorTotal: servicio.valorTotal,
    })),
    totalServicios: datosRIPS.totalServicios,
    fechaPrestacion: datosRIPS.fechaPrestacion,
  };

  return JSON.stringify(rips, null, 2);
};

export default generarJSONRIPS;