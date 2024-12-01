import MainHistorial from '@/components/casos/historial/main-historial';
import React from 'react';
import { SigteAPIEstablecimiento } from '../../api/base/BaseUrl';
import { InactivityProvider } from '@/layout/context/InactivityContext';

function HistorialIndex() {
    return (
        <>
            <InactivityProvider>
                <MainHistorial />
            </InactivityProvider>
        </>
    );
}


export default HistorialIndex;
