import { getServerSession } from 'next-auth';
import { authOptions } from '@/api';
import axios from "axios";
import { Readable } from 'stream';
import FormData from 'form-data';
import {SigteAPICargas} from "../../../../base/BaseUrl";




const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    const session = await getServerSession(req, res, authOptions);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Falta el encabezado de autorización' });
    }
    const token = authHeader.split(' ')[1];
    try {
        if (!session) {
            return res.status(401).json({ message: 'No estás autorizado para acceder a esta ruta' });
        }
        if (req.method === 'GET') {
            try {
                const {tipo_carga_id, id} = req.query
                // Reemplaza con tu URL de la API de Python
                const response = await SigteAPICargas.get(`/download_error_file/${tipo_carga_id}/${id}`,{
                    responseType: 'arraybuffer'
                });
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${response.headers['content-disposition']}"`);
                return res.send(response.data);
                //Aqui se hace el llamado
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }
        return res.status(405).json({ message: 'Método no permitido' });

        // Aquí continúa la lógica de la función API
    } catch (error) {
        return res.status(401).json({ message: 'Token no válido' });
    }
}
