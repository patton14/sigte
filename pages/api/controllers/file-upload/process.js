import { getServerSession } from 'next-auth';
import { authOptions } from '@/api';
import { Readable } from 'stream';
import FormData from 'form-data';
import { SigteValidateExcel } from '@/pages/api/base/BaseUrl';

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
        if (req.method === 'POST') {
            try {
                const { file, servicio_salud_id, tipo_carga_id, cod_usuario, fileName, fecha_creacion } = req.body;
                const base64Data = file.split(';base64,').pop();
                const buffer = Buffer.from(base64Data, 'base64');

                // Crear un stream Readable a partir del buffer
                const stream = new Readable();
                stream.push(buffer);
                stream.push(null); // Indica el final del stream

                const formData = new FormData();
                formData.append('file', stream, fileName);
                formData.append('servicio_salud_id', servicio_salud_id);
                formData.append('tipo_carga_id', tipo_carga_id);
                formData.append('cod_usuario', cod_usuario);
                formData.append('estado_carga', 1);
                formData.append('fecha_creacion', fecha_creacion);
                const response = await SigteValidateExcel.post('/process', formData, {
                    headers: {
                        ...formData.getHeaders(),
                    },
                });
                console.log(response.status);
                if(response.status === 200){
                    const responseData = await response.data;
                    return res.status(200).json(responseData);
                }
                const responseData = await response.data;
                return res.status(201).json(responseData);
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }
        return res.status(405).json({ message: 'Método no permitido' });
    } catch (error) {
        return res.status(401).json({ message: 'Token no válido' });
    }
}
