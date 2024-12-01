
import {SigteAPIUsuarios} from "../../../base/BaseUrl";
import axios from "axios";

const jwtSecret = process.env.JWT_SECRET;
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            try {
                const body = req.body;
                const googleResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
                    params: {
                        secret: recaptchaSecretKey,
                        response: body.captcha,
                    },
                });
                if (googleResponse.data.success) {
                    const result = await SigteAPIUsuarios.patch(`/resetClave/${body.mail}`, {});
                    return res.status(201).json(result.data);
                }
                return res.status(500).json({message: 'Error en la validación de reCaptcha'});

            } catch (error) {
                return res.status(500).json({message: error.message});
            }
        }
        return res.status(405).json({message: 'Método no permitido'});

        // Aquí continúa la lógica de la función API
    } catch (error) {
        return res.status(401).json({message: 'Token no válido'});
    }
}
