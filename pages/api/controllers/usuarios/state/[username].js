import { getServerSession } from 'next-auth';
import { authOptions } from '@/api';
import jwt from 'jsonwebtoken';
import {SigteAPIUsuarios} from "../../../base/BaseUrl";

const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            try {
                const { username } = req.query;
                //Aqui se hace el llamado
                const result = await SigteAPIUsuarios.get(`/getStatusPassByUsername/${username}`);
                return res.status(201).json(result.data);
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
