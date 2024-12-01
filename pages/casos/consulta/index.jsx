import MainConsultaRut from '@/components/casos/consulta-por-rut/main-consulta-rut'
import React from 'react'
import { InactivityProvider } from '@/layout/context/InactivityContext';

function ConsultaIndex() {
    return (
        <>
            <InactivityProvider>
                <MainConsultaRut/>
            </InactivityProvider>
        </>
    )
}

export default ConsultaIndex
