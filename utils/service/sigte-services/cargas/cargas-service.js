import axios from 'axios'
import {getSession} from "next-auth/react";

export async function getCargas(){
    try {
        const {jwt} = await getSession()
        const response = await axios.get('/api/controllers/cargas/getAllCargas', {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        return response.data
    }catch (e){
        console.log(e)
        return null
    }
}

export async function downLoadErrorCarga(rowData) {
    try {
        const { jwt } = await getSession();
        const response = await axios.get(`/api/controllers/file-upload/errors-download/${rowData.tipo_carga_id}/${rowData.id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            },
            responseType: 'arraybuffer'
        });
        // Obtener el nombre del archivo del header
        const contentDisposition = response.headers['content-disposition'];
        const filename = contentDisposition.split('filename=')[1];

        //limpiar comillas
        const FileNamenoCom = filename.replace(/"/g, '');
        // Aplicar expresión regular para limpiar la parte extra del nombre del archivo
        const finalFileName = FileNamenoCom.replace(/_[a-f0-9]{32}_[0-9]{14}_err\.xlsx$/, '').trim();
        const downloadFileName = rowData.estado_carga===3? finalFileName +'_PROCESADO_PARCIAL'+ '.xlsx': finalFileName +'_PROCESADO'+ '.xlsx';
        // Crear un Blob con los datos y definir el tipo de archivo si es conocido
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        // Crear un enlace para la descarga
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', downloadFileName); // Poner el nombre de archivo adecuado aquí
        document.body.appendChild(link);
        link.click();
        // Limpiar y remover el enlace
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function downLoadOriginalFile(rowData) {
    try {
        const { jwt } = await getSession();
        const response = await axios.get(`/api/controllers/file-upload/original-download/${rowData.tipo_carga_id}/${rowData.id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            },
            responseType: 'arraybuffer'
        });
        // Obtener el nombre del archivo del header
        const contentDisposition = response.headers['content-disposition'];
        const filename = contentDisposition.split('filename=')[1];
        //limpiar comillas
        const FileNamenoCom = filename.replace(/"/g, '');
        // Aplicar expresión regular para limpiar la parte extra del nombre del archivo
        const finalFileName = FileNamenoCom.replace(/_[a-f0-9]{32}_[0-9]{14}\.xlsx$/, '').trim();
        const downloadFileName = finalFileName +'_ORIGINAL'+ '.xlsx';
        // Crear un Blob con los datos y definir el tipo de archivo si es conocido
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        // Crear un enlace para la descarga
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', downloadFileName); // Poner el nombre de archivo adecuado aquí
        document.body.appendChild(link);
        link.click();
        // Limpiar y remover el enlace
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const sendToQueue = async (docId) => {
    try {
        const { jwt } = await getSession();
        const response = await axios.get(`/api/controllers/file-upload/send-to-queue/${docId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const cancelarCarga = async (docId) => {
    try {
        const { jwt } = await getSession();
        const response = await axios.get(`/api/controllers/cargas/cancelar-carga/${docId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const cargaPendiente = async (docId) => {
    try {
        const { jwt } = await getSession();
        const response = await axios.get(`/api/controllers/cargas/carga_pendiente/${docId}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const getByServicioSalud = async (id) => {
    try {
        const { jwt } = await getSession();
        const response = await axios.get(`/api/controllers/cargas/by_servicio_salud/${id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const getCargasByEstablecimiento = async (id) => {
    try {
        const { jwt } = await getSession();
        const response = await axios.get(`/api/controllers/cargas/by_establecimiento/${id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}
