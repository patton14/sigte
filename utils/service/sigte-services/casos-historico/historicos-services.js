import axios from 'axios';
import { getSession } from 'next-auth/react';

export const getAllCasosHistorico = async (page = 1, size = 50) => {
    try {
        const { jwt } = await getSession();
        const result = await axios.get(`/api/controllers/casos-historico/get-all?page=${page}&size=${size}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return result.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getCountCasosHistorico = async () => {
    try {
        const { jwt } = await getSession();
        return await axios.get('/api/controllers/casos-historico/count', {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
    } catch (error) {
        return error.response;
    }
};

export const getCountCasosHistoricoByServicioSalud = async (ss_body) => {
    try {
        const { jwt } = await getSession();
        return await axios.post(`/api/controllers/casos-historico/count_ss`, ss_body, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
    } catch (error) {
        return error.response;
    }
};

export const getCountCasosHistoricoByEstablecimiento = async (est_body) => {
    try {
        const { jwt } = await getSession();
        return await axios.post(`/api/controllers/casos-historico/count_est`, est_body, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
    } catch (error) {
        return error.response;
    }
};

export const getAllCasosHistoricoBySigteId = async (id) => {
    try {
        const { jwt } = await getSession();
        return await axios.get(`/api/controllers/casos-historico/get-by-sigte-id/${id}`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
    } catch (error) {
        return error.response;
    }
};

export const getAllCasosHistoricoByServicioSalud = async (body, page, size) => {
    try {
        const { jwt } = await getSession();
        return await axios.post(`/api/controllers/casos-historico/get-by-servicio-salud/${page}?size=${size}`, body,{
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
    } catch (error) {
        return error.response;
    }
};

export const getAllCasosHistoricoByEstablecimiento = async (body, page, size) => {
    try {
        const { jwt } = await getSession();
        return await axios.post(`/api/controllers/casos-historico/get-by-establecimiento/${page}?size=${size}`, body, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
    } catch (error) {
        return error.response;
    }
};
