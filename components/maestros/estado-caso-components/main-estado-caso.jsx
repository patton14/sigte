import React from 'react';
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import BuscadorEstadoCaso from "@/components/maestros/estado-caso-components/buscador-estado-caso/buscador-estado-caso";
import TablaEstadoCaso from "@/components/maestros/estado-caso-components/tabla-estado-caso/tabla-estado-caso";

const MainEstadoCaso = () => {
    return (
        <>
            <Card title="Estado de Caso">
                <Button icon="pi pi-plus" label="Crear" severity="success" />
                <Divider/>
                <BuscadorEstadoCaso/>
                <TablaEstadoCaso/>
            </Card>
        </>
    );
};

export default MainEstadoCaso;
