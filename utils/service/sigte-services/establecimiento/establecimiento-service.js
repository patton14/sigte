import axios from 'axios'
import { getSession } from 'next-auth/react'

export async function getAllEstablecimientos(){
    try {
        const {jwt} = await getSession();
        const response = await axios.get('/api/controllers/establecimiento/get-all',{
            headers:{
                Authorization: `Bearer ${jwt}`
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
        return null

    }
}

export async function getEstablecimientoBySs(ss){
    try {
        const {jwt} = await getSession();
        const response = await axios.get(`/api/controllers/establecimiento/ss/${ss}`,{
            headers:{
                Authorization: `Bearer ${jwt}`
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
        return null
    }
}

export async function getEstablecimientoById(id){
    try {
        const {jwt} = await getSession();
        const response = await axios.get(`/api/controllers/establecimiento/id/${id}`,{
            headers:{
                Authorization: `Bearer ${jwt}`
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
        return null
    }
}
