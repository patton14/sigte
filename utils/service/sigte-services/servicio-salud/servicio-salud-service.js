import axios from 'axios'
import {getSession} from "next-auth/react";

export async function getServiciosSalud() {
  try {
      const { jwt } = await getSession();
      const res = await axios.get('/api/controllers/servicios-salud/getAllServicios', {
          headers: {
              Authorization: `Bearer ${jwt}`
          }
      })
        return res.data
  } catch (error) {
      console.log(error)
      return null
  }
}
