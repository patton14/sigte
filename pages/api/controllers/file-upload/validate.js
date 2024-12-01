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
                const { file, ss_id, tipo_carga_id , filterColumns, establecimientos_autorizados } = req.body;
                const base64Data = file.split(';base64,').pop();
                const buffer = Buffer.from(base64Data, 'base64');

                // Crear un stream Readable a partir del buffer
                const stream = new Readable();
                stream.push(buffer);
                stream.push(null); // Indica el final del stream
                const rolID = session.roles.Authorizations.find(auth => auth.RolID===1)?.RolID || 0;
                console.log(rolID);
                const formData = new FormData();
                formData.append('file', stream, 'upload.xlsx');
                formData.append('ss_id', ss_id);
                formData.append('filterColumns', JSON.stringify(filterColumns));
                formData.append('tipo_carga_id', tipo_carga_id);
                formData.append("establecimientos_autorizados", JSON.stringify(establecimientos_autorizados));
                formData.append('usuarioCarga',rolID) ;
                const response = await SigteValidateExcel.post('/validate', formData, {
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
