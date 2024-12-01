import axios from "axios";
import {getSession} from "next-auth/react";

export async function getRoles() {
  try {
      const session  = await getSession();
        if(!session ){
            window.location.href = '/auth/signin'; // Redirigir usando JavaScript
            return;
        }
        const res = await axios.get('/api/controllers/roles/getRoles',{
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function asignarRol(body) {
  try {
      const session  = await getSession();
        if(!session ){
            window.location.href = '/auth/signin'; // Redirigir usando JavaScript
            return;
        }
        const res = await axios.post(`/api/controllers/roles/asignarRol`,body,{
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getRolAsignadoByUser(id) {
  try {
      const session  = await getSession();
        if(!session ){
            window.location.href = '/auth/signin'; // Redirigir usando JavaScript
            return;
        }
        const res = await axios.get(`/api/controllers/roles/asignadoById/${id}`,{
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function removeRol(user_id,rol_id) {
  try {
      const session  = await getSession();
        if(!session ){
            window.location.href = '/auth/signin'; // Redirigir usando JavaScript
            return;
        }
        const body = {
            user_id:user_id,
            rol_id: rol_id
        }
        const res = await axios.post(`/api/controllers/roles/removeRol`,body,{
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function asignarSs(body) {
  try {
      const session  = await getSession();
        if(!session ){
            window.location.href = '/auth/signin'; // Redirigir usando JavaScript
            return;
        }
        const res = await axios.post(`/api/controllers/roles/asignar_ss`,body,{
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function quitarSs(user_id,ss_id) {
  try {
      const session  = await getSession();
        if(!session ){
            window.location.href = '/auth/signin'; // Redirigir usando JavaScript
            return;
        }
        const body = {
            user_id:user_id,
            ss_id: ss_id
        }
        const res = await axios.post('/api/controllers/roles/quitar_ss',body,{
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function asignarEstablecimiento(body) {
  try {
      const session  = await getSession();
        if(!session ){
            window.location.href = '/auth/signin'; // Redirigir usando JavaScript
            return;
        }
        const res = await axios.post(`/api/controllers/roles/asignar_establecimiento`,body,{
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function quitarEstablecimiento(user_id,establecimiento_id) {
  try {
      const session  = await getSession();
        if(!session ){
            window.location.href = '/auth/signin'; // Redirigir usando JavaScript
            return;
        }
        const body = {
            user_id:user_id,
            establecimiento_id: establecimiento_id
        }
        const res = await axios.post('/api/controllers/roles/quitar_establecimiento',body,{
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
