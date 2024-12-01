import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import React from 'react';
import BuscadorTipoPrestacion from '@/components/maestros/tipo-prestacion/buscador-tipo-prestacion/buscador-tipo-prestacion';
import TablaTipoPrestacion from '@/components/maestros/tipo-prestacion/tabla-tipoprestaciones/tabla-tipo-prestacion';

function MainTipoPrestacion() {
    return (
        <>
            <Card title="Tipo Prestación">
               {/* <Button icon="pi pi-plus" label="Crear" severity="success" />
                <Divider/>
                <BuscadorTipoPrestacion/>*/}
                <TablaTipoPrestacion/>
            </Card>
        </>
    );
}

export default MainTipoPrestacion;
