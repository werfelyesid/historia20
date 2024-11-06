export interface Patient {
    uid: string;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    identificacion: string;
    genero: string;
    fechaNacimiento: string;
    edad: number;
    estadoCivil: string;
    celular: string;
    domicilio: string;
    ocupacion: string;
    motivoConsulta: string;
    historiaMedica: string;
  }