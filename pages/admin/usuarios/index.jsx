import React from 'react';
import MainUsuarios from '@/components/admin/usuarios-components/main-usuarios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api';
import { InactivityProvider } from '@/layout/context/InactivityContext';

const UsuariosIndex = () => {
    return (
        <>
            <InactivityProvider>
                <MainUsuarios />
            </InactivityProvider>
        </>
    );
};

export async function getServerSideProps(context) {
    const allowedRoles = [1];
    const session = await getServerSession(context.req, context.res, authOptions);
    const roles = session?.roles.Authorizations;
    const exist = roles?.some((role) => allowedRoles.includes(role.RolID));

    console.log(exist);
    if (!exist) {
        return {
            redirect: {
                destination: '/notauth',
                permanent: false
            }
        };
    }
    return {
        props: {
            session
        } // Pasar los props necesarios para tu página aquí
    };
}

export default UsuariosIndex;
