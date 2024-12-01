import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { InactivityProvider } from '@/layout/context/InactivityContext';

const Dashboard = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const getStatusSession = async () => {
        if (session?.resetPass) {
            router.push('/admin/cambio-pass');
        }
    };
    useEffect(() => {
        getStatusSession();
    }, [session?.user?.name]);
    // Renderizar el indicador de carga mientras se comprueba el estado

    return (
        <>
            <InactivityProvider>

            </InactivityProvider>

        </>
    );
};


export default Dashboard;

