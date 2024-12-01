import React from 'react';

import ListadoYFiltradoCargas from '@/components/casos/carga-masiva/listado-y-filtrado-cargas';
import { InactivityProvider } from '@/layout/context/InactivityContext';

const Cargas = ({ limitador }) => {
    return (
        <>
            <InactivityProvider>
                <ListadoYFiltradoCargas limitador={limitador} />
            </InactivityProvider>
        </>
    );
};
export const getServerSideProps = async (context) => {
    const limitador = process.env.LIMITADOR_FILAS_EXCEL;
    return {
        props: {
            limitador
        }
    };

};

export default Cargas;
