import React from 'react';
import MainBandeja from '@/components/casos/bandeja/main-bandeja';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api';
import { InactivityProvider } from '@/layout/context/InactivityContext';


const BandejaIndex = () => {
    return (
        <>
            <InactivityProvider>
                <MainBandeja />
            </InactivityProvider>
        </>
    );
};

export async function getServerSideProps(context) {
    const allowedRoles = [1, 2, 4, 5];
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

export default BandejaIndex;
