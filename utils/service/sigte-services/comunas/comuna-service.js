import axios from 'axios';
import { getSession } from 'next-auth/react';

export const getComunas = async () => {
  try {
      const {jwt} = await getSession()
      return await axios.get('/api/controllers/comunas/get-all',{
            headers: {
                Authorization: `Bearer ${jwt}`
            }
      })
  } catch (error) {
    return error.response
  }
}
