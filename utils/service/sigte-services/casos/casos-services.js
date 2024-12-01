import axios from 'axios';
import { getSession } from 'next-auth/react';

// Cliente: llamada a la API para obtener casos paginados
export const getAllCasos = async ({ page, limit }) => {
    try {
        const { jwt } = await getSession();  // Obtener el token de sesión
        const result = await axios.post(`/api/controllers/casos/get-all`, { page, limit }, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return result.data;
    } catch (error) {
        return error;
    }
};
export const getTotalCasos = async () => {
    try {
        const { jwt } = await getSession();
        const result = await axios.get(`/api/controllers/casos/count`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return result.data;
    } catch (error) {
        return error;
    }
};export const getTotalCasosBySS = async (data) => {
    try {
        const { jwt } = await getSession();
        const result = await axios.post(`/api/controllers/casos/count-ss`,data, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return result.data;
    } catch (error) {
        return error;
    }
};

export const getAllCasosByServicioSalud = async (body) => {
    try {
        const { jwt } = await getSession();
        return await axios.post(`/api/controllers/casos/get-all-by-servicio-salud`, body,{
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
    } catch (error) {
        return error.response;
    }
}

export const getAllCasosByEstablecimiento = async (id) => {
    try {
        const { jwt } = await getSession();
        return await axios.get(`/api/controllers/casos/get-all-by-establecimiento/${id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
    } catch (error) {
        return error.response;
    }
}

export const getCasosFiltrados = async (filtro,page,limit) => {
    try {
        const { jwt } = await getSession();
        return await axios.post(`/api/controllers/casos/filtro/${page}/${limit}`, filtro, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
    } catch (error) {
        return error.response;
    }
};
