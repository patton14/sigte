import { getServerSession } from 'next-auth';
import { authOptions } from '@/api';
import jwt from 'jsonwebtoken';
import { SigteAPIPrivilegios } from '@/pages/api/base/BaseUrl';

const jwtSecret = process.env.JWT_SECRET;

export default async function handler(req, res) {
    const authHeader = req.headers.authorization;
    const session = await getServerSession(req, res, authOptions);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Falta el encabezado de autorización' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (!session) {
            return res.status(401).json({ message: 'No estás autorizado para acceder a esta ruta' });
        }
        if (req.method === 'POST') {
            try {
                const body = req.body;
                //Aqui se hace el llamado
                const result = await SigteAPIPrivilegios.post('/user_auth/asignar_servicio', body);
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
