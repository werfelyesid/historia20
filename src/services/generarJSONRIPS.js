const generarJSONRIPS = (datosRIPS) => {
    const rips = {
      version: "1.0",
      paciente: {
        id: datosRIPS.paciente.id,
        nombre: `${datosRIPS.paciente.nombre} ${datosRIPS.paciente.apellido}`,
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
  