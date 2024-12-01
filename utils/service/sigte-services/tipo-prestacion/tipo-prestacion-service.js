import axios from 'axios'
import { getSession } from 'next-auth/react'

export async function getAllTipoPrestaciones(){
    try {
        const {jwt} = await getSession();
        const response = await axios.get('/api/controllers/tipo-prestacion/get-all',{
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        })
        return response.data;
    } catch (error) {
        console.log(error);
        return null

    }
}
