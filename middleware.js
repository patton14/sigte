import { withAuth } from "next-auth/middleware"

// Definir los códigos de roles requeridos
const REQUIRED_ROLES = [1, 2, 3, 4, 5]; // Ajusta según los roles que necesitas verificar

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req) {
        //console.log('User token:', req.nextauth.token);

        // Extraer los RolID de los roles asignados al usuario
        const userRoles = req.nextauth.token?.rol?.Authorizations?.map(role => role.RolID) || [];

        // Verificar si el usuario tiene al menos uno de los roles requeridos
        const hasRequiredRole = REQUIRED_ROLES.some(roleID =>
            userRoles.includes(roleID)
        );

        if (!hasRequiredRole) {
            console.log('User does not have the required roles');
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // Extraer los RolID de los roles asignados al usuario
                const userRoles = token?.rol?.Authorizations?.map(role => role.RolID) || [];

                // Verificar si el usuario tiene al menos uno de los roles requeridos
                return REQUIRED_ROLES.some(roleID =>
                    userRoles.includes(roleID)
                );
            }
        }
    }
)

export const config = {
    matcher: [
        '/',
        '/casos/cargas/',
        '/casos/bandeja',
        '/casos/consulta',
        '/casos/historial',
        '/maestros/alerta',
        '/maestros/causales',
        '/maestros/configuracion-notificacion',
        '/maestros/errores-sigte',
        '/maestros/establecimientos',
        '/maestros/estado-caso',
        '/maestros/homologacion-especialidad',
        '/maestros/prestaciones',
        '/maestros/tipo-prestacion',
        '/maestros/universo',
        '/admin/usuarios/',
        '/admin/cambio-pass',
    ],
}
