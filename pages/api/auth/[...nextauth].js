import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from 'crypto';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { decode } from 'jsonwebtoken';
import { log } from "console";
import {redirect} from "next/navigation";
import { SigteAPIPrivilegios, SigteAPIRolAsignacion, SigteAPIUsuarios } from '../base/BaseUrl';

function md5Hash(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
const jwtSecret = process.env.JWT_SECRET;
const ROLES = [1000,1002,1003,1004,1005]
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
export const authOptions={
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password:  { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const hashedPassword = md5Hash(credentials.password);
        const recaptchaToken = credentials.captcha;
        // Aquí conectarías con tu backend NestJS para validar las credenciales
        try {
            const googleResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
                params: {
                    secret: recaptchaSecretKey,
                    response: recaptchaToken,
                },
            });

            if (googleResponse.data.success) {
                //autentica
                const res = await SigteAPIUsuarios.post('/auth', {
                    username: credentials.username,
                    password: hashedPassword
                });



                let data = res.data;
                //autoriza
                const { data: roles } = await SigteAPIPrivilegios.get(`/user_auth/${data[0].id}`) || [];
                console.log(roles);
                //const {data:roles} = await SigteAPIRolAsignacion.get(`/user/${data[0].id}/codes`) || [];
                //const newRoles = await
                let user = {
                    id: data[0].id,
                    name: data[0].rut,
                    nombre: data[0]?.nombre || 'No registrado',
                    email: data[0]?.mail || 'no registrado',
                    image: null,
                    resetPass: data[0].resetPass,
                    rol: roles
                };
                if (data[1] === 202) {
                    return user;
                }
                return null;
            }


            return null;



        } catch (error) {
            // Puedes manejar errores específicos aquí si lo deseas
            return null;
        }

      }
    })
  ],
  pages: {
    signIn: '/auth/signin',  // Ruta personalizada para la página de inicio de sesión
  },
  callbacks: {
    async signIn({ user, account, credentials }) {
        // console.log(credentials);
        if (user) {
            return user;
        } else {
            // Return false to display a default error message
            return false
            // Or you can return a URL to redirect to:
            // return '/unauthorized'
        }
    },
    async redirect(options) {
        return options.baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
        if (user?.rol) {
            token.rol = user?.rol;
            token.user_code = user?.id;
            token.resetPass = user?.resetPass;
            token.nombre = user?.nombre || 'No informado';
            const newToken = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, jwtSecret, {
                expiresIn: '5m'
            });
            token.jwt = newToken;
        }
        return token; // Asegúrate de que el token se devuelva siempre
    },
    async session({ session, user, token }) {
        //session.user.image = null;
        if (token) {
            session.roles = token.rol;
            session.user_code = token.user_code;
            session.resetPass = token.resetPass;
            session.jwt = token.jwt;
            token?.nombre ? (session.nombre = token?.nombre) : null;
            const decodedToken = decode(token.jwt);
            const currentTime = Math.floor(Date.now() / 1000);
            const expiresIn = decodedToken.exp - currentTime;
            if (expiresIn < 5) {
                const newToken = jwt.sign({ id: decodedToken.id, email: decodedToken.email, rol: decodedToken.rol }, jwtSecret, {
                    expiresIn: '5m' // Hacer que el nuevo token JWT expire en 10 segundos
                });
                token.jwt = newToken;
                session.jwt = newToken;
            } else {
                session.jwt = token.jwt;
            }
        } else {
            session.roles = [];
        }
        session.roles = token.rol;
        return session;
    }

},session: {
    jwt: true,
    maxAge: 18000000, // 5 horas
    //cookie: { maxAge: 10, path: "/", sameSite: "lax", timeZone: "America/Santiago" },
}


  // Puedes agregar más configuraciones aquí si es necesario
};
export default NextAuth(authOptions);
