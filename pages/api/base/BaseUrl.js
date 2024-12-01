import axios from "axios";

export const SigteAPIservicioSalud = axios.create({
    baseURL: process.env.API_SERVICIO_SALUD+'/serviciosalud'
});

export const SigteAPITipoCargas = axios.create({
    baseURL: process.env.API_TIPO_CARGA+'/tipocarga'
});

export const SigteAPIEstadoCargas = axios.create({
  baseURL: process.env.API_ESTADO_CARGAS+'/estadocarga'
})

export const SigteAPICargas = axios.create({
    baseURL: process.env.API_CARGAS+'/loadfile'
})


export const SigteAPIUsuarios = axios.create({
    baseURL: process.env.API_USUARIOS+'/sigteauth'
});

export const SigteAPIRoles = axios.create({
    baseURL: process.env.API_ROLES+'/roles'
});

export const SigteAPIRolAsignacion = axios.create({
    baseURL: process.env.API_ROL_ASIGNACION+'/asignaciones'
});

export const SigteAPIPrivilegios = axios.create({
    baseURL: process.env.API_PRIVILEGIOS+'/api-autorization'
});

export const SigteAPITipoPrestacion = axios.create({
    baseURL: process.env.API_TIPO_PRESTACION+'/tipoprestacion'
});

export const SigteAPIEstablecimiento = axios.create({
    baseURL: process.env.API_ESTABLECIMIENTO+'/establecimiento'
});

export const SigteAPICasos = axios.create({
    baseURL: process.env.API_CASOS+'/casos',
    headers: {
        'Accept-Encoding': 'gzip, deflate',  // Aceptar gzip y otros métodos de compresión
    },
    decompress: true  // Esta opción asegura que axios maneje la compresión
});

export const SigteAPICasosHistorico = axios.create({
    baseURL: process.env.API_CASOS_HISTORICOS+'/'
});

export const SigteValidateExcel = axios.create({
    baseURL: process.env.API_VALIDATE_EXCEL+'/'
});

export const SigteAPIComunas = axios.create({
    baseURL: process.env.API_COMUNAS+'/comuna'
});

