import axios from 'axios';
import {getSession, signIn} from "next-auth/react";

export async function getAllUsuarios() {
    try{
        const session  = await getSession();
        if(!session ){
            window.location.href = '/auth/signin'; // Redirigir usando JavaScript
            return;
        }
        const res = await axios.get('/api/controllers/usuarios/getAllUsuarios', {
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        return res.data;
    }catch (error){
        console.log(error);
        return null;
    }
}

export async function createUser(user) {
    try{
        const session  = await getSession();
        if(!session ){
            window.location.href = '/auth/signin'; // Redirigir usando JavaScript
            return;
        }
        const res = await axios.post('/api/controllers/usuarios/createUser', user, {
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        return res.data;
    }catch (error){
        console.log(error);
        return null;
    }
}

export async function updateUser(user,id) {
    try{
        const session  = await getSession();
        if(!session ){
            window.location.href = '/auth/signin'; // Redirigir usando JavaScript
            return;
        }
        const res = await axios.patch(`/api/controllers/usuarios/update/${id}`, user, {
            headers: {
                Authorization: `Bearer ${session.jwt}`,
            },
        });
        return res.data;
    }catch (error){
        console.log(error);
        return null;
    }
}

export async function getStateUser(username) {
    try{
        const res = await axios.get(`/api/controllers/usuarios/state/${username}`);
        return res.data;
    }catch (error){
        console.log(error);
        return null;
    }
}

export async function resetPass(body) {
    try{
        const res = await axios.post(`/api/controllers/usuarios/reset-pass/reset-method`, body);
        return res.data;
    }catch (error){
        console.log(error);
        return null;
    }
}
